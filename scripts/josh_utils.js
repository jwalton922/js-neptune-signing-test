var JoshUtils = {};
JoshUtils.getSignatureKey = function (awsSecret, date, regionName, serviceName) {
    var kDate = CryptoJS.HmacSHA256(date, "AWS4" + awsSecret);
    var kRegion = CryptoJS.HmacSHA256(regionName, kDate);
    var kService = CryptoJS.HmacSHA256(serviceName, kRegion);
    var kSigning = CryptoJS.HmacSHA256("aws4_request", kService);
    return kSigning;
}

JoshUtils.createCanonicalRequestTest = function () {
    var method = 'GET';
    var server = 'iam.amazonaws.com';
    var date = '20150830T123600Z';
    var canonicalUri = '/';


    var canonicalHeaders = 'content-type:application/x-www-form-urlencoded; charset=utf-8\n' +
        'host:' + server + '\n' +
        'x-amz-date:' + date + '\n';
    var canonicalQueryString = 'Action=ListUsers&Version=2010-05-08';
    var signedHeaders = 'content-type;host;x-amz-date';
    var payload = '';
    var hashedPayload = CryptoJS.SHA256(payload);
    console.log("Hashed Payload: " + hashedPayload);
    var canonincalRequest = method + '\n'
        + canonicalUri + '\n'
        + canonicalQueryString + '\n'
        + canonicalHeaders + '\n'
        + signedHeaders + '\n'
        + hashedPayload;

    console.log("Canonical Request", canonincalRequest);
    var hashOfCanonicalRequest = CryptoJS.SHA256(canonincalRequest);
    console.log("Hashed canonical request", hashOfCanonicalRequest);
    return hashOfCanonicalRequest;
}

JoshUtils.createCanonicalRequest = function (date, signedHeaders, server, canonicalQueryString) {
    var method = 'GET';


    var canonicalUri = '/gremlin/';


    var canonicalHeaders = 'host:' + server + '\n'
        + 'x-amz-date:' + date + '\n';


    var payload = '';
    var hashedPayload = CryptoJS.SHA256(payload);
    console.log("Hashed Payload: " + hashedPayload);
    var canonincalRequest = method + '\n'
        + canonicalUri + '\n'
        + canonicalQueryString + '\n'
        + canonicalHeaders + '\n'
        + signedHeaders + '\n'
        + hashedPayload;

    console.log("Canonical Request", canonincalRequest);
    var hashOfCanonicalRequest = "" + CryptoJS.SHA256(canonincalRequest);
    console.log("Hashed canonical request: " + hashOfCanonicalRequest);
    return hashOfCanonicalRequest;
}

JoshUtils.webSocketCreateCanonicalRequest = function (datetime, signedHeaders, server, escapedQuery, algorithm, awsKey, credentialValue, sessionToken) {
    var method = 'GET';
    var canonicalUri = '/gremlin/';
    var canonicalHeaders = 'host:' + server + '\n';
    var payload = '';
    var hashedPayload = CryptoJS.SHA256(payload);
    // var canonicalQueryString ='gremlin='+escapedQuery+'&'+
    var canonicalQueryString = '' +
        'X-Amz-Algorithm=' + encodeURIComponent(algorithm) +
        '&X-Amz-Credential=' + credentialValue +
        '&X-Amz-Date=' + datetime +
        '&X-Amz-Expires=60' +
        '&X-Amz-Security-Token=' + encodeURIComponent(sessionToken) +
        '&X-Amz-SignedHeaders=' + encodeURIComponent(signedHeaders)

    console.log("Hashed Payload: " + hashedPayload);
    var canonincalRequest = method + '\n'
        + canonicalUri + '\n'
        + canonicalQueryString + '\n'
        + canonicalHeaders + '\n'
        + signedHeaders + '\n'
        + hashedPayload;

    console.log("websocket Canonical Request:\n" + canonincalRequest);
    var hashOfCanonicalRequest = "" + CryptoJS.SHA256(canonincalRequest);
    console.log("Hashed canonical request: " + hashOfCanonicalRequest);
    return hashOfCanonicalRequest;
}

JoshUtils.createStringToSign = function (algorithm, datetime, credentialScope, hashedCanonicalRequest) {

    var stringToSign = algorithm + '\n' +
        datetime + '\n' +
        credentialScope + '\n' +
        hashedCanonicalRequest;

    console.log("String to sign", stringToSign);
    return stringToSign;

}

JoshUtils.makeSignedQueryRequest = function () {
    var hashedTestCanonicalRequestTest = JoshUtils.createCanonicalRequestTest();
    console.log("Test hashed canonical result: " + hashedTestCanonicalRequestTest);
    console.log("                Should equal: f536975d06c0309214f805bb90ccff089219ecd68b2577efef23edd43b7e1a59");
    var testSigningKey = JoshUtils.getSignatureKey('wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY', '20150830', 'us-east-1', 'iam');
    console.log(" Test result: " + testSigningKey);
    console.log("Should match: c4afb1cc5771d871763a393e44b703571b55cc28424d1a5e86da6ed3c154a4b9");
    var testStringToSign = JoshUtils.createStringToSign('AWS4-HMAC-SHA256', '20150830T123600Z', '20150830/us-east-1/iam/aws4_request', hashedTestCanonicalRequestTest);
    console.log("Test string to sign\n" + testStringToSign);
    var testSignature = "" + CryptoJS.HmacSHA256(testStringToSign, testSigningKey);
    console.log("Test signature: " + testSignature);
    console.log("  Should match: 5d672d79c15b13162d9279b0855cfba6789a8edb4c82c400e06b5924a6f2b5d7");
    var server = JoshUtils.server;
    console.log("Server is: "+server);
    var algorithm = 'AWS4-HMAC-SHA256';
    var key = JoshUtils.key;
    var secret = JoshUtils.secret;
    var sessionToken = JoshUtils.sessionToken;
    console.log("Key: "+key);
    console.log("Secret: "+secret);
    console.log("Session token: "+sessionToken);
    var datetime = (new Date()).toISOString().replace(/[:\-]|\.\d{3}/g, '');
    var date = datetime.substr(0, 8);
    var region = 'us-east-1';
    var service = 'neptune-db';
    var credentialScope = date + '/' + region + '/' + service + '/aws4_request';
    var signedHeaders = 'host;x-amz-date';
    var query = 'g.V().count()';
    var escapedQuery = escape(query);
    var canonicalQueryString = 'gremlin=' + escapedQuery;
    console.log("Query: " + query + ". escapedQuery: " + escapedQuery);
    console.log("credential scope: " + credentialScope);
    console.log("Date: " + date + " DateTime: " + datetime);
    console.log("Region: " + region + " service: " + service);
    console.log("SignedHeaders: " + signedHeaders);
    var hashOfCanonicalRequest = JoshUtils.createCanonicalRequest(datetime, signedHeaders, server, canonicalQueryString);
    var stringToSign = JoshUtils.createStringToSign(algorithm, datetime, credentialScope, hashOfCanonicalRequest, region, service);
    var signingKey = JoshUtils.getSignatureKey(secret, date, region, service);
    var signature = "" + CryptoJS.HmacSHA256(stringToSign, signingKey);
    var authorizationHeaderValue = algorithm + ' Credential=' + key + '/' + credentialScope + ', SignedHeaders=' + signedHeaders + ', Signature=' + signature;
    console.log("Authorization header value: " + authorizationHeaderValue);
    var serverUrl = 'http://' + server + '/gremlin/';
    var headers = {};
    headers['Authorization'] = authorizationHeaderValue;
    headers['X-Amz-Date'] = datetime;
    headers['X-Amz-Security-Token'] = sessionToken;
    // headers['origin'] = 'localhost';
    // headers['host'] = server;
    console.log("Server url: " + serverUrl);
    $.ajax({
        type: "GET",
        accept: "application/json",
        //contentType:"application/json; charset=utf-8",
        url: serverUrl,
        data: {
            gremlin: query
        },
        headers: headers,
        timeout: 30000,
        success: function (data, textStatus, jqXHR) {
            var Data = data.result.data;
            console.log(Data);
            console.log("Results received");
            $("#loadingGetResults").show();
            $("#startGetTest").hide();
            $("#loadingGetResults").text("Success!: "+JSON.stringify(Data));
        },
        error: function (result, status, error) {
            console.log("Connection failed. " + status);
            console.log("Error", error);
            console.log("Error result", result);
            $("#loadingGetResults").show();
            $("#startGetTest").hide();
            $("#loadingGetResults").text("Error! Check console for more details.");
        }
    });
}



JoshUtils.run_websocket_request = function (gremlin_query, server_url, query_type, active_node, message, callback) {
    // $('#messageArea').html('<h3>(loading)</h3>');

    var msg = {
        "requestId": 'abcdef',
        "op": "eval",
        "processor": "",
        "args": {
            "gremlin": gremlin_query,
            "bindings": {},
            "language": "gremlin-groovy"
        }
    }

    var data = JSON.stringify(msg);

    var ws = new WebSocket(server_url);
    ws.onopen = function (event) {
        console.log("websocket on open called! Sending data", data);
        $("#startWsTest").hide();
        $("#loadingWsResults").show();
        $("#loadingWsResults").text("WS connected. Sending query...");
        ws.send(data, { mask: true });
    };
    ws.onerror = function (err) {
        console.log('Connection error using websocket');
        console.log(err);
        $("#startWsTest").hide();
        $("#loadingWsResults").show();
        $("#loadingWsResults").text("Error with websocket. See console for more details.");

    };
    ws.onmessage = function (event) {
        console.log("websocket on message called with event", event);
        var response = JSON.parse(event.data);
        var code = Number(response.status.code)
        if (!isInt(code) || code < 200 || code > 299) {
            $("#startWsTest").hide();
            $("#loadingWsResults").show();
            $("#loadingWsResults").text("Websocket message received with error code: "+code); 
            return 1;
        }
        var data = response.result.data;
        $("#startWsTest").hide();
        $("#loadingWsResults").show();
        $("#loadingWsResults").text("Websocket message received: "+JSON.stringify(data)); 
        //console.log(data)
        //console.log("Results received")
       
    };
}

JoshUtils.createWebsocketUrl = function () {
    var server = JoshUtils.server;
    var algorithm = 'AWS4-HMAC-SHA256';
    var key = JoshUtils.key;
    var secret = JoshUtils.secret;
    var sessionToken = JoshUtils.sessionToken;
    var datetime = (new Date()).toISOString().replace(/[:\-]|\.\d{3}/g, '');
    var date = datetime.substr(0, 8);
    var region = 'us-east-1';
    var service = 'neptune-db';
    var credentialScope = date + '/' + region + '/' + service + '/aws4_request';
    var signedHeaders = 'host';
    var query = 'g.V().count()';
    var escapedQuery = escape(query);
    var credentialValue = encodeURIComponent(key + '/' + credentialScope);
    var hashWsCanonicalRequest = JoshUtils.webSocketCreateCanonicalRequest(datetime, signedHeaders, server, escapedQuery, algorithm, key, credentialValue, sessionToken);
    var stringToSign = JoshUtils.createStringToSign(algorithm, datetime, credentialScope, hashWsCanonicalRequest);
    var signingKey = JoshUtils.getSignatureKey(secret, date, region, service);
    var signature = "" + CryptoJS.HmacSHA256(stringToSign, signingKey);

    // var queryString = 'gremlin='+escapedQuery+'&'+
    var queryString = '' +
        'X-Amz-Algorithm=' + algorithm +
        '&X-Amz-Credential=' + credentialValue +
        '&X-Amz-Date=' + datetime +
        '&X-Amz-Expires=60' +
        '&X-Amz-Security-Token=' + encodeURIComponent(sessionToken) +
        '&X-Amz-SignedHeaders=' + signedHeaders +
        '&X-Amz-Signature=' + signature;
    var url = 'ws://' + server + '/gremlin/?' + queryString;
    console.log("URL length: " + url.length);
    JoshUtils.run_websocket_request("g.V().count()", url, 'query', null, 'some message', function (data) {
        console.log("Callback of run_websoeckt_request", data);
    });
}
JoshUtils.readVariables = function(){
    this.server = $("#server_address").val()+':'+ $("#server_port").val();
    this.key = $("#aws_key").val();
    this.secret = $("#aws_secret").val();
    this.sessionToken = $("#aws_session").val();
    console.log("Server: "+this.server);
    console.log("Key: "+this.key);
}
JoshUtils.performTest = function () {
    JoshUtils.readVariables();
    console.log("Making signed query request");
    $("#startGetTest").hide();
    $("#loadingGetResults").show();    
    JoshUtils.makeSignedQueryRequest();    
};

JoshUtils.performWSTest = function () {
    JoshUtils.readVariables();
    console.log("Making websocket request");
    $("#startWsTest").hide();
    $("#loadingWsResults").show();
    $("#loadingWsResults").text("Opening websocket connection..."); 
    JoshUtils.createWebsocketUrl();
};







# js-neptune-signing-test

This project is to test signing requests to a Neptune cluster with IAM DB Authentication enabled.

Note I had to accept the certificate for the Neptune domain by opening the URL in a different tab and accepting it as safe. For example, for my server I used: https://dev-de-joshtest-wss-cluster.cluster-cqpdxjaydk1j.us-east-1.neptune.amazonaws.com:8182/gremlin/.

If you want to see it work in Chrome (on a Mac), you need to run something like:
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-web-security --user-data-dir $pathToSomeDir

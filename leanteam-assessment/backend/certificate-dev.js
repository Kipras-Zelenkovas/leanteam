import { createCA, createCert } from "mkcert";

const ca = await createCA({
    organization: "My Organization",
    countryCode: "US",
    state: "California",
    locality: "San Francisco",
    validity: 365,
    length: 2048,
});

const cert = await createCert({
    ca: { key: ca.key, cert: ca.cert },
    domains: ["localhost", "127.0.0.1"],
    validity: 365,
});

console.log(ca.cert);
console.log(cert.cert);
console.log(cert.key);

//  The code above creates a self-signed certificate authority and a certificate for the  localhost  domain.
//  To run the code, execute the following command in your terminal:
//  node backend/certificate-dev.js

//  The code will output the certificate authority, certificate, and private key.
//  The certificate authority is used to sign the certificate. The certificate is used to encrypt the communication between the client and the server. The private key is used to decrypt the communication.
//  Step 3: Create the HTTPS Server
//  To create an HTTPS server, you need to use the  https  module.
//  The following code creates an HTTPS server that listens on port  3000  and serves a simple message.

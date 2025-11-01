🗓️ 25072024 1518

# ssl_overview
## Concepts
| Term                      | Description                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| `SSL / TLS`               | Protocols that encrypt data transmitted over internet to protect against eavesdropping / tampering |
| `SSL certificates`        | Digital documents that authenticates website's identify / enable encrypted connections             |
| `Certificate Authorities` | Trusted entities that issue / validate       SSL certs                                             |
| `Certificate A`           |                                                                                                    |
SSL/TLS: These are protocols that encrypt data transmitted over the internet to protect it from eavesdropping or tampering.
SSL Certificates: Digital documents that authenticate a website's identity and enable encrypted connections.
Certificate Authorities (CAs): Trusted entities that issue and validate SSL certificates.
Certificate Chain: A hierarchy of certificates, starting with the server's certificate, then intermediate certificates issued by CAs, and ending with a root certificate from a well-known CA.
Truststore: A file within the Java environment (cacerts) containing trusted root certificates.
Why the error occurs:

Missing Root Certificate: The server's SSL certificate is signed by a CA whose root certificate is not present in the Java truststore.
Self-Signed Certificate: The server uses a self-signed certificate that is not recognized by the Java truststore.
Intermediate Certificate Issues: There might be a problem with intermediate certificates in the chain, like expiration or revocation.
Firewall or Network Restrictions: Firewalls or network configurations can sometimes block access to the CA's servers for certificate verification.

---

## References

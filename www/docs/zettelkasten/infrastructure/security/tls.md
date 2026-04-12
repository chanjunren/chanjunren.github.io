# tls

**What it is:**
- **Transport Layer Security** — protocol that encrypts data in transit between two parties (e.g., browser and server)
- Successor to SSL (SSL is deprecated — "SSL" in common usage usually means TLS)
- Sits between the application layer (HTTP) and the transport layer (TCP) — hence HTTPS = HTTP over TLS

**Problem it solves:**
- Without TLS: data transmitted in plaintext — passwords, tokens, API keys visible to anyone on the network
- Without TLS: no way to verify you're talking to the real server — man-in-the-middle attacks trivial
- TLS provides **confidentiality** (encryption), **integrity** (tamper detection), and **authentication** (server identity via [[tls_certificates]])

## Two Types of Encryption

### Symmetric encryption
- Same key encrypts and decrypts
- Fast — used for bulk data transfer
- Problem: how do both parties agree on the key without an eavesdropper learning it?
- Examples: AES-128, AES-256, ChaCha20

### Asymmetric encryption (public-key cryptography)
- Two keys: **public key** (anyone can have) and **private key** (kept secret)
- Data encrypted with public key can only be decrypted with private key
- Slow — not practical for bulk data
- Used to securely exchange the symmetric key
- Examples: RSA, ECDSA, Ed25519

TLS uses **asymmetric encryption to exchange a symmetric key**, then **symmetric encryption for the actual data**. Best of both worlds.

## The TLS Handshake

The handshake establishes a secure connection before any application data is sent.

### TLS 1.2 handshake (simplified)
1. **ClientHello**: client sends supported TLS versions, cipher suites, and a random number
2. **ServerHello**: server picks a cipher suite, sends its [[tls_certificates]] and a random number
3. **Certificate verification**: client checks the certificate against trusted [[certificate_authorities]]
4. **Key exchange**: client and server derive a shared secret (using ECDHE or RSA key exchange)
5. **Finished**: both sides confirm — all subsequent data encrypted with the shared symmetric key

This takes **2 round trips** before any application data can be sent.

### TLS 1.3 handshake (current standard)
- Reduced to **1 round trip** — client sends key share in the first message
- Removed insecure options: no RSA key exchange, no CBC ciphers, no SHA-1
- Only supports forward-secret key exchanges (ECDHE)
- **0-RTT resumption**: returning clients can send data in the first message (at the cost of replay risk)

## Cipher Suites

A cipher suite defines the algorithms used for each part of the connection:
- **Key exchange**: how the symmetric key is derived (ECDHE)
- **Authentication**: how the server proves identity (RSA, ECDSA)
- **Bulk encryption**: how data is encrypted (AES-256-GCM, ChaCha20-Poly1305)
- **Hash**: integrity checking (SHA-256, SHA-384)

Example: `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`
- Key exchange: ECDHE
- Auth: RSA
- Encryption: AES-256-GCM
- Hash: SHA-384

TLS 1.3 simplified this — only 5 cipher suites, all secure by default.

## Forward Secrecy

- With RSA key exchange: if the server's private key is ever compromised, **all past recorded traffic** can be decrypted
- With ECDHE (Ephemeral Diffie-Hellman): each connection uses a temporary key pair — even if the long-term key leaks, past sessions remain safe
- TLS 1.3 requires forward secrecy; TLS 1.2 supports it but doesn't mandate it

```ad-warning
**TLS 1.0 and 1.1 are deprecated**: Major browsers dropped support in 2020. PCI DSS compliance requires TLS 1.2 minimum. Configure servers to only accept TLS 1.2 and 1.3.
```

```ad-example
**TLS in practice**: When you visit `https://example.com`, your browser performs a TLS handshake in ~50-100ms, verifies the server's certificate, negotiates AES-256 encryption, and then sends the HTTP request — all before you see a single pixel. Every subsequent request on that connection reuses the established keys.
```

---

## References

- https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security
- https://tls13.xargs.org/ (byte-by-byte walkthrough of TLS 1.3 handshake)
- https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/

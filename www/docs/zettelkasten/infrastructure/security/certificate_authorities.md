# certificate_authorities

**What it is:**
- Trusted third parties that issue and validate [[tls_certificates]]
- The foundation of the web's trust model — your browser trusts ~150 root CAs, and those CAs vouch for servers
- Without CAs: no way to verify that a certificate actually belongs to who it claims

**Problem it solves:**
- Anyone can generate a certificate — CAs verify that the requester actually controls the domain/organization
- Browsers need a starting point for trust — CAs provide that anchor
- Certificate lifecycle (issuance, renewal, revocation) needs a governing authority

## Trust Model

### Chain of trust
- **Root CAs**: self-signed certificates pre-installed in browsers and operating systems (~150 globally)
- **Intermediate CAs**: signed by root CAs, used to sign server certificates
- **Server certificates**: signed by intermediate CAs, presented during [[tls|TLS handshake]]

Why intermediates? Root CA private keys are kept offline in secure facilities. Intermediates handle day-to-day signing — if an intermediate is compromised, the root can revoke it without replacing every trusted root in every browser.

### Verification
When a client receives a certificate:
1. Check server cert is signed by an intermediate CA
2. Check intermediate is signed by a root CA
3. Check root CA is in the client's trust store
4. Check none of the certs are expired or revoked (see [[ocsp]])

If any step fails — connection rejected.

## Let's Encrypt and ACME

- **Let's Encrypt**: free, automated CA — issues Domain Validation (DV) certificates
- **ACME protocol** (Automated Certificate Management Environment): how clients request and renew certs programmatically
- Auto-renewal every 60-90 days eliminates manual cert management
- Tools: Certbot, Traefik (built-in), Caddy (built-in), acme.sh

### Rate limits
- 50 certificates per registered domain per week
- 5 duplicate certificates per week
- Usually fine for normal usage; can bite you if containers keep re-issuing on restart (see [[docker_tls_termination]] for volume-based persistence)

## Certificate Revocation

When a certificate's private key is compromised, it must be invalidated before expiry:
- **CRL (Certificate Revocation List)**: CA publishes full list of revoked certs periodically — clients download and check. Slow, stale.
- **[[ocsp]]**: client queries CA for a single cert's status in real-time. Faster, but has privacy and availability concerns.
- **OCSP Stapling**: server pre-fetches its own OCSP response and includes it in TLS handshake — recommended approach.

## Commercial CAs vs Let's Encrypt

| | Let's Encrypt | Commercial CAs |
|---|---|---|
| Cost | Free | Paid |
| Cert types | DV only | DV, OV, EV |
| Validity | 90 days (forces automation) | Up to 1 year |
| Issuance | Automated (ACME) | Manual or automated |
| Use when | Most services, automation-first | Compliance requires specific CA or OV/EV |

```ad-danger
**CA compromise is catastrophic**: If a root CA's private key is leaked, every certificate it signed (millions) becomes untrustworthy. This has happened — DigiNotar (2011) was removed from all trust stores after a breach. This is why Certificate Transparency logs exist: public, append-only records of every issued certificate, so rogue issuance can be detected.
```

```ad-warning
**Self-signed certificates bypass the CA trust model entirely**: They work for encryption but provide no identity verification. Browsers show security warnings. Only use for local development or internal services where you control the trust store.
```

---

## References

- https://letsencrypt.org/how-it-works/
- https://www.ssl.com/faqs/what-is-a-certificate-authority/
- https://certificate.transparency.dev/

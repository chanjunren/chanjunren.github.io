🗓️ 03042026 2100

# tls_certificates

**What it is:**
- Digital documents that prove a server's identity and enable encrypted connections
- Issued by **Certificate Authorities (CAs)** — trusted third parties that verify ownership
- The foundation of HTTPS — without a valid certificate, browsers show security warnings

**Problem it solves:**
- Without certificates: no way to verify you're talking to the real server (man-in-the-middle attacks)
- Without encryption: data transmitted in plaintext — passwords, tokens, client data exposed
- Multi-client deployments need valid certificates per domain to maintain trust

## How TLS Works (Simplified)

### Handshake
1. Client connects and requests server's certificate
2. Client verifies certificate against trusted CAs
3. Client and server negotiate encryption keys
4. All subsequent traffic is encrypted

### Certificate chain
- **Root CA** → **Intermediate CA** → **Server certificate**
- Browsers trust root CAs; intermediates are signed by roots; your cert is signed by an intermediate
- If any link in the chain is invalid, expired, or revoked — connection fails

## Certificate Types

### Domain Validation (DV)
- Proves you control the domain (automated DNS/HTTP challenge)
- Cheapest, fastest — Let's Encrypt issues these for free
- Sufficient for most services

### Organization Validation (OV)
- Verifies organization identity in addition to domain
- Used by businesses wanting visible org name in cert details

### Extended Validation (EV)
- Strictest verification, legal entity checks
- No longer shows green bar in modern browsers — diminished visual benefit
- Skip unless compliance requires it

## Let's Encrypt and ACME

- **Let's Encrypt**: Free, automated CA — issues DV certificates
- **ACME protocol**: Automated Certificate Management Environment — how clients request/renew certs
- Auto-renewal every 60-90 days eliminates manual cert management
- Tools: Certbot, Traefik (built-in), Caddy (built-in), acme.sh

For multi-client Docker deployments, see [[docker_tls_termination]] for how to automate this with a [[reverse_proxy]].

## Certificate Revocation

When a certificate's private key is compromised, it must be revoked before expiry:
- **CRL (Certificate Revocation List)**: CA publishes list of revoked certs; clients download and check
- **[[ocsp]]**: Client queries CA in real-time to check single cert status
- **OCSP Stapling**: Server pre-fetches its own OCSP response and includes it in TLS handshake — faster, more private

## Multi-Client Certificate Strategy

For one server hosting multiple clients:
- **Separate domains**: `client-a.example.com`, `client-b.example.com` — separate cert per domain or one wildcard
- **Wildcard cert** (`*.example.com`): Covers all subdomains, simpler management, but if compromised all clients are affected
- **SAN cert**: Single cert listing multiple domains — less flexible than wildcard but more specific
- **Per-client certs**: Maximum isolation, more operational overhead

## Trade-offs

### Let's Encrypt (free, automated)
- 90-day validity forces automation — good practice
- Rate limits: 50 certs/domain/week (usually fine)
- No OV/EV — DV only

### Commercial CAs
- Longer validity (up to 1 year), OV/EV available
- Costs money, manual renewal unless integrated
- Required if compliance mandates specific CA

```ad-danger
**Expired certificates break everything**: Browsers block access, API clients reject connections, mobile apps crash. Automate renewal with ACME — never rely on manual renewal for production.
```

```ad-warning
**Wildcard certs share a single private key for all subdomains**: If the key leaks, every client subdomain is compromised. For high-security multi-tenant setups, consider per-client certificates instead.
```

---

## References

- https://letsencrypt.org/how-it-works/
- https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security
- https://www.ssl.com/faqs/what-is-a-certificate-authority/

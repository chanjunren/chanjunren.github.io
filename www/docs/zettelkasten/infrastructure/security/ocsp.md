🗓️ 03042026 2100

# ocsp

**What it is:**
- **Online Certificate Status Protocol** — real-time check of whether a [[tls_certificates]] has been revoked
- Client sends certificate serial number to CA's OCSP responder, gets back "good", "revoked", or "unknown"
- Lighter alternative to downloading full Certificate Revocation Lists (CRLs)

**Problem it solves:**
- CRLs grow large (thousands of entries) and must be downloaded entirely — slow, bandwidth-heavy
- Without revocation checking: a compromised certificate remains trusted until it expires
- Critical for multi-client setups — if one client's cert key leaks, you need immediate revocation

## OCSP vs CRL

### CRL (older approach)
- CA publishes a list of all revoked certs periodically
- Client downloads entire list and checks if cert is on it
- Problems: stale (updated on schedule, not real-time), large downloads, cache issues

### OCSP (improvement)
- Query for a single cert's status in real-time
- Small request/response — fast
- But: introduces a privacy concern — CA sees which sites you visit
- And: if OCSP responder is down, what happens? (see soft-fail vs hard-fail below)

## OCSP Stapling

Server pre-fetches its own OCSP response and includes it in the TLS handshake:
- **Client never contacts the CA** — faster handshake, no privacy leak
- Server caches the signed response (valid for hours/days)
- If stapled response is missing or expired, client can fall back to direct OCSP query

This is the recommended approach — configure it on your [[reverse_proxy]] or web server.

### Must-Staple
- Certificate extension that tells clients to REQUIRE a stapled OCSP response
- If server doesn't staple, client rejects the connection (hard-fail)
- Prevents downgrade to soft-fail — stronger security but less forgiving of misconfiguration

## Soft-Fail vs Hard-Fail

### Soft-fail (default in most browsers)
- If OCSP responder is unreachable, treat certificate as valid
- Prioritizes availability over security
- An attacker who can block OCSP traffic can use a revoked cert

### Hard-fail
- If OCSP responder is unreachable, reject the certificate
- More secure but causes outages if CA's OCSP responder goes down
- Only practical with OCSP stapling (server controls the fetch, not the client)

## What This Means for Your Setup

For a single server with multiple clients:
- Enable **OCSP stapling** on your reverse proxy (nginx, Traefik, Caddy)
- Caddy and Traefik enable it by default; nginx needs explicit config
- Stapling improves TLS handshake speed for all clients
- If you revoke a compromised cert, stapling ensures clients learn about it quickly
- Consider **Must-Staple** for high-security client deployments

See [[docker_tls_termination]] for how to configure this in a Docker Compose setup.

```ad-warning
**Soft-fail OCSP is security theater**: Most browsers silently accept certificates when OCSP responders are unreachable. An attacker who controls network traffic can block OCSP and use a revoked cert. OCSP stapling with Must-Staple is the only reliable defense.
```

---

## References

- https://developer.mozilla.org/en-US/docs/Web/Security/Certificate_Transparency
- https://letsencrypt.org/docs/revoking/
- https://www.ssl.com/article/how-do-browsers-handle-revoked-ssl-tls-certificates/

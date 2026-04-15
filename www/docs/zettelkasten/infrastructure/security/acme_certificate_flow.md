🗓️ 15042026 1200

# acme_certificate_flow

**What it is:**
- **ACME** (Automated Certificate Management Environment) — a protocol for automatically requesting, validating, and renewing [[tls_certificates]] from a CA (see [[certificate_authorities]])
- **Let's Encrypt** — the most widely used free CA that speaks ACME, issuing Domain Validation (DV) certs
- **Certbot** — the most common ACME client; a CLI tool that handles the full cert lifecycle

**Why it exists:**
- Before ACME: buying certs manually, pasting CSRs into web forms, remembering to renew before expiry
- ACME automates the entire flow — request, prove domain ownership, receive cert, renew on schedule
- Let's Encrypt + ACME made HTTPS free and automatic, removing the last excuse for unencrypted traffic

## The Issuance Flow

### Step 1 — Account registration
- ACME client (Certbot, Traefik, Caddy) registers with the CA
- Generates a key pair; the public key identifies the account going forward
- One-time setup — subsequent requests reuse the account

### Step 2 — Certificate request
- Client tells the CA: "I want a cert for `example.com`"
- CA responds with one or more **challenges** — tasks that prove you control the domain

### Step 3 — Domain validation (the challenge)
- Client completes a challenge to prove domain ownership
- CA verifies the challenge from its servers
- If verification passes, the domain is **authorized**

### Step 4 — Certificate signing
- Client generates a **CSR** (Certificate Signing Request) containing the domain and a new public key
- Sends the CSR to the CA, signed with the account key
- CA signs the certificate and returns it along with the intermediate chain

### Step 5 — Installation
- Client installs the cert and private key where the web server can use it
- For [[docker_tls_termination]], the reverse proxy (Traefik, Caddy, nginx) picks it up automatically or via reload

## Challenge Types

### HTTP-01
- CA tells client: "place this token at `http://example.com/.well-known/acme-challenge/<token>`"
- Client creates the file, CA fetches it from port 80
- **Simplest** — works for any server that can serve files on port 80
- Cannot do wildcard certs (no way to validate `*.example.com` via HTTP)

### DNS-01
- CA tells client: "create a TXT record `_acme-challenge.example.com` with this value"
- Client creates the DNS record, CA queries DNS to verify
- **Required for wildcard certs** (`*.example.com`)
- More complex — needs DNS API access (Cloudflare, Route53, etc.)
- Useful when port 80 is blocked or the server isn't publicly reachable

### TLS-ALPN-01
- Proves control via a self-signed cert on port 443 with a special ALPN extension
- Niche — used when port 80 is unavailable but 443 is open
- Traefik and Caddy support it; Certbot does not

## Certbot

- Most popular standalone ACME client
- Runs as a CLI tool or cron job on the server
- Handles the full lifecycle: register, challenge, fetch cert, install, renew

### Common usage
- `certbot certonly --webroot -w /var/www/html -d example.com` — HTTP-01 via existing web server
- `certbot certonly --standalone -d example.com` — spins up its own temporary server on port 80
- `certbot certonly --dns-cloudflare -d *.example.com` — DNS-01 via Cloudflare API
- `certbot renew` — renews all certs nearing expiry (run via cron or systemd timer)

### Certbot vs built-in ACME
- **Certbot**: standalone tool, works with any web server, requires cron for renewal
- **Traefik / Caddy**: ACME built into the proxy itself — zero-touch cert management, no separate tool needed
- For Docker setups, built-in ACME is simpler — see [[docker_tls_termination]]

## Renewal

- Let's Encrypt certs expire after **90 days** (intentionally short to force automation)
- ACME clients typically renew at 60 days (30-day buffer)
- Renewal repeats the challenge flow — re-proves domain ownership
- If renewal fails silently, the cert expires and HTTPS breaks — always monitor cert expiry

```ad-warning
Let's Encrypt enforces **rate limits**: 50 certs per registered domain per week, 5 duplicate certs per week. Containers that re-request certs on every restart can exhaust limits. Always persist cert storage to a volume.
```

```ad-example
Certbot standalone flow: `certbot certonly --standalone -d api.example.com` → Certbot starts a temporary HTTP server on port 80 → Let's Encrypt sends an HTTP-01 challenge → Certbot serves the token → Let's Encrypt verifies → cert written to `/etc/letsencrypt/live/api.example.com/`.
```

---

## References

- https://letsencrypt.org/how-it-works/
- https://datatracker.ietf.org/doc/html/rfc8555
- https://certbot.eff.org/

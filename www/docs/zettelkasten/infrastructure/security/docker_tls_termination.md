🗓️ 03042026 2100

# docker_tls_termination

**What it is:**
- Pattern where a [[reverse_proxy]] container handles all TLS encryption/decryption
- Backend containers communicate over plain HTTP within the Docker network
- The proxy holds the [[tls_certificates]] and terminates HTTPS connections

**Problem it solves:**
- Each backend service managing its own certificates is operational chaos
- Certificate renewal, OCSP stapling, TLS version management — centralize it in one place
- Multi-client Docker deployments need automated certificate management per domain

## Architecture

```
Client → HTTPS → [Reverse Proxy Container] → HTTP → [App Containers]
                   (holds certs, terminates TLS)      (internal network only)
```

- Proxy and app containers share a [[docker_networking]] bridge network
- App containers are NOT exposed to the host — only the proxy binds ports 80/443
- Internal traffic is unencrypted but isolated within Docker's virtual network

## Reverse Proxy Options for Docker

### Traefik
- Docker-native: auto-discovers services via container labels
- Built-in Let's Encrypt (ACME) — automatic cert provisioning and renewal
- Built-in [[ocsp]] stapling
- Best for: dynamic multi-client setups where services come and go

### Caddy
- Automatic HTTPS by default — zero-config TLS for any domain
- Built-in ACME, OCSP stapling, HTTP/3
- Simpler config than nginx/Traefik
- Best for: simplicity-first deployments

### nginx
- Most widely used, battle-tested, highest performance
- Requires manual ACME setup (Certbot sidecar or cron) and explicit OCSP stapling config
- Best for: teams already familiar with nginx, complex routing needs

## Multi-Client TLS Pattern

For one server hosting multiple client domains:
- Reverse proxy listens on 443, routes by domain (SNI — Server Name Indication)
- Each client domain gets its own certificate (auto-provisioned via ACME)
- Proxy handles renewal — no downtime, no manual intervention
- Combine with [[docker_compose_profiles]] to manage per-client app stacks behind the shared proxy

### Shared proxy, isolated backends
- Proxy container has no profile (always runs)
- Per-client app containers tagged with client profile
- Per-client [[docker_networking]] networks — proxy joins all, clients only join their own
- Result: client-a's containers cannot reach client-b's containers

## Certificate Storage

- Certificates and private keys need to persist across proxy container restarts
- Mount a [[docker_volumes]] volume for the cert directory
- Traefik: `acme.json` stores all certs; Caddy: `$HOME/.local/share/caddy`
- Back up cert storage — losing it means re-issuing all certificates (rate limits apply)

## Security Checklist

- TLS 1.2 minimum (disable TLS 1.0, 1.1, SSLv3)
- Enable OCSP stapling (see [[ocsp]])
- HSTS header (Strict-Transport-Security) — forces HTTPS for returning visitors
- Redirect HTTP → HTTPS at the proxy
- Proxy container runs as non-root where possible (see [[dockerfile_best_practices]])
- Private keys readable only by the proxy process (file permissions on volume)

```ad-danger
**Exposing backend containers directly to the internet**: If app containers bind to host ports alongside the proxy, they bypass TLS entirely. Only the reverse proxy should bind ports 80/443. Backend containers should only be reachable via internal Docker networks.
```

```ad-warning
**Certificate storage without volumes**: If the proxy container is recreated without a persistent volume for certs, all certificates are lost. Let's Encrypt rate limits (50 certs/domain/week) may prevent immediate re-issuance.
```

---

## References

- https://doc.traefik.io/traefik/https/acme/
- https://caddyserver.com/docs/automatic-https
- https://nginx.org/en/docs/http/configuring_https_servers.html

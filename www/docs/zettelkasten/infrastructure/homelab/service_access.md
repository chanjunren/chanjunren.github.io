🗓️ 11102026 1535

# service_access

Service access connects a user or device to an application. DNS resolves names; a reverse proxy routes HTTPS; remote access controls entry to the home network.

## One local request

```mermaid
sequenceDiagram
  participant U as Browser
  participant D as Local DNS
  participant P as Reverse proxy
  participant A as Application
  U->>D: Resolve app.home
  D-->>U: Proxy address
  U->>P: HTTPS request for app.home
  P->>A: Forward request to private service port
  A-->>P: Response
  P-->>U: HTTPS response
```

DNS does not authenticate users. TLS protects transport and binds certificates to names. It does not authorize application actions. A proxy is another trust boundary; keep backend ports private.

## Remote access options

- **VPN:** WireGuard connects authenticated devices to private networks.
- **Managed overlay:** Tailscale simplifies enrollment; its control plane adds dependency.
- **Self-hosted overlay:** Headscale offers control but adds operations.
- **Public proxy:** HTTPS exposes selected services and increases attack surface.
- **Vendor relay:** Avoids router changes but depends on provider limits.

Keep admin interfaces and databases private. Never forward DSM, SSH, database, or container-control ports publicly. Caddy and Traefik are open-source proxy options. See [[reverse_proxy]] and [[nginx_config_structure]].

## Common failures

Timeouts suggest routing or firewall problems. Refused connections suggest a listener or port mismatch. TLS errors point to names, certificates, or proxy configuration. Access denials belong to application authentication or authorization.

## Hands-on project

Give a test app a local DNS name and HTTPS proxy. Connect remotely through a VPN. Confirm DSM remains private. Preserve local recovery access before changing network rules.

## References

- [[reverse_proxy]]
- [[tls]]
- [[acme_certificate_flow]]
- [[dns_tools]]
- [WireGuard documentation](https://www.wireguard.com/)
- [Caddy documentation](https://caddyserver.com/docs/)

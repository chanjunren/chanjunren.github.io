🗓️ 07112025 1442

# forward_proxy

**Core Concept**: 
- Server between clients and the internet
- Forwards client requests to external servers on behalf of clients
- Hides client identity (external servers see proxy IP)
- Provides access control and content filtering

## Why It Matters

- **Client anonymity** - external servers see proxy IP, not client IP
- **Access control** - centralized point to enforce organizational policies
- **Content filtering** - block access to specific websites/content
- **Bandwidth optimization** - cache frequently accessed content

## When to Use

- Need to **control internet access** in corporate network
- Want to **cache external content** to reduce bandwidth
- Need to **anonymize client requests** for privacy
- Want to **bypass geo-restrictions** or censorship
- Need **centralized logging** of outbound traffic
- Require **malware/content filtering** before content reaches clients

## When Not to Use

- Direct internet access needed for performance (gaming, real-time apps)
- Client needs direct connection for protocol reasons (P2P, WebRTC)
- Small network where overhead exceeds benefits
- Cloud environments (typically use NAT gateway instead)

## Trade-offs

**Benefits:**
- Enhanced privacy (hides client IP)
- Centralized access control
- Bandwidth savings (caching)
- Content filtering and security
- Simplified network management

**Drawbacks:**
- Additional latency for requests
- Single point of failure
- Privacy concerns (proxy sees all traffic)
- Can break client applications expecting direct access
- SSL interception raises security concerns

## Key Distinctions

**Forward Proxy vs Reverse Proxy:**
- **Forward Proxy**: Works for clients, servers see proxy IP
- **Reverse Proxy**: Works for servers, clients see proxy IP
- Forward proxy = client-side; reverse proxy = server-side

**Forward Proxy vs VPN:**
- **Proxy**: Application-level (HTTP/HTTPS), per-app configuration
- **VPN**: Network-level (all traffic), system-wide
- VPN more comprehensive; proxy more targeted

This contrasts with [[reverse_proxy]] which proxies for servers rather than clients.

## Common Use Cases

### Corporate Network Access Control
Organizations use forward proxies to control which websites employees can access.

### Content Caching
ISPs and large organizations cache popular content to reduce bandwidth costs.

### Anonymity/Privacy
Users route traffic through proxy to hide identity from destination servers.

### Bypassing Restrictions
Access geo-blocked content or bypass firewalls by routing through proxy in different location.

## Common Pitfalls

```ad-warning
**SSL/TLS interception issues**: If proxy intercepts HTTPS, must install custom CA certificate on all clients. Otherwise, SSL errors occur.
```

```ad-danger
**Proxy auto-configuration (PAC) complexity**: Incorrect PAC files can break internet access. Keep PAC logic simple and well-tested.
```

## Quick Reference

### Popular Forward Proxy Solutions

| Solution | Type | Strengths | Use Case |
|----------|------|-----------|----------|
| **Squid** | Open source | Mature, caching | Corporate networks |
| **Privoxy** | Open source | Privacy-focused | Ad-blocking, privacy |
| **Tinyproxy** | Open source | Lightweight | Resource-constrained |
| **CCProxy** | Commercial | Easy Windows setup | Windows networks |
| **Shadowsocks** | Open source | Circumvention | Bypassing censorship |

### Proxy Types

**HTTP Proxy:**
- Handles HTTP/HTTPS traffic
- Can cache content
- Most common type

**SOCKS Proxy:**
- Protocol-agnostic (works with any TCP/UDP)
- No caching
- Lower-level than HTTP proxy

**Transparent Proxy:**
- Intercepts traffic without client configuration
- Client unaware of proxy
- Set up at network level

**Anonymous Proxy:**
- Hides client IP but identifies as proxy
- Reveals proxy IP to server

**Elite/High Anonymity Proxy:**
- Hides client IP and doesn't identify as proxy
- Server doesn't know request came through proxy

### Client Configuration

**Manual Proxy Configuration:**
```
HTTP Proxy: proxy.company.com
Port: 8080
HTTPS Proxy: proxy.company.com
Port: 8080
Bypass proxy for: localhost, 127.0.0.1, *.internal.company.com
```

**PAC (Proxy Auto-Configuration):**
```javascript
function FindProxyForURL(url, host) {
    // Direct access for local networks
    if (isPlainHostName(host) || 
        shExpMatch(host, "*.internal.company.com") ||
        isInNet(host, "10.0.0.0", "255.0.0.0"))
        return "DIRECT";
    
    // Use proxy for everything else
    return "PROXY proxy.company.com:8080; DIRECT";
}
```

### Squid Basic Configuration

```conf
# Port to listen on
http_port 3128

# Access control lists
acl localnet src 10.0.0.0/8
acl SSL_ports port 443
acl Safe_ports port 80 443 21 22

# Deny access to blocked sites
acl blocked_sites dstdomain .facebook.com .twitter.com
http_access deny blocked_sites

# Allow local network
http_access allow localnet

# Deny everything else
http_access deny all

# Cache settings
cache_dir ufs /var/spool/squid 10000 16 256
maximum_object_size 100 MB
```

### Request Flow

```
Client App → Forward Proxy → [Access Control] → [Cache Check] → Internet Server
                          ↓
                    [Content Filter]
                          ↓
                      [Logging]
                          ↓
Client App ← [Cache Store if needed] ← Forward Proxy ← Internet Server
```

---

## References

- http://www.squid-cache.org/
- https://www.rfc-editor.org/rfc/rfc3143.html


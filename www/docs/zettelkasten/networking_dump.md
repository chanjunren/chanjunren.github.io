🗓️ 04102025 0025
📎

# Networking Tools Overview

Quick reference hub for networking command-line tools.

---

## Tool Categories

| Purpose | Tools | Detail Notes |
|---------|-------|--------------|
| **DNS lookup** | `dig`, `nslookup`, `host` | [[networking_dns_tools]] |
| **Test connectivity** | `ping`, `traceroute` | [[networking_connectivity]] |
| **HTTP/APIs** | `curl`, `wget` | [[networking_http_tools]] |
| **Ports/connections** | `netstat`, `ss`, `lsof` | [[networking_ports_connections]] |
| **Network config** | `ip`, `ifconfig` | [[networking_interfaces]] |
| **Advanced debugging** | `tcpdump`, `nmap` | [[networking_advanced_debugging]] |
| **DNS overrides** | `/etc/hosts` | [[networking_etc_hosts]] |

---

## Quick Command Reference

```bash
# Connectivity
ping example.com              # Test if host is reachable
traceroute example.com        # See network path

# DNS
dig example.com               # DNS lookup
dig @8.8.8.8 example.com     # Query specific DNS server

# HTTP
curl https://example.com      # Test HTTP
curl -I https://example.com   # Headers only

# Ports
netstat -tuln                 # Listening ports
lsof -i :8080                # What's using port 8080?

# Network Info
ip addr show                  # Show IPs (Linux)
ifconfig                      # Show IPs (Mac)
```

---

## Troubleshooting Flow

```
Website not loading?
  ↓
1. ping google.com         → Network working?
  ↓
2. dig example.com         → DNS resolving?
  ↓
3. ping example.com        → Host reachable?
  ↓
4. curl -I example.com     → Web server responding?
```

---

# References

- [[networking_dns_tools]] - DNS tools (dig, nslookup, host, whois)
- [[networking_connectivity]] - Connectivity tools (ping, traceroute)
- [[networking_http_tools]] - HTTP tools (curl, wget)
- [[networking_ports_connections]] - Port tools (netstat, ss, lsof)
- [[networking_interfaces]] - Interface tools (ip, ifconfig)
- [[networking_advanced_debugging]] - Advanced tools (tcpdump, nmap)
- [[networking_etc_hosts]] - Local DNS overrides
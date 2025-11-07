🗓️ 07112025 1444

# load_balancer

**Core Concept**: 
- Distributes incoming network traffic across multiple backend servers
- Ensures no single server becomes overwhelmed
- Improves availability and performance
- Enables horizontal scaling

## Why It Matters

- **High availability** - if one server fails, traffic routes to healthy servers
- **Horizontal scaling** - add/remove servers without downtime
- **Performance** - distributes load to prevent server overload
- **Resource utilization** - ensures even distribution of work

## When to Use

- **Multiple backend servers** serving same application
- Need **zero-downtime deployments** (rolling updates)
- Require **high availability** (failover to healthy servers)
- Want to **scale horizontally** (add more servers for capacity)
- Need to **handle traffic spikes** without degradation
- Require **health checking** to detect failed servers

## When Not to Use

- Single backend server (no servers to balance across)
- Very low traffic that single server handles easily
- Services that require session affinity that can't be achieved
- Cost-sensitive scenarios where single server sufficient

## Trade-offs

**Benefits:**
- Improved availability (automatic failover)
- Better performance (distributed load)
- Easier scaling (add/remove servers)
- No single point of failure (if LB is redundant)
- Health checking prevents routing to failed servers

**Drawbacks:**
- Load balancer itself can be single point of failure
- Additional cost (infrastructure or service fees)
- Slight latency increase (extra hop)
- Session management complexity
- Need to configure health checks properly

## Key Distinctions

**Load Balancer vs Reverse Proxy:**
- **Load Balancer**: Focused on distributing traffic across servers
- **Reverse Proxy**: Broader (caching, SSL, compression, routing)
- Load balancing is a feature of reverse proxies
- Many reverse proxies ([[reverse_proxy]]) include load balancing

**Layer 4 vs Layer 7 Load Balancing:**
- **Layer 4 (Transport)**: Routes based on IP/port, faster, protocol-agnostic
- **Layer 7 (Application)**: Routes based on HTTP headers/URL, slower, more features
- L4 for raw performance; L7 for intelligent routing

This is a specific use case of [[reverse_proxy]] focused on traffic distribution. Often combined with [[api_gateway]] for comprehensive API management.

## Load Balancing Algorithms

### Round Robin
Distributes requests sequentially to each server in rotation.
- **Simple, fair distribution**
- Ignores server load/capacity differences

### Least Connections
Routes to server with fewest active connections.
- **Better for long-lived connections**
- Requires tracking connection state

### Least Response Time
Routes to server with fastest response time.
- **Performance-optimized**
- Requires health check response time tracking

### IP Hash / Session Affinity
Routes same client IP to same server (sticky sessions).
- **Maintains session state**
- Can lead to uneven distribution

### Weighted Round Robin
Round robin but with weights (more capable servers get more traffic).
- **Handles heterogeneous servers**
- Requires manual weight configuration

## Common Pitfalls

```ad-warning
**Session state issues**: If sessions stored locally on servers, load balancer must use sticky sessions or you'll lose user state. Better: use external session store (Redis, database).
```

```ad-danger
**Health check misconfiguration**: Too aggressive health checks can mark healthy servers as down. Too lenient checks can route to failed servers. Balance check frequency and thresholds carefully.
```

## Quick Reference

### Popular Load Balancer Solutions

| Solution | Type | Layer | Strengths | Use Case |
|----------|------|-------|-----------|----------|
| **NGINX** | Software | L4/L7 | High performance, flexible | General purpose |
| **HAProxy** | Software | L4/L7 | Advanced algorithms, TCP | High-traffic sites |
| **AWS ELB** | Managed | L4/L7 | AWS integration, auto-scale | AWS applications |
| **Cloud Load Balancing** | Managed | L4/L7 | Global, GCP integration | GCP applications |
| **Traefik** | Software | L7 | Dynamic config, Docker | Container environments |
| **Envoy** | Software | L7 | Modern, observability | Cloud-native apps |
| **F5 BIG-IP** | Hardware | L4/L7 | Enterprise, high throughput | Large enterprises |

### Load Balancing Layers

**Layer 4 (Transport Layer):**
```
- Routes based on: IP address, TCP/UDP port
- Cannot inspect HTTP headers
- Very fast (minimal processing)
- Protocol-agnostic (works with any TCP/UDP)
```

**Layer 7 (Application Layer):**
```
- Routes based on: URL path, HTTP headers, cookies
- Can modify requests/responses
- Slower (must parse HTTP)
- HTTP/HTTPS specific (or other L7 protocols)
```

### NGINX Load Balancing Configuration

```nginx
upstream backend {
    # Algorithm: default is round robin
    # least_conn;        # Use least connections
    # ip_hash;           # Use session affinity
    # least_time;        # NGINX Plus only
    
    # Backend servers with weights
    server backend1.example.com:8080 weight=3;
    server backend2.example.com:8080 weight=2;
    server backend3.example.com:8080 weight=1;
    
    # Backup server (only used if others fail)
    server backup.example.com:8080 backup;
    
    # Health check parameters
    server backend4.example.com:8080 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://backend;
        
        # Timeouts
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
        
        # Health check headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### HAProxy Configuration

```haproxy
# Frontend - accepts connections
frontend http_front
    bind *:80
    mode http
    default_backend http_back

# Backend - defines servers
backend http_back
    mode http
    balance roundrobin        # Algorithm
    option httpchk GET /health  # Health check
    
    # Server definitions
    server server1 192.168.1.10:8080 check inter 5000 rise 2 fall 3
    server server2 192.168.1.11:8080 check inter 5000 rise 2 fall 3
    server server3 192.168.1.12:8080 check inter 5000 rise 2 fall 3
    
    # Health check parameters:
    # check      - enable health checks
    # inter 5000 - check every 5 seconds
    # rise 2     - 2 successful checks = server is up
    # fall 3     - 3 failed checks = server is down
```

### Health Check Best Practices

```
Frequency: 5-10 seconds (balance between detection speed and server load)
Timeout: 2-5 seconds (fail fast for unresponsive servers)
Healthy threshold: 2-3 consecutive successes
Unhealthy threshold: 2-3 consecutive failures

Health check endpoint should:
- Be lightweight (don't hit database on every check)
- Return quickly (< 1 second)
- Check critical dependencies
- Return 200 OK if healthy, 5xx if not
```

### Traffic Distribution Example

```
         ┌─────────────────┐
         │  Load Balancer  │
         └────────┬────────┘
                  │
        ┌─────────┼─────────┐
        │         │         │
   ┌────▼───┐ ┌──▼────┐ ┌──▼────┐
   │Server 1│ │Server2│ │Server3│
   │ 33.3% │ │ 33.3% │ │ 33.3% │
   └────────┘ └───────┘ └───────┘
```

---

## References

- https://www.nginx.com/resources/glossary/load-balancing/
- https://www.haproxy.com/blog/loadbalancing-faq/
- https://aws.amazon.com/elasticloadbalancing/


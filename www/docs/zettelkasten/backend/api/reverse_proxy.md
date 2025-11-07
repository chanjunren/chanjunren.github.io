🗓️ 07112025 1440

# reverse_proxy

**Core Concept**: 
- Server between clients and backend servers
- Forwards client requests to appropriate backends
- Returns backend responses to clients
- Hides backend topology from clients

## Why It Matters

- **Abstraction layer** that hides backend server topology from clients
- **Single entry point** for multiple backend services
- **Offloads work** from application servers (SSL termination, caching, compression)

## When to Use

- Need to **load balance** across multiple backend servers
- Want to **cache responses** to reduce backend load
- Need **SSL termination** to offload encryption work from app servers
- Want **single public IP** for multiple internal services
- Need to **compress responses** before sending to clients
- Want to **add security layer** (WAF, DDoS protection)

## When Not to Use

- Single backend server with low traffic (adds unnecessary complexity)
- Need direct client-to-server communication for real-time protocols
- Latency-critical applications where extra hop is unacceptable

## Trade-offs

**Benefits:**
- Improved security (hides backend topology)
- Better performance (caching, compression)
- Simplified SSL management (terminate at proxy)
- Flexible routing and load balancing
- Centralized monitoring and logging

**Drawbacks:**
- Additional latency (extra network hop)
- Single point of failure (needs HA setup)
- Increased infrastructure complexity
- Resource overhead for proxy operations

## Key Distinctions

**Reverse Proxy vs Forward Proxy:**
- **Reverse Proxy**: Works on behalf of servers, clients unaware of backend topology
- **Forward Proxy**: Works on behalf of clients, servers unaware of original client
- Reverse proxy sits in front of servers; forward proxy sits in front of clients

**Reverse Proxy vs Load Balancer:**
- **Load Balancer**: Focused on distributing traffic across multiple servers
- **Reverse Proxy**: Broader functionality (caching, SSL, compression, routing)
- Load balancer is a specific use case of reverse proxy
- Many reverse proxies include load balancing features

This relates to [[load_balancer]] for traffic distribution and [[api_gateway]] which adds API-specific features on top of reverse proxy capabilities.

## Common Pitfalls

```ad-warning
**Connection pooling misconfiguration**: Not reusing backend connections leads to connection exhaustion. Configure keep-alive properly.
```

```ad-danger
**Health check failures**: If reverse proxy doesn't detect unhealthy backends, it will route requests to failed servers. Always configure health checks.
```

## Quick Reference

### Popular Reverse Proxy Solutions

| Solution | Strengths | Use Case |
|----------|-----------|----------|
| **NGINX** | High performance, low memory | Static content, load balancing |
| **HAProxy** | Advanced load balancing | TCP/HTTP load balancing |
| **Apache** | Feature-rich, flexible | Traditional web hosting |
| **Traefik** | Dynamic config, Docker-native | Microservices, containers |
| **Envoy** | Modern, service mesh ready | Cloud-native, gRPC |

### Key Features

- **Load Balancing**: Distribute requests across backend servers
- **SSL Termination**: Decrypt HTTPS at proxy, use HTTP to backends
- **Caching**: Store responses to reduce backend load
- **Compression**: Gzip/Brotli responses before sending
- **Request Routing**: Route based on URL path, headers, host
- **Header Manipulation**: Add/remove/modify headers
- **Rate Limiting**: Control request frequency per client
- **Health Checks**: Monitor backend server availability

### Basic NGINX Configuration Example

```nginx
upstream backend {
    server backend1.example.com:8080;
    server backend2.example.com:8080;
    server backend3.example.com:8080;
}

server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Caching
        proxy_cache my_cache;
        proxy_cache_valid 200 60m;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

---

## References

- https://www.nginx.com/resources/glossary/reverse-proxy-server/
- https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/


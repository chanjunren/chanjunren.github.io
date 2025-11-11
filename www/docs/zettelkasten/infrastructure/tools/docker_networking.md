🗓️ 11112024 1500

# docker_networking

**Core Concept**:
- Virtual networks that connect Docker containers
- Provides isolation and communication between containers
- Multiple network drivers for different use cases
- Containers can join multiple networks simultaneously

## Why It Matters

- **Service discovery**: Containers find each other by name
- **Isolation**: Separate networks for security boundaries
- **Flexibility**: Different network modes for different needs

## When to Use

- Need **container-to-container communication** on same host
- Want **network isolation** between services
- Need **service discovery** by container name
- Want **custom network configuration** (subnets, gateways)
- Need **multi-host networking** (overlay networks)

## When Not to Use

- **Single container** with no communication needs (use default bridge)
- **Direct host networking** required (use host mode)
- **Complete isolation** needed (use none network)

## Trade-offs

**Benefits:**
- Automatic DNS resolution
- Network isolation for security
- Flexible network topologies
- Port mapping for external access
- Multi-host support with overlay networks

**Drawbacks:**
- Additional network layer (slight overhead)
- Complex debugging for network issues
- Port conflicts require management
- Performance impact vs host networking

## Key Distinctions

**Bridge vs Host Network:**
- **Bridge**: Isolated network, port mapping required
- **Host**: Uses host's network directly, no isolation
- Bridge for isolation; host for performance

**User-Defined Bridge vs Default Bridge:**
- **User-Defined**: Automatic DNS, better isolation
- **Default**: Manual linking, legacy
- Always use user-defined bridges

**Bridge vs Overlay:**
- **Bridge**: Single host networking
- **Overlay**: Multi-host networking (Swarm, Kubernetes)
- Bridge for single host; overlay for clusters

This connects [[docker_container]] instances and is automatically configured in [[docker_compose]] setups.

## Network Drivers

| Driver | Use Case | Scope |
|--------|----------|-------|
| **bridge** | Default, isolated network on single host | Local |
| **host** | Container uses host network directly | Local |
| **overlay** | Multi-host networking (Swarm) | Swarm |
| **macvlan** | Assign MAC address, appear as physical device | Local |
| **none** | No networking, complete isolation | Local |
| **custom** | Third-party network plugins | Varies |

## Common Pitfalls

```ad-warning
**Default bridge limitations**: Default bridge doesn't provide automatic DNS. Always create user-defined networks.
```

```ad-danger
**Host network security**: Host mode removes network isolation. Only use when necessary and understand security implications.
```

## Network Management Commands

| Command | Purpose |
|---------|---------|
| `docker network create name` | Create user-defined network |
| `docker network ls` | List networks |
| `docker network inspect name` | View network details |
| `docker network rm name` | Remove network |
| `docker network prune` | Remove unused networks |
| `docker network connect net container` | Connect container to network |
| `docker network disconnect net container` | Disconnect container from network |

## Bridge Network (Default)

**Create Custom Bridge:**
```bash
docker network create my-network
```

**Run Container on Network:**
```bash
docker run -d --name web --network my-network nginx
docker run -d --name api --network my-network myapi
```

**Containers Communicate by Name:**
```bash
# From web container
curl http://api:8080
```

**With Subnet Configuration:**
```bash
docker network create \
  --driver bridge \
  --subnet 172.20.0.0/16 \
  --gateway 172.20.0.1 \
  my-network
```

## Host Network

**Use Host's Network:**
```bash
docker run -d --network host nginx
# nginx accessible on host's port 80 directly
```

**When to Use:**
- Maximum network performance needed
- Container needs access to all host network interfaces
- Port mapping overhead unacceptable

**Limitations:**
- No network isolation
- Port conflicts with host services
- Less portable

## None Network

**Complete Network Isolation:**
```bash
docker run -d --network none alpine
```

**When to Use:**
- Maximum security isolation
- Container doesn't need network access
- Custom network configuration needed

## Docker Compose Networking

**Default Behavior:**
```yaml
version: "3.8"

services:
  web:
    image: nginx
  api:
    image: myapi
  db:
    image: postgres

# Compose creates default network
# All services can reach each other by service name
```

**Custom Networks:**
```yaml
version: "3.8"

services:
  frontend:
    image: nginx
    networks:
      - frontend-net

  backend:
    image: myapi
    networks:
      - frontend-net
      - backend-net

  database:
    image: postgres
    networks:
      - backend-net

networks:
  frontend-net:
  backend-net:
```

**Network Isolation:**
- `frontend` can reach `backend`
- `backend` can reach `database`
- `frontend` CANNOT reach `database` (different networks)

**Real-World Pattern (3-Tier):**
```yaml
services:
  web:
    networks:
      - public
      - app-tier
  
  app:
    networks:
      - app-tier
      - data-tier
  
  db:
    networks:
      - data-tier

networks:
  public:      # Internet-facing
  app-tier:    # Web <-> App
  data-tier:   # App <-> DB
```

## Service Discovery

**Automatic DNS Resolution:**
```yaml
services:
  api:
    image: myapi
  
  worker:
    image: myworker
    environment:
      - API_URL=http://api:8080
```

**Multiple Containers of Same Service:**
```yaml
services:
  api:
    image: myapi
    deploy:
      replicas: 3
```

**DNS Round-Robin:**
- Requests to `api` distributed across replicas
- Built-in load balancing

## Port Mapping

**Publish Ports:**
```bash
docker run -p 8080:80 nginx
# Host:8080 -> Container:80
```

**Bind to Specific Interface:**
```bash
docker run -p 127.0.0.1:8080:80 nginx
# Only accessible from localhost
```

**Multiple Ports:**
```bash
docker run -p 80:80 -p 443:443 nginx
```

**In Docker Compose:**
```yaml
services:
  web:
    image: nginx
    ports:
      - "8080:80"              # Host:Container
      - "127.0.0.1:8443:443"   # Bind to localhost
      - "9090-9091:9090-9091"  # Port range
```

**Expose vs Ports:**
```yaml
services:
  api:
    expose:
      - "8080"  # Only accessible within Docker network
    ports:
      - "8080:8080"  # Accessible from host
```

## Network Configuration

**Custom Subnet:**
```yaml
networks:
  custom-net:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
          gateway: 172.28.0.1
```

**Static IP Assignment:**
```yaml
services:
  api:
    networks:
      custom-net:
        ipv4_address: 172.28.0.10

networks:
  custom-net:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

**External Networks:**
```yaml
services:
  app:
    networks:
      - existing-network

networks:
  existing-network:
    external: true
```

## Network Inspection

**View Network Details:**
```bash
docker network inspect my-network
```

**Output:**
```json
[
  {
    "Name": "my-network",
    "Driver": "bridge",
    "Containers": {
      "abc123": {
        "Name": "web",
        "IPv4Address": "172.18.0.2/16"
      }
    },
    "Options": {},
    "Labels": {}
  }
]
```

**Find Container IP:**
```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name
```

## Network Troubleshooting

**Test Connectivity:**
```bash
# From one container to another
docker exec web ping api

# Check DNS resolution
docker exec web nslookup api

# Test HTTP connectivity
docker exec web curl http://api:8080
```

**View Container Networks:**
```bash
docker inspect container_name | grep -A 20 Networks
```

**Common Issues:**

**Containers Can't Communicate:**
- Check if on same network
- Verify network exists
- Check firewall rules
- Verify service names

**Port Already in Use:**
```bash
# Find process using port
lsof -i :8080

# Use different host port
docker run -p 8081:80 nginx
```

**DNS Not Working:**
- Use user-defined bridge (not default)
- Verify container names
- Check network configuration

## Best Practices

**Use User-Defined Networks:**
```bash
# Good
docker network create app-net
docker run --network app-net nginx

# Bad (default bridge)
docker run nginx
```

**Network Segmentation:**
```yaml
# Separate public and private services
networks:
  public:
  private:

services:
  web:
    networks: [public, private]
  api:
    networks: [private]
```

**Descriptive Network Names:**
```yaml
# Good
networks:
  frontend-tier:
  backend-tier:
  database-tier:

# Bad
networks:
  net1:
  net2:
```

**Avoid Host Network in Production:**
```yaml
# Development (convenience)
network_mode: host

# Production (security)
networks:
  - app-network
ports:
  - "8080:8080"
```

**Network Cleanup:**
```bash
# Remove unused networks
docker network prune

# Remove specific network
docker network rm network_name
```

## Security Considerations

**Network Isolation:**
- Separate sensitive services (databases) from public services
- Use multiple networks for defense in depth
- Limit exposed ports

**Firewall Rules:**
```bash
# Docker modifies iptables automatically
# Be careful with custom firewall rules
```

**Encrypted Communication:**
```yaml
# Use overlay networks with encryption
networks:
  secure-net:
    driver: overlay
    driver_opts:
      encrypted: "true"
```

**Internal Networks:**
```yaml
# Prevent external access
networks:
  internal-net:
    internal: true
```

---

## References

- https://docs.docker.com/network/
- https://docs.docker.com/compose/networking/


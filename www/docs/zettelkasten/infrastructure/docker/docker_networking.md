🗓️ 11112024 1500

# docker_networking

**What it is:**
- Virtual networks that connect Docker containers
- Containers on same network communicate using container names
- Multiple networks provide isolation boundaries

**Problem it solves:**
- Containers need to talk to each other but shouldn't be exposed to everything
- Without Docker networks: manual IP management, no service discovery, no isolation between services

## Network Drivers

Different network types for different scenarios:

### bridge
- Default isolated network on single host
- Containers get own IP addresses, communicate via DNS
- Use for most single-host deployments

### host
- Container uses host's network directly
- No isolation, no port mapping needed
- Use when maximum performance required or need access to all host network interfaces

### overlay
- Multi-host networking for Docker Swarm clusters
- Containers on different hosts communicate as if on same network

### none
- No networking at all
- Complete isolation for security-critical containers

## Service Discovery

On user-defined networks:
- Containers automatically resolve each other by container name
- If you have `api` and `web` containers on same network, `web` reaches `api` at `http://api:8080`
- No need to know IP addresses - Docker's built-in DNS handles it

When using [[docker_compose]]:
- All services automatically join default network
- Reference each other by service name

## Network Isolation

Multiple networks create security boundaries:
- Common pattern: frontend network (public), backend network (application), database network (data tier)
- Place web server on frontend+backend networks
- Place app server on backend+database networks
- Place database only on database network
- Result: Database unreachable from web tier

## Bridge vs Host Trade-offs

### Bridge networks
- Provide isolation and portable port mapping
- Add small network overhead

### Host networking
- Native performance, direct access to host interfaces
- Removes security isolation, creates port conflicts

Default bridge network exists but lacks DNS - always create user-defined bridge networks instead.

## Common Pitfalls

```ad-danger
**Using default bridge network**: Default bridge doesn't provide DNS service discovery. Always create user-defined networks with `docker network create` or let [[docker_compose]] create them automatically.
```

```ad-warning
**Host network in production**: Host mode removes all network isolation. Only use when performance is critical and you understand the security implications.
```

---

## References

- https://docs.docker.com/network/
- https://docs.docker.com/compose/networking/

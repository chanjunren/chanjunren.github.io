🗓️ 11112024 1505

# docker_healthcheck

**What it is:**
- Periodic command that runs inside container to verify it's functioning correctly
- Reports health status: starting, healthy, or unhealthy

**Problem it solves:**
- Containers can be running but broken (crashed process, deadlock, failed dependency)
- Without health checks, orchestrators route traffic to broken containers
- Users see errors instead of automatic recovery

## Health States

Containers transition through three states:
- **starting**: Container initializing, health check hasn't passed yet
- **healthy**: Health check passing consistently
- **unhealthy**: Health check failed after configured retries

When unhealthy, orchestrators like [[docker_compose]] or Kubernetes automatically restart or remove from load balancer rotation.

## When to Use

Use for:
- Production services where automatic recovery matters
- Load-balanced APIs
- Long-running services that may degrade over time
- Microservices with complex dependencies
- Database connections that can become stale

Skip for:
- Short-lived containers (batch jobs, one-off tasks)
- Development environments where manual restart is acceptable
- When health check overhead outweighs benefit

## Key Distinctions

### Running vs Healthy
- Container can be running (process active) but unhealthy (not functioning correctly)
- Health checks detect the difference

### Health Check vs Monitoring
- Health checks: Internal container-level checks that trigger restarts
- Monitoring: External system-level observability that provides insights

### Liveness vs Readiness
- Kubernetes context only
- Liveness: Is app alive? (restart if not)
- Readiness: Can app serve traffic? (remove from load balancer if not)
- Docker health checks are simpler - only indicate overall health

## Configuration Considerations

### Intervals
- Balance responsiveness with resource overhead
- Typical: 30s for web services, 10s for critical databases

### Start Period
- Grace period where failed checks don't count toward retry limit
- Always set this for slow-starting applications
- Without it, containers get marked unhealthy during normal initialization

### Retries
- How many consecutive failures before marking unhealthy
- More retries = more tolerant of transient issues but slower failure detection

## Common Pitfalls

```ad-danger
**No start period for slow apps**: Container gets marked unhealthy during normal startup. Always set start_period longer than your app's initialization time.
```

```ad-warning
**Heavy health check operations**: Running full test suites or expensive queries wastes resources. Keep checks lightweight - simple ping or status endpoint.
```

---

## References

- https://docs.docker.com/engine/reference/builder/#healthcheck
- https://docs.docker.com/compose/compose-file/#healthcheck

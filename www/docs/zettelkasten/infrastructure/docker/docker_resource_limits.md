🗓️ 03042026 2100

# docker_resource_limits

**What it is:**
- CPU, memory, and process constraints applied to containers via [[docker_compose]]
- Uses Linux cgroups to enforce hard boundaries on resource consumption

**Problem it solves:**
- On a shared server with multiple client stacks, one client's runaway process can starve all others
- Without limits: a memory leak in client-a's app OOM-kills the entire server, taking down client-b and client-c
- Resource limits enforce fair sharing and prevent the **noisy neighbor problem**

## Memory

### Limits (hard cap)
- Container killed (OOMKilled) when it exceeds the limit
- `deploy.resources.limits.memory: 512M`
- Essential — without this, one container can consume all host memory

### Reservations (soft floor)
- Guarantees a minimum allocation when the host is under pressure
- `deploy.resources.reservations.memory: 256M`
- Does NOT prevent the container from using more when available

Pattern: Set reservation to expected usage, limit to maximum acceptable usage. Gap between them is the burst headroom.

## CPU

### Limits (throttling)
- Container throttled (NOT killed) when it exceeds CPU allocation
- `deploy.resources.limits.cpus: '0.5'` means 50% of one core
- Throttled containers slow down but keep running

### Reservations
- Minimum CPU guaranteed under contention
- `deploy.resources.reservations.cpus: '0.25'`

## PIDs Limit

- `pids_limit: 100` caps the number of processes a container can create
- Prevents fork bombs — a single container spawning unlimited processes
- Especially important in multi-tenant environments where one rogue container shouldn't destabilize the host

## Per-Client Budgeting

For multi-client isolation on one server:
- Calculate total host resources, allocate budget per client
- Set both reservations (guaranteed) and limits (max) per client stack
- Leave headroom for host OS and shared services (reverse proxy, monitoring)
- Monitor actual usage and tune — initial guesses are usually wrong

Example: 8GB server, 3 clients → ~2GB limit per client, ~1GB reserved, ~2GB for shared services and OS

## Compose v2 Syntax

Resources go under `deploy.resources` block:
- Works with `docker compose up` (not just Swarm mode) in Compose v2+
- Legacy `mem_limit` / `cpus` top-level keys still work but are deprecated

## Trade-offs

### Too tight
- Frequent OOMKills, CPU throttling, degraded performance
- Users report slowness, containers restart constantly

### Too loose
- Defeats the purpose — doesn't prevent noisy neighbor
- False sense of security

### Monitoring is essential
- Limits without monitoring = flying blind
- Track actual usage to tune limits over time
- See [[docker_logging]] for observability patterns

```ad-danger
**No resource limits on a shared host = one client can crash everything**: A memory leak or traffic spike in one client stack can OOMKill the host kernel's processes. Always set memory limits in multi-tenant deployments.
```

```ad-warning
**Memory reservation is NOT a limit**: It only affects scheduling decisions. Containers can exceed their reservation freely when the host has spare memory. Don't confuse it with a hard cap.
```

---

## References

- https://docs.docker.com/compose/compose-file/deploy/#resources
- https://docs.docker.com/config/containers/resource_constraints/

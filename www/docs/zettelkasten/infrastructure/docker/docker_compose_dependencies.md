🗓️ 03042026 2100

# docker_compose_dependencies

**What it is:**
- Strategies beyond basic `depends_on` to manage service startup order and readiness in [[docker_compose]]
- Uses health checks and completion conditions to ensure services are truly ready before dependents start

**Problem it solves:**
- Basic `depends_on` only waits for container start, not readiness
- Database container "started" but still initializing — app connects and crashes
- In multi-client stacks, a shared database must be fully ready before any client service connects

## Condition Options

### `service_started` (default)
- Waits for container to start, nothing more
- Sufficient when the dependency starts fast or the app handles retries

### `service_healthy`
- Waits for [[docker_healthcheck]] to pass
- The correct choice for databases, caches, message brokers — anything with initialization time
- Requires a `healthcheck` defined on the dependency service

### `service_completed_successfully`
- Waits for a one-shot container to exit with code 0
- Perfect for init/migration containers that must finish before the app starts
- If the init container fails (non-zero exit), dependent services won't start

## Init Container Pattern

Run setup tasks before the main application:
- Database migration container runs and exits
- Schema seeding or data loading completes
- App service has `depends_on` with `condition: service_completed_successfully`
- Guarantees migrations are applied before any client traffic hits the app

## Restart Policies

What happens when a dependency crashes after startup:
- `restart: unless-stopped` — restarts on crash, stays stopped if manually stopped
- `restart: on-failure` — restarts only on non-zero exit codes
- `restart: always` — restarts no matter what, including after host reboot
- Choose based on whether the service should self-heal or require manual intervention

## When to Skip depends_on

Sometimes application-level resilience is better:
- App has connection retry logic with backoff — more resilient than strict ordering
- Microservices that gracefully degrade when a dependency is down
- `depends_on` only helps at startup; it doesn't restart your app if the dependency crashes later

## Transitive Dependencies

A depends on B depends on C:
- Compose resolves the chain transitively — C starts first, then B, then A
- But startup time compounds: if C takes 30s and B takes 20s, A waits 50s+
- Keep dependency chains shallow where possible

```ad-warning
**`service_completed_successfully` kills dependents on failure**: If the init container exits non-zero, dependent services never start. Always handle errors in init scripts and provide clear exit codes.
```

```ad-example
**Migration container pattern**: DB starts → migration container runs `flyway migrate` and exits → app starts only after migration succeeds. This guarantees schema consistency across all client stacks.
```

---

## References

- https://docs.docker.com/compose/startup-order/
- https://docs.docker.com/compose/compose-file/05-services/#depends_on

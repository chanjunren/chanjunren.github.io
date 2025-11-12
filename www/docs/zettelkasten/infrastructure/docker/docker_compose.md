🗓️ 11112024 1450

# docker_compose

**What it is:**
- Tool for defining and running multi-container applications
- Uses YAML configuration file
- Single command starts entire application stack with dependencies, networks, volumes

**Problem it solves:**
- Running multi-container apps with `docker run` means typing long commands for each service
- Must manually create networks, manage startup order, remember all flags
- Compose replaces this with declarative config file and simple commands

## Structure

A `docker-compose.yml` defines:

### Services
- Containers to run
- Each service specifies image/build context, ports, environment variables, dependencies, health checks

### Networks
- How containers communicate

### Volumes
- Persistent data

## When to Use

Use for:
- Multi-container applications (app + database + cache)
- Local development environments with multiple services
- Integration testing requiring full stack
- Small single-host production deployments

Skip for:
- Single containers (just use `docker run`)
- Production at scale (use [[docker_orchestration]] like Kubernetes)
- Multi-host deployments needing auto-scaling and rolling updates

## Dependency Management

`depends_on` controls startup order:
- Only waits for containers to start, NOT for services to be ready
- Combine with `condition: service_healthy` to wait for [[docker_healthcheck]] to pass
- Without health checks, app might try connecting to database that's still initializing

## Environment Variables and Config

Configuration options:
- Set inline in YAML
- Load from `.env` files
- Substitute from host environment
- Mount config files via volumes

Pattern: Use environment variables for secrets and runtime config, mount files for complex configuration.

## Compose vs Orchestration

Differences:
- Compose: Single-host, development-focused
- [[docker_orchestration]]: Multi-host, production-grade
- Compose orchestrates containers but doesn't manage clusters
- Many start with Compose for dev, move to Kubernetes for prod

For production needing auto-scaling, rolling updates, self-healing: use orchestration platforms.

## Common Pitfalls

```ad-warning
**Ignoring health checks**: Using `depends_on` without health checks means dependent services start before dependencies are ready. Always add [[docker_healthcheck]] to services that need startup time.
```

```ad-danger
**Using Compose for production scale**: Compose has no auto-scaling, no rolling updates, no multi-host support. Great for single-host deployments but not designed for production scale. Use [[docker_orchestration]] platforms instead.
```

---

## References

- https://docs.docker.com/compose/
- https://docs.docker.com/compose/compose-file/

🗓️ 14042026 1200

# swarm_stacks

**What it is:**
- A named group of services deployed together to a [[docker_swarm]] cluster from a single compose file
- The Swarm equivalent of `docker compose up` — but distributed across a cluster
- Bundles services, networks, and volumes into one deployment unit

**Why it exists:**
- Deploying services one-by-one with `docker service create` is tedious and error-prone
- Stacks let you define an entire application in a [[docker_compose]] file and deploy it as a single unit
- A naming convention keeps resources from different stacks isolated on the same cluster

## How Stacks Work

- `docker stack deploy -c compose.yml <stack-name>` reads the compose file, creates all services in the cluster
- Swarm interprets the `deploy` key (replicas, update_config, resources, placement)
- Every resource is prefixed with the stack name to prevent collisions
- Re-running the same command with a modified compose file triggers updates (e.g. [[rolling_deployment]])

## Stack Naming

- Service `api` in stack `go2c-platform` becomes **`go2c-platform_api`**
- Networks and volumes also prefixed: `go2c-platform_default`, `go2c-platform_db-data`
- Enables multiple independent stacks on the same cluster (e.g. `go2c-platform`, `go2c-gateway`, `go2c-data`)
- Makes `docker service ls` output readable — you can tell which stack owns each service

## Stack vs Standalone Services

### Stacks (declarative)
- Deploy from compose file — version-controlled, reproducible
- All services deployed/removed together as a unit
- Networks scoped to the stack automatically (each stack gets its own [[swarm_overlay_networking|overlay network]])
- Update by re-running `docker stack deploy` with modified compose file

### Standalone services (imperative)
- Created with `docker service create` — one at a time
- Must manage relationships, networks, and dependencies manually
- Useful for one-off utilities, but doesn't scale for multi-service apps

## Lifecycle Commands

| Command | Purpose |
|---------|---------|
| `docker stack deploy -c compose.yml <name>` | Deploy or update a stack |
| `docker stack ls` | List all stacks |
| `docker stack services <name>` | List services in a stack |
| `docker stack ps <name>` | List tasks (containers) across nodes |
| `docker stack rm <name>` | Remove entire stack |

```ad-warning
`docker stack rm` removes services and networks but leaves **named volumes** intact. Safety feature — data survives stack removal. But orphaned volumes accumulate; audit with `docker volume ls`.
```

```ad-example
`docker stack deploy -c docker-compose.yml go2c-platform` creates services like `go2c-platform_api`, `go2c-platform_db`, `go2c-platform_redis` — all managed as one unit. Updating the image tag and re-running the same command triggers a rolling update.
```

---

## References

- https://docs.docker.com/engine/swarm/stack-deploy/
- https://docs.docker.com/reference/cli/docker/stack/

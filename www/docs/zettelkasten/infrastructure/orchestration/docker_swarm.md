🗓️ 08042026 1200

# docker_swarm

**What it is:**
- Docker's built-in clustering and orchestration tool
- Turns a group of Docker hosts into a single virtual host
- You define a desired state ("run 3 replicas of my app") and Swarm maintains it

**Why it exists:**
- [[docker_compose]] works on a single host — no failover, no scaling across machines
- Kubernetes solves this but is complex to set up and operate
- Swarm gives you multi-host orchestration with almost no learning curve beyond Docker itself — same CLI, same compose file format

## Architecture

### Manager nodes
- Accept service definitions and schedule tasks across the cluster
- Maintain cluster state via Raft consensus (odd number recommended: 3 or 5)
- Also run workloads by default (can be set to drain for dedicated management)

### Worker nodes
- Execute containers assigned by managers
- Report task status back to managers
- Can be promoted to manager and vice versa

### Services (not containers)
- You define **services**, Swarm creates **tasks** (containers) to fulfill them
- A service specifies image, replica count, resource limits, update policy
- Swarm places tasks across nodes based on resource availability — see [[swarm_scheduling]] for how placement works
- Services are grouped into [[swarm_stacks|stacks]] — deployed together from a single compose file

## Rolling Deployments

The reason you're here — Swarm handles this natively:
- `update_config` defines how new versions roll out
- **parallelism**: how many tasks update simultaneously (e.g., 2 at a time)
- **delay**: wait time between batches (e.g., 10s between each batch)
- **failure_action**: `pause` (stop and wait) or `rollback` (revert automatically)
- **order**: `stop-first` (kill old, start new) or `start-first` (start new, then kill old — zero downtime)

### How it works
1. Swarm shuts down old tasks in batches
2. Starts new version tasks
3. Waits for [[docker_healthcheck]] to pass
4. Proceeds to next batch
5. If health check fails → pause or auto-rollback based on config

### Rollback
- `rollback_config` mirrors update_config — controls how fast rollback happens
- `docker service rollback <service>` manually triggers rollback
- Automatic rollback via `failure_action: rollback` is safer for production

## Swarm vs Kubernetes

### Swarm strengths
- Zero additional tooling — built into Docker Engine
- Uses the same compose file format (with `deploy` section)
- Minutes to set up: `docker swarm init` on manager, `docker swarm join` on workers
- Good enough for small-to-medium deployments (< ~100 nodes)

### Swarm limitations
- Smaller ecosystem — fewer monitoring, networking, and storage plugins
- No autoscaling (must scale manually or script it)
- Less granular scheduling (no node affinity, taints, tolerations like K8s)
- Community shrinking as industry consolidates around Kubernetes

### Choose Swarm when
- Small team, few services, don't need K8s complexity
- Already using Docker Compose and want a smooth upgrade path
- Single-cloud or on-prem with straightforward needs

### Choose Kubernetes when
- Large scale, many teams, complex networking/storage requirements
- Need autoscaling, service mesh, advanced scheduling
- Multi-cloud or hybrid deployments
- Want the broadest ecosystem and hiring pool

## Swarm Mode Compose File

The same `docker-compose.yml` gains Swarm features under the `deploy` key:
- `replicas`, `update_config`, `rollback_config`, `resources`, `placement`
- `docker stack deploy -c docker-compose.yml mystack` deploys to Swarm — see [[swarm_stacks]] for stack lifecycle
- Services, networks, and volumes defined in compose just work
- Sensitive data distributed via [[swarm_secrets_and_configs]] instead of `.env` files

This is the smoothest migration path from single-host [[docker_compose]] to multi-host orchestration.

## Networking in Swarm

### Overlay networks
- Span all nodes in the cluster — containers on different hosts communicate transparently
- Uses VXLAN tunneling under the hood — see [[swarm_overlay_networking]] for how it works

### Ingress routing mesh
- Any node in the swarm can accept traffic for any service, even if that service isn't running on that node
- Built-in load balancing across tasks
- Simplifies external load balancer config — point it at any/all swarm nodes
- See [[swarm_overlay_networking]] for routing mesh internals and required ports

## When to Skip Swarm

- Single server, no need for multi-host — [[docker_compose]] with [[docker_resource_limits]] is simpler
- Already invested in Kubernetes — adding Swarm creates split tooling
- Need autoscaling — Swarm doesn't have it built-in

```ad-warning
**Swarm is in maintenance mode**: Docker Inc. is focused on Docker Desktop and Docker Build. Swarm still works and receives security patches, but don't expect major new features. For greenfield projects at scale, Kubernetes is the safer long-term bet.
```

```ad-example
**Compose → Swarm migration**: Add a `deploy` section to your existing compose file, run `docker swarm init`, then `docker stack deploy`. Your single-host setup becomes a cluster-ready deployment with rolling updates in minutes.
```

---

## References

- https://docs.docker.com/engine/swarm/
- https://docs.docker.com/engine/swarm/swarm-tutorial/
- https://docs.docker.com/compose/compose-file/deploy/

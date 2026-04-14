🗓️ 14042026 1200

# swarm_scheduling

**What it is:**
- How [[docker_swarm]] decides where to place containers and keeps them running
- A continuous **reconciliation loop**: compare actual state to desired state, fix any difference
- Includes placement constraints, node labels, and service modes for controlling task distribution

**Why it exists:**
- In a cluster, you can't just "run a container" — the scheduler must decide which node runs it
- When nodes fail or containers crash, something must automatically reschedule without human intervention
- Placement constraints let you pin workloads to specific nodes (critical for stateful services)

## Desired State Reconciliation

### The loop
- You declare desired state: "run 3 replicas of api service"
- Swarm manager continuously compares running tasks to desired state
- Drift is corrected automatically:
  - Task crashes → scheduler starts a replacement on an available node
  - Node goes down → all its tasks rescheduled to healthy nodes
  - You scale up → new tasks placed on least-loaded nodes

### What triggers reconciliation
- **Task failure** — container exits or [[docker_healthcheck]] fails
- **Node failure** — node becomes unreachable
- **Service update** — image change, scale change, constraint change
- **Node drain** — admin marks a node for maintenance (`docker node update --availability drain`)

## Placement Constraints

### What they do
- Restrict which nodes can run a service's tasks
- Use node attributes: `node.role`, `node.hostname`, `node.labels.<key>`
- Defined in compose file under `deploy.placement.constraints`

### Common patterns
- `node.role == worker` — keep workloads off managers
- `node.labels.role == data` — run on nodes tagged for data workloads
- `node.labels.region == us-east` — geographic placement
- `node.hostname == specific-host` — pin to a specific node (last resort)

## Node Labels

- Custom key-value tags: `docker node update --label-add role=data node-3`
- Enable logical grouping of nodes by purpose
- Critical for **stateful services** using local [[docker_volumes]] — without a constraint, Swarm might reschedule a database to a node where the volume doesn't exist

## Service Modes

### Replicated (default)
- You specify a replica count (e.g. `replicas: 3`)
- Scheduler distributes that many tasks across available nodes
- Use for: stateless app services, APIs, workers

### Global
- Exactly **one task on every node** matching the constraints
- Scales automatically as nodes join or leave
- Use for: monitoring agents, log collectors, node-level utilities

## Scheduling Strategy

- Swarm uses a **spread strategy** by default — distributes tasks evenly across nodes
- Considers resource reservations (CPU, memory) when placing tasks
- No support for bin-packing, affinity rules, or taints/tolerations (unlike Kubernetes)
- For advanced scheduling needs, this is one reason to consider [[kubernetes]]

```ad-warning
Stateful services with local volumes **must** use placement constraints. Without them, Swarm may reschedule a database to a node without the data volume — resulting in an empty database starting up.
```

```ad-example
A 3-node cluster: nodes 1-2 labeled `role=app`, node 3 labeled `role=data`. The API service runs replicated (2 replicas) constrained to `node.labels.role == app`. The database runs replicated (1 replica) constrained to `node.labels.role == data` — always lands on node 3 where its volume lives.
```

---

## References

- https://docs.docker.com/engine/swarm/how-swarm-mode-works/services/
- https://docs.docker.com/engine/swarm/services/#placement-constraints
- https://docs.docker.com/engine/swarm/manage-nodes/#add-or-remove-label-metadata

🗓️ 14042026 1200

# swarm_overlay_networking

**What it is:**
- The networking layer that makes [[docker_swarm]] containers on different physical hosts communicate transparently
- Built on **VXLAN tunneling** — encapsulates container traffic inside UDP packets between hosts
- Combines with a **routing mesh** so any node can accept traffic for any service

**Why it exists:**
- [[docker_networking]] bridge networks only work on a single host
- In a cluster, containers on node A need to reach containers on node B without manual port forwarding
- Overlay networks abstract away the physical network topology — containers see a flat network

## How Overlay Networks Work

### VXLAN tunneling
- Each overlay network gets a unique **VXLAN Network Identifier (VNI)**
- Container traffic is encapsulated in UDP packets (port 4789) and sent between hosts
- The receiving host decapsulates and delivers to the target container
- From the container's perspective, it's on a flat L2 network with all peers — no awareness of the physical topology

### When they're created
- Swarm auto-creates a default overlay called **ingress** for the routing mesh
- You create additional overlays in your compose file for service-to-service communication
- Each [[swarm_stacks|stack]] gets its own overlay network by default (scoped by stack name)

## Service Discovery

- Swarm runs an embedded **DNS server** on every node
- Containers resolve service names to the **virtual IP (VIP)** of that service
- The VIP load-balances across all healthy tasks for that service
- Works regardless of which nodes the tasks run on
- Same mechanism as single-host DNS in [[docker_networking]], but cluster-wide

### How resolution works
- Container calls `db` → DNS returns VIP for the `db` service → VIP routes to one of the healthy `db` tasks
- No need to know IPs, node assignments, or replica count — just use the service name

## Routing Mesh

### How it works
- Every node in the swarm listens on **published ports** for every service, even if that service has no tasks on that node
- Incoming traffic on any node is forwarded internally to a node running the service
- Built-in **ingress load balancing** distributes across all healthy tasks

### Why it matters
- External load balancer can point at any/all swarm nodes — no need to track which node runs which service
- Simplifies DNS: point a domain at any node's IP, traffic reaches the right container
- See [[swarm_scheduling]] for how task placement interacts with routing

### Ingress network
- Special auto-created overlay network dedicated to the routing mesh
- All services with published ports are attached to it automatically
- Separate from your application overlay networks

## Required Ports

For Swarm nodes to communicate, these ports must be open between all nodes:

| Port | Protocol | Purpose |
|------|----------|---------|
| 2377 | TCP | Cluster management and Raft consensus |
| 7946 | TCP+UDP | Node discovery and gossip protocol |
| 4789 | UDP | VXLAN data plane (overlay traffic) |

```ad-danger
If port 7946 or 4789 is blocked between nodes, overlay networking **silently fails** — containers on different hosts cannot communicate, and services appear healthy but return connection timeouts. Always verify these ports when debugging cross-node connectivity.
```

```ad-example
A 3-node Swarm with `api` (2 replicas on nodes 1 and 3) and `db` (1 replica on node 2). The `api` containers resolve `db` via DNS to its VIP, and traffic is tunneled over VXLAN to node 2 — no port publishing needed for internal services.
```

---

## References

- https://docs.docker.com/network/drivers/overlay/
- https://docs.docker.com/engine/swarm/ingress/
- https://docs.docker.com/engine/swarm/networking/

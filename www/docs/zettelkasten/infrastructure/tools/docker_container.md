🗓️ 11112024 1440

# docker_container

**Core Concept**:
- Running instance of a Docker image
- Isolated process with own filesystem, networking, and process space
- Adds writable layer on top of read-only image layers
- Ephemeral by default (data lost when container removed)

## Why It Matters

- **Process isolation**: Applications run independently without conflicts
- **Resource control**: CPU, memory, and I/O limits per container
- **Rapid deployment**: Start/stop in seconds

## When to Use

- Need **isolated runtime environments** for applications
- Want **quick scaling** by spawning multiple instances
- Need **consistent behavior** across different hosts
- Want **easy cleanup** by removing containers
- Need **resource limits** for applications

## When Not to Use

- **Persistent data** without volume strategy (data lost on removal)
- **Kernel modifications** required (containers share host kernel)
- **Direct hardware access** needed (without proper device mapping)
- **Long-lived state** that must survive container lifecycle

## Trade-offs

**Benefits:**
- Fast startup and shutdown
- Lightweight (no full OS overhead)
- Easy to replace and update
- Isolated from other containers
- Resource efficient

**Drawbacks:**
- Ephemeral by default (data loss risk)
- Shares host kernel (less isolation than VMs)
- Networking complexity in distributed setups
- Debugging can be challenging
- Log management required

## Key Distinctions

**Container vs Image:**
- **Container**: Running process with writable layer
- **Image**: Static template, read-only
- Container = Image + Writable Layer + Runtime Config

**Container vs Process:**
- **Container**: Process with isolation (namespaces, cgroups)
- **Process**: Regular OS process
- Container appears as single process to host
- Multiple processes can run inside container

This is created from [[docker_image]] and relates to [[docker_volumes]] for data persistence and [[docker_networking]] for communication.

## Container Lifecycle States

| State | Description |
|-------|-------------|
| **Created** | Container exists but not started |
| **Running** | Container process executing |
| **Paused** | Container process suspended (not consuming CPU) |
| **Stopped** | Container exited (gracefully or crashed) |
| **Restarting** | Container automatically restarting |
| **Removing** | Container being deleted |
| **Dead** | Container failed to remove properly |

## Common Pitfalls

```ad-danger
**Data loss**: Containers are ephemeral. Always use volumes for data that must persist beyond container lifecycle.
```

```ad-warning
**Resource exhaustion**: Containers without limits can consume all host resources. Always set CPU and memory limits in production.
```

## Container Management Commands

| Command | Purpose |
|---------|---------|
| `docker run image` | Create and start container |
| `docker ps` | List running containers |
| `docker ps -a` | List all containers (including stopped) |
| `docker start container` | Start stopped container |
| `docker stop container` | Gracefully stop container (SIGTERM) |
| `docker kill container` | Force stop container (SIGKILL) |
| `docker restart container` | Restart container |
| `docker rm container` | Remove stopped container |
| `docker rm -f container` | Force remove running container |
| `docker logs container` | View container logs |
| `docker exec -it container sh` | Execute command in running container |
| `docker inspect container` | View detailed container info |
| `docker stats` | View resource usage statistics |

## Run Options

**Basic Run:**
```bash
docker run nginx
```

**Detached Mode:**
```bash
docker run -d nginx
```

**Port Mapping:**
```bash
docker run -p 8080:80 nginx
```

**Environment Variables:**
```bash
docker run -e KEY=value nginx
```

**Volume Mount:**
```bash
docker run -v /host/path:/container/path nginx
```

**Resource Limits:**
```bash
docker run --memory="512m" --cpus="1.5" nginx
```

**Named Container:**
```bash
docker run --name my-nginx nginx
```

**Auto-remove:**
```bash
docker run --rm nginx
```

## Container Isolation

**Namespaces (What is Isolated):**
- **PID**: Process IDs (container sees own process tree)
- **Network**: Network interfaces, IP addresses, ports
- **Mount**: Filesystem mount points
- **UTS**: Hostname and domain name
- **IPC**: Inter-process communication
- **User**: User and group IDs

**Cgroups (Resource Limits):**
- CPU allocation
- Memory limits
- Disk I/O
- Network bandwidth

## Interactive vs Detached

**Interactive Mode (`-it`):**
- Allocates TTY and keeps STDIN open
- For debugging, running shells, interactive apps
- Container stops when you exit

**Detached Mode (`-d`):**
- Runs in background
- For long-running services
- Access logs with `docker logs`
- Attach later with `docker attach`

## Container Networking Basics

**Default Bridge Network:**
- Containers get private IP addresses
- Can communicate with each other by IP
- Port mapping required for external access

**Host Network:**
- Container uses host's network directly
- No port mapping needed
- Less isolation

**None Network:**
- No networking
- Complete isolation

See [[docker_networking]] for detailed networking concepts.

## Best Practices

**Single Process per Container:**
- One main process per container
- Use orchestration for multi-service apps
- Easier to scale and manage

**Graceful Shutdown:**
- Handle SIGTERM signal properly
- Clean up resources before exit
- Set appropriate stop timeout

**Health Checks:**
- Define health check in Dockerfile or run command
- Orchestrators can restart unhealthy containers
- See [[docker_healthcheck]] for details

**Non-Root User:**
```dockerfile
RUN adduser -D -u 1000 appuser
USER appuser
```

**Resource Limits:**
```bash
docker run --memory="512m" --cpus="1.0" \
  --memory-reservation="256m" \
  --oom-kill-disable=false \
  nginx
```

---

## References

- https://docs.docker.com/engine/reference/run/
- https://docs.docker.com/config/containers/resource_constraints/


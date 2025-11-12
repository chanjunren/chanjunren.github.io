🗓️ 11112024 1440

# docker_container

**What it is:**
- Running instance of a [[docker_image]]
- Isolated process with own filesystem, networking, process space
- Shares host OS kernel

**Problem it solves:**
- Running applications directly on host leads to dependency conflicts, configuration drift, "works on my machine" issues
- Containers provide consistent, isolated environments that behave same everywhere

## Container vs Image

Relationship:
- **Image**: Static, read-only template (like a class)
- **Container**: Running instance of image (like an object)
- Think: images as classes, containers as instances

Container = Image + Writable Layer:
- When you modify files in container, changes go to writable layer on top of image layers
- When you remove container, writable layer disappears
- This is why containers are ephemeral by default

## Lifecycle

Container states:
- **created**: Exists but not started
- **running**: Process executing
- **stopped**: Exited
- **paused**: Suspended
- **dead**: Failed to remove properly

Common operations:
- `docker run`: Create and start container
- `docker stop`: Process receives SIGTERM to shut down gracefully
- `docker rm`: Container and writable layer deleted permanently

## Ephemeral by Design

Containers are disposable:
- You should be able to delete and recreate without losing important data
- This is why [[docker_volumes]] exist - to separate persistent data from container lifecycle

Pattern:
- Configuration and code: in image
- Data: in volumes
- State that can be rebuilt: anywhere
- If you can't delete container without losing critical data, your architecture needs volumes

## Isolation Mechanisms

### Namespaces
- Separate process trees, network stacks, filesystems
- To host, container looks like single process
- Inside container, feels like separate system

### Cgroups
- CPU, memory, I/O limits

Unlike VMs:
- Containers share host kernel
- This means less overhead (faster, lighter) but also less isolation
- Can't run Windows containers on Linux hosts

## Resource Limits

Without limits:
- Container can consume all host resources
- Production containers should specify CPU and memory limits

Behavior:
- Exceeds memory limits → gets killed
- Exceeds CPU limits → gets throttled

## Networking and Communication

Default setup:
- Each container gets own network namespace
- Containers on same [[docker_networking]] network can communicate by name
- Port mapping (`-p 8080:80`) exposes container ports to host

## Common Pitfalls

```ad-danger
**Storing data in containers**: Containers are ephemeral. Without [[docker_volumes]], all data inside container is lost when you remove it. Always use volumes for databases, uploads, or anything that needs to persist.
```

```ad-warning
**No resource limits**: Runaway container can crash host by consuming all memory or CPU. Always set limits in production with `--memory` and `--cpus` flags.
```

---

## References

- https://docs.docker.com/engine/reference/run/
- https://docs.docker.com/config/containers/resource_constraints/

🗓️ 11112024 1430

# docker_overview

**Core Concept**:

- Platform for developing, shipping, and running applications in containers
- Packages application with all dependencies into standardized units
- Uses OS-level virtualization to isolate processes
- Containers share host OS kernel but run in isolated user spaces

## Why It Matters

- **Consistency across environments**: "Works on my machine" becomes "works everywhere"
- **Lightweight isolation**: Faster startup and lower overhead than VMs
- **Dependency management**: All dependencies bundled with application

## When to Use

- Need **consistent environments** across development, testing, production
- Want **microservices architecture** with isolated services
- Need **quick deployment** and scaling of applications
- Want to **avoid dependency conflicts** between applications
- Need **reproducible builds** for CI/CD pipelines
- Want **resource efficiency** compared to VMs

## When Not to Use

- Application requires **direct hardware access** (GPUs without proper setup)
- Need **different OS kernels** on same host (use VMs instead)
- **Security-critical workloads** requiring kernel-level isolation
- **Legacy GUI applications** with complex display requirements
- **Stateful applications** without proper volume management strategy

## Trade-offs

**Benefits:**

- Fast startup (seconds vs minutes for VMs)
- Efficient resource usage (shared kernel)
- Portable across platforms
- Version control for infrastructure
- Easy rollback and updates
- Large ecosystem of pre-built images

**Drawbacks:**

- Shares host kernel (less isolation than VMs)
- Complex networking in multi-host setups
- Persistent data requires volume management
- Learning curve for orchestration
- Security depends on proper configuration

## Key Distinctions

**Docker vs Virtual Machines:**

- **Docker**: Shares host OS kernel, lightweight, fast startup
- **VMs**: Full OS per instance, complete isolation, slower startup
- Docker containers are processes; VMs are full operating systems
- Use Docker for application isolation; VMs for OS-level isolation

**Docker vs Container Runtime (containerd, CRI-O):**

- **Docker**: Complete platform (build, ship, run) with CLI and daemon
- **Container Runtime**: Just executes containers (lower-level)
- Docker uses containerd as its runtime
- Kubernetes can use containerd directly, bypassing Docker

This builds on container_orchestration concepts and relates to [[docker_image]] and [[docker_container]] for understanding the Docker ecosystem.

## Core Components

| Component           | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| **Docker Engine**   | Core runtime that builds and runs containers   |
| **Docker CLI**      | Command-line interface for Docker commands     |
| **Docker Daemon**   | Background service managing containers         |
| **Docker Registry** | Repository for storing and distributing images |
| **Dockerfile**      | Text file with instructions to build images    |
| **Docker Compose**  | Tool for defining multi-container applications |

## Common Pitfalls

```ad-warning
**Running as root**: Containers often run as root by default. Always create non-root users in production images for security.
```

```ad-danger
**Storing secrets in images**: Never bake secrets into images. Use environment variables, secrets management, or mounted files instead.
```

## Architecture Overview

**Client-Server Model:**

- Docker CLI sends commands to Docker daemon
- Daemon builds, runs, and manages containers
- Can communicate with remote daemons

**Image Layers:**

- Images built in layers (each Dockerfile instruction = layer)
- Layers cached and reused for efficiency
- Only changed layers rebuilt

**Container Lifecycle:**

1. Create: Container created from image
2. Start: Container process begins
3. Run: Application executes
4. Stop: Graceful shutdown (SIGTERM)
5. Kill: Forced termination (SIGKILL)
6. Remove: Container deleted

---

## References

- https://docs.docker.com/get-started/overview/
- https://www.docker.com/resources/what-container/

🗓️ 11112024 1430

# docker_overview

**What it is:**
- Platform for developing, shipping, running applications in containers
- Packages applications with all dependencies into standardized units
- Runs consistently across different environments

**Problem it solves:**
- "Works on my machine" syndrome
- Applications behave differently in dev, test, production due to dependency mismatches, configuration drift, environment differences
- Docker bundles application with entire runtime environment

## Containers vs VMs

### Docker (OS-level virtualization)
- Containers share host OS kernel
- Run in isolated user spaces
- Lightweight (MBs vs GBs)
- Fast startup (seconds vs minutes)
- Efficient resource usage (no duplicate OS overhead)

### VMs (hardware virtualization)
- Full OS per instance with own kernel
- Complete isolation
- Heavier resource overhead

Trade-off:
- Containers: Less isolation (share kernel), can't run Windows containers on Linux hosts
- VMs: More isolation but slower and heavier

For kernel-level security isolation or running different OS types, use VMs.

For understanding underlying technology, see [[virtualization]].

## Core Components

### Docker Engine
- Runtime that builds and runs containers
- Includes daemon (background service) and CLI

### Images and Containers
- [[docker_image]]: Read-only template
- [[docker_container]]: Running instance of image
- Think classes and objects

### Dockerfile
- Text file with build instructions
- Defines base image, copies files, installs dependencies, sets up environment

### Docker Registry
- Where images live (Docker Hub, private registries, cloud registries)
- Push to share, pull to download

For multi-container applications, see [[docker_compose]].

## When to Use Docker

Use for:
- Microservices architecture with isolated services
- Consistent environments across dev/test/prod
- Quick deployment and scaling
- Avoiding dependency conflicts
- Reproducible CI/CD pipelines

Skip for:
- Need different OS kernels on same host (use VMs)
- Require kernel-level security isolation
- Legacy GUI apps with complex display requirements

## Key Trade-offs

### Portability vs Kernel dependency
- Containers portable across hosts with same kernel
- Can't run Linux container on Windows kernel (though Docker Desktop uses VM to bridge this)

### Speed vs Isolation
- Containers start in seconds, use minimal resources
- But share kernel = less isolation than VMs
- Proper configuration critical for security

### Stateless design vs Persistence
- Containers are ephemeral by design
- For persistent data, need [[docker_volumes]] to separate data from container lifecycle

## Common Pitfalls

```ad-danger
**Storing secrets in images**: Secrets baked into images persist in layer history. Anyone with image can extract them. Use environment variables, mounted files, or secrets management instead.
```

```ad-warning
**Running as root**: Containers often default to running as root. Security risk. Always create non-root users in production images.
```

---

## References

- https://docs.docker.com/get-started/overview/
- https://www.docker.com/resources/what-container/

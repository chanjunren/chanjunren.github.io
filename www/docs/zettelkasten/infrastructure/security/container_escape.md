🗓️ 09042026 1200

# container_escape

**What it is:**
- An attack where a process inside a container breaks out of its isolation and gains access to the **host system** or other containers
- Containers share the host kernel — if the isolation boundary is breached, the attacker is on the host

**Why it matters:**
- Containers feel isolated but are NOT virtual machines — they rely on Linux kernel features (namespaces, cgroups) for isolation, not hardware separation
- In multi-client deployments, one compromised container escaping means **all client data on that host is exposed**
- Container escape is the worst-case scenario in any Docker deployment

## How Containers Isolate (And Where It Breaks)

### Namespaces
- Give each container its own view of processes, network, filesystem, users
- The container "thinks" it's alone, but it's a restricted view of the host
- If an attacker can break out of a namespace, they see the host

### Cgroups
- Limit CPU, memory, PIDs — resource boundaries
- Don't provide security isolation, just resource control

### The shared kernel
- All containers share one Linux kernel with the host
- A kernel vulnerability exploited from inside a container = direct host access
- This is the fundamental difference from VMs (which have their own kernel)

## Common Escape Vectors

### Running as root
- Container root = UID 0, same as host root
- With certain misconfigurations (e.g., `--privileged` flag), container root IS host root
- This is why [[dockerfile_best_practices]] emphasizes running as non-root

### Privileged mode (`--privileged`)
- Disables almost all isolation — container has full access to host devices, kernel capabilities
- Meant for Docker-in-Docker or hardware access, not application containers
- A privileged container is barely contained at all

### Docker socket mounting (`/var/run/docker.sock`)
- Gives the container full control over Docker on the host
- Can create new containers, mount host filesystem, effectively become root on host
- Sometimes done for CI/CD or monitoring — always a significant risk

### Kernel vulnerabilities
- Since containers share the host kernel, a kernel exploit from inside a container affects the host
- Historical examples: CVE-2019-5736 (runc escape), CVE-2022-0185 (filesystem exploit)
- Keeping the host kernel patched is critical

### Sensitive host mounts
- Mounting `/`, `/etc`, `/proc`, or other host paths into a container exposes the host
- Even read-only mounts can leak information (host config, credentials, other container data)

## Defenses

### Run as non-root (most important)
- `USER nonroot` in Dockerfile
- Even if an attacker compromises the app, they're an unprivileged user
- Limits what they can do even if they find an escape vector

### Never use `--privileged` in production
- Use specific `--cap-add` for individual capabilities if needed
- Drop all capabilities by default, add back only what's required

### Don't mount the Docker socket
- If you must (monitoring tools), use read-only and restrict with authorization plugins

### Keep the host kernel updated
- Kernel exploits are the hardest to defend against from inside the container
- Patch regularly — this is your last line of defense

### Use seccomp and AppArmor profiles
- **Seccomp**: restricts which system calls a container can make (Docker applies a default profile)
- **AppArmor/SELinux**: mandatory access control limiting file access and capabilities
- The default profiles block many known escape techniques

### User namespace remapping
- Maps container root (UID 0) to an unprivileged user on the host
- Even if someone is "root" inside the container, they're nobody on the host
- Not enabled by default — requires Docker daemon configuration

### Consider gVisor or Kata Containers for high-security workloads
- **gVisor**: intercepts system calls with a user-space kernel — container never touches host kernel directly
- **Kata Containers**: lightweight VMs that look like containers — hardware isolation with container ergonomics
- Both add overhead but dramatically reduce escape risk

## For Your Multi-Client Setup

- Non-root containers + no privileged mode covers most attack surface
- Per-client [[docker_networking]] networks prevent lateral movement between clients
- [[docker_resource_limits]] prevent a compromised container from denial-of-service on the host
- If clients handle sensitive data: consider user namespace remapping or gVisor
- Regular host patching is non-negotiable

```ad-danger
**Mounting Docker socket = giving root access to the host**: A container with access to `/var/run/docker.sock` can create a new privileged container that mounts the host filesystem. This is a well-known and trivial escape path. Never mount the socket unless absolutely necessary.
```

```ad-warning
**`--privileged` disables container isolation**: It grants access to all host devices, disables seccomp, and removes capability restrictions. A privileged container can modify the host kernel, load kernel modules, and access all host filesystems. Treat it as "no container isolation at all."
```

---

## References

- https://docs.docker.com/engine/security/
- https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- https://gvisor.dev/docs/

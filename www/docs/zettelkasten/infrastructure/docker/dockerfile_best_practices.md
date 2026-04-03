🗓️ 03042026 2100

# dockerfile_best_practices

**What it is:**
- Principles for writing efficient, secure, maintainable Dockerfiles
- Directly impacts image size, build speed, and security posture

**Problem it solves:**
- Naive Dockerfiles produce bloated, insecure, slow-to-build images
- In multi-client deployments, inefficient images multiply resource waste across every client stack
- Poor security practices (running as root, leaking secrets) compound risk in multi-tenant environments

## Layer Ordering for Cache Efficiency

Each Dockerfile instruction creates a [[docker_image]] layer. Order matters:
- Least-changing instructions first (base image, system packages)
- Then dependency installation (package.json, go.mod, requirements.txt)
- Source code last (changes most frequently)
- Changing one layer invalidates all layers after it

Pattern: Copy dependency manifest → install dependencies → copy source code. This way code changes don't re-download all dependencies.

## .dockerignore

Prevents unnecessary files from entering the build context:
- `.git`, `node_modules`, `.env`, `*.log`, local IDE config
- Without it: build context sends everything to Docker daemon — slower builds, risk of leaking secrets
- Especially critical when `.env` files contain per-client credentials

## Non-Root User

Always create and switch to a non-root user in production images:
- If a container escape occurs, attacker has whatever permissions the container process had
- Root in container often means root-equivalent on host
- Critical in multi-tenant setups — one compromised client container shouldn't threaten others

Pattern: `RUN addgroup --system app && adduser --system --ingroup app app` then `USER app`

## COPY vs ADD

- **COPY**: Explicit, predictable — copies files from build context
- **ADD**: Implicit magic — auto-extracts tar files, can fetch URLs
- Prefer COPY unless you specifically need tar extraction
- ADD's implicit behavior makes Dockerfiles harder to reason about

## Version Pinning

- Pin base image versions: `FROM node:20.11-alpine` not `FROM node:latest`
- Pin package versions where possible
- `latest` is mutable — your build breaks silently when upstream changes
- Reproducible builds are essential when deploying the same image to multiple client environments

## ENTRYPOINT vs CMD

- **ENTRYPOINT**: The executable — defines what the container runs
- **CMD**: Default arguments — can be overridden at runtime
- Use together: `ENTRYPOINT ["node"]` + `CMD ["server.js"]` allows `docker run myapp worker.js`
- Use CMD alone for flexibility, ENTRYPOINT + CMD for structured defaults

## Minimize Layers

- Combine related `RUN` commands with `&&`
- Clean up in the same layer: `RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*`
- Separate layers only where cache boundaries make sense

For separating build and runtime environments, see [[docker_multistage_build]]. For advanced build features like build secrets and caching, see [[docker_buildx]].

```ad-danger
**Running as root in multi-tenant containers**: If a container escape occurs, the attacker has root on the host. Always use `USER nonroot` in production — this is non-negotiable in multi-client deployments where one breach can compromise all clients.
```

```ad-warning
**Forgetting .dockerignore**: Accidentally copying `.env` or `.git` into the image leaks secrets and bloats build context. Create `.dockerignore` before writing the Dockerfile.
```

---

## References

- https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
- https://docs.docker.com/build/building/best-practices/

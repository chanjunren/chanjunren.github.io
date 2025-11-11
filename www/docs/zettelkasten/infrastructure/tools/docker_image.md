🗓️ 11112024 1435

# docker_image

**Core Concept**:
- Read-only template containing application code, runtime, libraries, and dependencies
- Built from instructions in a Dockerfile
- Composed of layered filesystem (each layer is immutable)
- Stored in registries (Docker Hub, private registries)

## Why It Matters

- **Reproducibility**: Same image produces identical containers every time
- **Distribution**: Easy to share and deploy applications
- **Versioning**: Tag images for version control and rollback

## When to Use

- Need **portable application packages** that run anywhere
- Want **versioned deployments** with easy rollback
- Need to **share applications** across teams or environments
- Want **base templates** for multiple similar applications
- Need **immutable infrastructure** for consistency

## When Not to Use

- **Frequently changing configurations**: Use environment variables or mounted configs instead
- **Large datasets**: Store data in volumes, not images
- **Secrets management**: Never bake secrets into images
- **Development hot-reload**: Use volume mounts for live code changes

## Trade-offs

**Benefits:**
- Immutable and reproducible
- Efficient storage (shared layers)
- Fast distribution (only changed layers transferred)
- Version control with tags
- Easy rollback to previous versions

**Drawbacks:**
- Large images slow to build and transfer
- Layer bloat if not optimized
- No runtime configuration changes
- Secrets exposure risk if mishandled
- Storage overhead for multiple versions

## Key Distinctions

**Image vs Container:**
- **Image**: Static template (like a class in OOP)
- **Container**: Running instance of image (like an object)
- One image can spawn multiple containers
- Containers add writable layer on top of image

**Base Image vs Application Image:**
- **Base Image**: Foundation (e.g., `alpine`, `ubuntu`, `golang:1.23`)
- **Application Image**: Built on base, contains your application
- Base images provide OS and runtime; application images add your code

This builds on [[docker_overview]] and is used to create [[docker_container]] instances. See [[docker_multistage_build]] for optimization strategies.

## Image Layers

**How Layers Work:**
- Each Dockerfile instruction creates a new layer
- Layers are cached and reused
- Only changed layers are rebuilt
- Layers are shared across images

**Layer Optimization:**
- Order instructions from least to most frequently changing
- Combine related commands with `&&` to reduce layers
- Use `.dockerignore` to exclude unnecessary files
- Clean up in same layer where files are created

## Image Tags

**Tagging Convention:**
```
registry/repository:tag
docker.io/library/nginx:1.25-alpine
```

**Common Tag Patterns:**
- `latest`: Most recent build (avoid in production)
- `1.2.3`: Semantic version (recommended)
- `1.2.3-alpine`: Version + variant
- `sha256:abc123...`: Digest for immutability

```ad-warning
**Avoid `latest` tag in production**: It's mutable and can cause unexpected updates. Always use specific version tags.
```

## Common Pitfalls

```ad-danger
**Secrets in layers**: Even if deleted in later layer, secrets remain in image history. Use multi-stage builds or build-time secrets.
```

```ad-warning
**Large image sizes**: Unnecessary dependencies and files bloat images. Use minimal base images (alpine) and multi-stage builds.
```

## Image Management Commands

| Command | Purpose |
|---------|---------|
| `docker build -t name:tag .` | Build image from Dockerfile |
| `docker images` | List local images |
| `docker pull image:tag` | Download image from registry |
| `docker push image:tag` | Upload image to registry |
| `docker tag source target` | Create new tag for image |
| `docker rmi image:tag` | Remove image |
| `docker image prune` | Remove unused images |
| `docker history image:tag` | Show image layer history |
| `docker inspect image:tag` | View detailed image info |

## Dockerfile Best Practices

**Minimize Layers:**
```dockerfile
# Bad: Multiple layers
RUN apt-get update
RUN apt-get install -y package1
RUN apt-get install -y package2

# Good: Single layer
RUN apt-get update && \
    apt-get install -y package1 package2 && \
    rm -rf /var/lib/apt/lists/*
```

**Order for Caching:**
```dockerfile
# Dependencies change less frequently
COPY go.mod go.sum ./
RUN go mod download

# Source code changes frequently
COPY . .
RUN go build
```

**Use Specific Base Images:**
```dockerfile
# Bad: Mutable tag
FROM golang:latest

# Good: Specific version
FROM golang:1.23-alpine
```

---

## References

- https://docs.docker.com/engine/reference/builder/
- https://docs.docker.com/develop/develop-images/dockerfile_best-practices/


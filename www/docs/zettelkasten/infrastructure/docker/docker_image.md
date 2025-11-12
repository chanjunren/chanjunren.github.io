🗓️ 11112024 1435

# docker_image

**What it is:**
- Read-only template containing application code, runtime, libraries, dependencies
- Built from instructions in Dockerfile
- Composed of layered filesystem where each layer is immutable

**Problem it solves:**
- Distributing applications requires packaging code plus all dependencies, runtime environment, configuration
- Traditional deployment: "install X, then Y, configure Z" with endless variation
- Images are portable, reproducible application packages that run identically everywhere

## Image vs Container

Relationship:
- **Image**: Static template (like a class in programming)
- [[docker_container]]: Running instance (like an object)
- One image can spawn many containers
- When you run container, it adds writable layer on top of image's read-only layers

Images don't execute or change. Containers execute and have state.

## Layer System

Each Dockerfile instruction creates new layer:
- Layer = read-only filesystem change
- Layers stack on top of each other

Two key benefits:

### Caching
- If layer hasn't changed, Docker reuses cached version
- Change one line of code, only rebuild layers above it

### Sharing
- Multiple images share common base layers
- Ten Node.js apps share same Node runtime layers
- Saves disk space and transfer time

Pattern: Order Dockerfile instructions from least to most frequently changing. Put dependency installation before copying source code so changing code doesn't invalidate dependency cache.

## Tags and Versions

Images identified by repository and tag:
- Format: `nginx:1.25-alpine`
- `latest` tag is default but dangerous in production - it's mutable and can change
- Always use specific version tags (`1.2.3`) or immutable digests (`sha256:abc123...`) for production

## Distribution via Registries

Where images live:
- Docker Hub, private registries, cloud provider registries
- Push images to share them
- Pull to download
- Separates build environment from runtime environment
- Build once, run anywhere

## Base Images

Most images start `FROM` a base image:
- `alpine`: Minimal ~5MB
- `ubuntu`: Familiar but larger
- Language runtimes: `golang:1.23`, `node:20`, etc.

Base images provide OS and runtime. You add your application on top.

For minimal images and better security, see [[docker_multistage_build]] to exclude build tools from final image.

## Immutability Pattern

Images are immutable:
- Configuration that changes between environments (dev/prod) goes in environment variables or mounted config files
- Not baked into image
- This lets you use exact same image everywhere with different runtime config

Never put secrets in images - they persist in layer history even if you delete them in later layers.

## Common Pitfalls

```ad-danger
**Secrets in image layers**: If you copy secret file then delete it in next layer, it's still in image history. Anyone with image can extract it. Use build-time secrets or [[docker_multistage_build]] to avoid this.
```

```ad-warning
**Large bloated images**: Installing unnecessary dependencies, keeping package manager caches, or using heavyweight base images makes images huge. Use minimal bases like `alpine`, clean up in same layer, and use [[docker_multistage_build]] for compiled languages.
```

---

## References

- https://docs.docker.com/engine/reference/builder/
- https://docs.docker.com/develop/develop-images/dockerfile_best-practices/

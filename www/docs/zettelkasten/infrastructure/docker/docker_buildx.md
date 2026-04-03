🗓️ 03042026 2100

# docker_buildx

**What it is:**
- Docker CLI plugin for extended build capabilities, powered by **BuildKit** engine
- Replaces the legacy builder with parallel execution, better caching, and multi-platform support

**Problem it solves:**
- Default builder is sequential, slow, and lacks advanced caching
- Building for multiple architectures (amd64 + arm64) requires separate machines or manual emulation
- Passing secrets during build (e.g., private repo credentials) means baking them into image layers

## BuildKit Improvements Over Legacy Builder

### Parallel stage execution
- [[docker_multistage_build]] stages that don't depend on each other build concurrently
- Significant speedup for complex multi-stage builds

### Better layer caching
- Cache-mount for package managers: reuse downloaded packages across builds
- Cache isn't invalidated as aggressively as legacy builder

### Build secrets
- `--secret` flag mounts secrets during build without persisting in [[docker_image]] layers
- Safer than build args (`ARG`) which are visible in image history
- Use for private registry auth, API keys needed during build

### SSH forwarding
- Mount SSH agent during build for private repo cloning
- No SSH keys copied into image layers

## Multi-Platform Builds

Build for multiple architectures in a single command:
- `--platform linux/amd64,linux/arm64` builds both
- Uses QEMU emulation or cross-compilation
- Push multi-arch manifest to [[container_registries]] — correct image pulled automatically based on host architecture
- Relevant if deploying to mixed server types or ARM-based cloud instances

## Cache Backends

### Local cache
- Default, stored on build machine
- Fast but not shared across CI runners

### Registry cache (`--cache-to type=registry`)
- Push cache layers to registry, pull on next build
- Shared across CI runners and developers
- Trade-off: extra registry storage and pull time

### GitHub Actions cache
- Built-in integration for GitHub CI
- Free within GitHub Actions storage limits

## When to Use

Use for:
- CI/CD pipelines (parallel builds, shared caching)
- Multi-architecture deployments
- Builds needing private repo access (SSH, secrets)
- Any project where build time matters

Skip for:
- Simple single-platform builds where the default builder is fast enough
- Local development where build speed isn't a bottleneck

## Enabling BuildKit

- Docker Desktop: enabled by default
- Linux servers: set `DOCKER_BUILDKIT=1` or configure in `/etc/docker/daemon.json`
- Docker Engine 23.0+: BuildKit is the default builder

See [[dockerfile_best_practices]] for writing Dockerfiles that maximize BuildKit's cache efficiency.

```ad-warning
**BuildKit may need explicit enabling on Linux servers**: Docker Desktop includes it by default, but production Linux hosts running older Docker versions need `DOCKER_BUILDKIT=1` or daemon config. Verify before assuming cache features work.
```

```ad-example
**Build secrets**: Mount a database password during build for a migration step — `docker buildx build --secret id=db_pass,src=./secret.txt .` — the secret is available during build but never appears in any image layer.
```

---

## References

- https://docs.docker.com/build/buildkit/
- https://docs.docker.com/build/building/multi-platform/
- https://docs.docker.com/build/cache/

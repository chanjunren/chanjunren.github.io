🗓️ 03042026 2100

# container_registries

**What it is:**
- Services that store, distribute, and manage [[docker_image]] containers
- The "Git repo" equivalent for container images — push to share, pull to deploy
- Standardized by the [[oci_spec]] Distribution Specification

**Problem it solves:**
- Need a central place to push images from CI and pull onto production servers
- Multi-client setups need organized image management with access control
- Without a registry strategy: images live only on build machines, no audit trail, no scanning

## Registry Types

### Public (Docker Hub)
- Default registry, largest image library
- Free for public images
- Rate-limited: 100 pulls/6h anonymous, 200 pulls/6h authenticated

### Cloud-hosted (ECR, GCR, ACR, etc.)
- Managed by cloud provider, integrated with their IAM and CI/CD
- Per-repo access control, vulnerability scanning, geo-replication
- Trade-off: convenience and integration vs. cloud lock-in

### Self-hosted (Harbor, GitLab Registry)
- Full control over access, storage, policies
- Required when compliance mandates data stays on-premise
- Operational burden: you manage uptime, backups, security patches

## Tagging Strategies

### Semantic versioning (`v1.2.3`)
- Clear release tracking, easy rollback to known version
- Best for production deployments

### Git SHA (`abc123f`)
- Ties image directly to source code commit
- Best for CI/CD pipelines and debugging

### `latest` tag
- Mutable — points to different image over time
- Never use in production; acceptable for local development only

Pattern: Tag with both semver and git SHA. Use semver for human communication, SHA for traceability.

## Multi-Client Access Control

For deploying different client stacks from one server:
- Organize repos by client: `registry.example.com/client-a/app`, `registry.example.com/client-b/app`
- Per-repo pull credentials — each client stack only has access to its own images
- Audit logs track who pulled what and when
- Vulnerability scanning ensures no client gets deployed with known CVEs

## When to Use What

### Starting out / single server
- Docker Hub (authenticated) or cloud registry with free tier
- Simple, minimal setup

### Multi-client production
- Private registry (cloud-hosted or self-hosted) with per-client repos
- Access control and scanning are non-negotiable

### Compliance-heavy environments
- Self-hosted (Harbor) for full data sovereignty
- Air-gapped registries for restricted networks

```ad-danger
**Public registries expose images to everyone**: Never push images containing client data, proprietary code, or secrets to public repos. Even "unlisted" doesn't mean secure.
```

```ad-warning
**Docker Hub rate limits**: Anonymous pulls limited to 100/6h. Production deployments should use authenticated pulls or a private registry to avoid deployment failures from rate limiting.
```

---

## References

- https://docs.docker.com/docker-hub/
- https://distribution.github.io/distribution/
- https://goharbor.io/

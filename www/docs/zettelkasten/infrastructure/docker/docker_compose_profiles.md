🗓️ 03042026 2100

# docker_compose_profiles

**What it is:**
- Named groups that selectively start subsets of services in [[docker_compose]]
- Services assigned to a profile only start when that profile is explicitly activated
- Services without a profile always start

**Problem it solves:**
- Running all services wastes resources when you only need a subset
- Multi-client deployments on one server need to spin up only client-specific stacks
- Without profiles: separate compose files per environment, duplicating shared config

## How Profiles Work

### Activation
- `docker compose --profile client-a up` starts services tagged with `client-a` plus all untagged services
- Multiple profiles: `--profile client-a --profile monitoring` activates both
- `COMPOSE_PROFILES=client-a,monitoring` as environment variable alternative

### Untagged services
- Services without `profiles` key always start regardless of which profiles are active
- Use this for shared infrastructure (reverse proxy, shared database)

## Multi-Client Isolation Pattern

One compose file, different profiles per client:
- Shared services (nginx, monitoring) have no profile — always run
- Each client's app/worker/cache tagged with their profile
- Activate only the client stack you need

Combine with per-client [[docker_networking]] networks for true network isolation between client stacks.

## When to Use

Use for:
- Optional services (debug tools, monitoring, admin panels)
- Multi-client stacks on a shared host
- Dev vs prod service subsets from one file

Skip for:
- Every service always runs together — profiles add complexity for no benefit
- Clients need fully separate compose files for security/compliance reasons
- See [[docker_compose_extends]] for DRY config reuse across separate files instead

## Trade-offs

### Single file convenience
- One source of truth, easy to see all services
- Risk of accidental cross-client changes in shared file

### Shared namespace
- All profiles share the same volume and network namespace by default
- Must explicitly define per-client networks and volumes for isolation
- Compare with separate compose files which get isolated namespaces automatically

```ad-warning
**Profiles share networks and volumes by default**: For true client isolation, define separate networks per profile and assign services accordingly. Without this, client-a's containers can reach client-b's containers on the default network.
```

```ad-danger
**Forgetting to tag a client-specific service**: An untagged service starts for ALL profiles. If a client's database accidentally has no profile, it runs whenever any client stack starts — wasting resources and creating confusion.
```

---

## References

- https://docs.docker.com/compose/profiles/
- https://docs.docker.com/compose/compose-file/05-services/#profiles

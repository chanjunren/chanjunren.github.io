🗓️ 14042026 1200

# swarm_secrets_and_configs

**What it is:**
- Swarm-native mechanisms for distributing sensitive data (**secrets**) and non-sensitive configuration (**configs**) to services
- Secrets are encrypted at rest in the Raft log and only delivered to nodes running the service
- Configs use the same distribution mechanism but for non-sensitive files

**Why it exists:**
- [[docker_env_management]] patterns (`.env` files, `env_file` directive) assume the file exists on the host running the container
- In a [[docker_swarm]] cluster, tasks can land on any node — you'd need to copy `.env` files to every VM and keep them in sync
- Secrets and configs are stored centrally by managers and distributed automatically to whichever node needs them

## Secrets

### How they work
- Created with `docker secret create <name> <file>` or piped from stdin
- Stored encrypted in the Swarm's **Raft log** (only on manager nodes)
- Mounted as a file at **`/run/secrets/<name>`** inside the container
- Only delivered to nodes that run a service attached to that secret
- Stored in a **tmpfs mount** on worker nodes — never written to disk

### What to store as secrets
- Database passwords, API keys, TLS private keys
- Anything you'd put in `.env` but don't want on disk or in version control

## Configs

### How they work
- Created with `docker config create <name> <file>`
- Same distribution mechanism as secrets but **not encrypted** at rest
- Mounted at a configurable path inside the container (not restricted to `/run/secrets/`)

### What to store as configs
- nginx.conf, prometheus.yml, application config files
- Anything that needs to be consistent across nodes but isn't sensitive

## Secrets vs Configs vs Env Files

| | Encrypted at rest | Distribution | Best for |
|---|---|---|---|
| **Secrets** | Yes (Raft log + tmpfs on workers) | Automatic to assigned nodes | Passwords, keys, certs |
| **Configs** | No | Automatic to assigned nodes | Config files (nginx, prometheus) |
| **Env files** | No | Must exist on every host | Single-host [[docker_compose]] |

## Lifecycle

### Creating
- `echo "s3cret" | docker secret create db_password -`
- `docker config create nginx_conf ./nginx.conf`

### Attaching to services
- In compose file: `secrets:` and `configs:` sections at both service level and top level
- Services only receive secrets/configs explicitly attached to them
- App reads the password from `/run/secrets/db_password` instead of an environment variable

### Rotating
- Secrets are **immutable** — cannot update in-place
- Create new version (e.g. `db_password_v2`), update service to use it, remove old
- Intentional design: ensures you know exactly which version each service uses

```ad-warning
Secrets are immutable once created. To rotate, create a new secret, update the service reference, then remove the old one. This prevents accidental in-place changes from propagating to running services unexpectedly.
```

```ad-example
A database service needs a password. `echo "s3cret" | docker secret create db_password -` stores it encrypted. In the compose file, the service declares `secrets: [db_password]`, and the app reads from `/run/secrets/db_password` at startup.
```

---

## References

- https://docs.docker.com/engine/swarm/secrets/
- https://docs.docker.com/engine/swarm/configs/

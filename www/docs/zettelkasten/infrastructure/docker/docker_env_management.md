🗓️ 03042026 2100

# docker_env_management

**What it is:**
- Strategies for managing environment variables and secrets in [[docker_compose]]
- Multiple mechanisms with a defined precedence order

**Problem it solves:**
- Multi-client deployments need different credentials, ports, domains per client
- Hardcoding config in YAML is insecure and inflexible
- Need clear separation between Compose-level substitution and container runtime config

## Precedence Order (highest wins)

1. CLI environment (`docker compose run -e VAR=val`)
2. Shell environment (exported in your terminal)
3. `.env` file (auto-loaded by Compose)
4. `environment` directive in YAML
5. `env_file` directive contents
6. Dockerfile `ENV` instruction

Understanding this prevents "why isn't my variable taking effect" debugging.

## Three Mechanisms

### `.env` file
- Auto-loaded by Compose for **variable substitution in the YAML file itself**
- `image: myapp:${VERSION}` reads `VERSION` from `.env`
- NOT automatically passed into containers

### `env_file` directive
- Loads variables directly **into the container** at runtime
- Separate file per client: `env_file: .env.client-a`
- Good for secrets and runtime config (DB passwords, API keys)

### `environment` directive
- Inline key-value pairs in YAML
- Visible in the compose file — use for non-sensitive defaults only
- Can reference shell/`.env` variables: `DB_HOST: ${DB_HOST:-localhost}`

## Per-Client Pattern

For multi-client isolation on one host:
- Shared `.env` for Compose-level config (image versions, network names)
- Per-client `env_file` for runtime secrets (`.env.client-a`, `.env.client-b`)
- Keep secrets out of the YAML file entirely
- Combine with [[docker_compose_profiles]] to activate client-specific stacks

## Default Values and Required Variables

- `${VAR:-default}` provides fallback if unset
- `${VAR:?error message}` fails with error if unset — use for required config
- Prevents silent misconfiguration in multi-client setups

```ad-danger
**Never commit `.env` files with secrets to version control**: Use `.env.example` with placeholder values. Add `.env*` to `.gitignore`. Leaked credentials in git history are extremely hard to fully revoke.
```

```ad-warning
**`.env` vs `env_file` confusion**: The `.env` file only works for variable substitution in the YAML file. To pass variables into running containers, use the `env_file` or `environment` directives. Mixing these up is the most common Compose config mistake.
```

---

## References

- https://docs.docker.com/compose/environment-variables/
- https://docs.docker.com/compose/environment-variables/envvars-precedence/

🗓️ 03042026 2100

# docker_logging

**What it is:**
- How Docker captures and manages container stdout/stderr output
- Pluggable logging drivers determine where logs go and how they're stored

**Problem it solves:**
- Multi-client server generates logs from many containers simultaneously
- Without a strategy: logs fill disk, get lost on container restart, or become impossible to search
- Need per-client log separation for debugging and audit trails

## Logging Drivers

### `json-file` (default)
- Stores logs as JSON on host disk
- Compatible with `docker logs` command
- No rotation by default — will fill disk

### `local`
- Optimized storage format, smaller files than json-file
- Built-in rotation
- Still compatible with `docker logs`

### Remote drivers (`fluentd`, `syslog`, `awslogs`, `gelf`)
- Ship logs directly to external systems
- No local disk risk
- `docker logs` command stops working — logs only exist in the remote system

## Log Rotation (Critical for Production)

For `json-file` and `local` drivers:
- `max-size`: Maximum size per log file (e.g., `10m`)
- `max-file`: Number of rotated files to keep (e.g., `3`)
- Set per-service in [[docker_compose]] or globally in Docker daemon config
- Without rotation, a chatty service fills disk and crashes the entire host

## Per-Client Log Separation

For multi-client stacks on one server:
- Add client labels to containers — filter logs by label
- Use separate log files via driver options per client stack
- Centralized logging (ELK, Loki, CloudWatch) with client label as index key
- Enables per-client debugging without wading through other clients' noise

Reuse logging config across services with [[docker_compose_extends]] YAML anchors.

## Centralized Logging Pattern

When to centralize:
- Multiple clients on one host
- Need searchable audit trails
- Need alerting on errors

Stack: Container → logging driver → aggregator (Fluentd/Promtail) → storage (Loki/Elasticsearch) → dashboard (Grafana/Kibana)

## Trade-offs

### Local logs
- Simple, no extra infrastructure
- Risk of disk fill, hard to search, lost when container is removed

### Remote/centralized logs
- Searchable, durable, alertable
- Added complexity and cost, dependency on external system
- If logging pipeline is down, you might lose logs

```ad-danger
**Default json-file driver has NO log rotation**: Production containers will fill disk and crash the host. Always configure `max-size` and `max-file` — or switch to the `local` driver which rotates by default.
```

```ad-warning
**Switching to remote drivers disables `docker logs`**: Once you use `fluentd`, `syslog`, or cloud drivers, the CLI `docker logs` command returns nothing. You must query the remote system instead. Consider dual-logging if CLI access is important.
```

---

## References

- https://docs.docker.com/config/containers/logging/
- https://docs.docker.com/config/containers/logging/configure/

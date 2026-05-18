🗓️ 11112025 1630

# grafana_agent

**Core Concept:**
- Lightweight telemetry collector that scrapes metrics/logs/traces locally and forwards to remote backends (Grafana Cloud, Prometheus)
- Resource-efficient alternative to running full Prometheus (~30MB vs ~200MB+).

## Why It Matters

- **Hybrid model** - Pulls from apps (standard Prometheus), pushes to cloud (remote write)
- **Cloud-native** - Solves "can't scrape behind firewall" problem for managed platforms
- **Lightweight** - No local storage, stateless operation, minimal footprint
- **Multi-signal** - Single agent for metrics, logs, traces, profiles

## When to Use

- Sending telemetry to **managed platforms** (Grafana Cloud, remote Prometheus)
- **Resource-constrained** environments (edge, IoT, containers)
- **Multi-tenant** deployments with isolated collection per tenant
- Need **unified collector** instead of separate agents per signal type

## When Not to Use

- Running **self-hosted Prometheus** with local storage (use Prometheus directly)
- Need **local PromQL queries** (Agent has no query engine)
- **Simple single-host** monitoring (node_exporter suffices)
- Extremely **high-cardinality** metrics needing local pre-aggregation

## Architecture

```
App exposes /metrics → Agent scrapes (pull) → Agent pushes (remote write) → Cloud Backend
```

**Key insight**: Combines pull model (Prometheus standard) with push model (cloud-friendly) to bridge local and remote environments.

## Trade-offs

**Benefits:**
- Minimal footprint (30-50MB RAM typical)
- No storage management
- Works behind firewalls (outbound-only)
- Single binary for all telemetry

**Drawbacks:**
- No local querying
- Network dependency
- Requires remote backend
- Additional component to manage

## Key Distinctions

**vs Prometheus:** Agent = Prometheus without storage/querying; use when sending to remote backend

**vs OpenTelemetry Collector:** Agent is Prometheus-native; OTel is vendor-neutral with broader protocol support

**vs Telegraf:** Agent for Grafana/Prometheus stack; Telegraf for InfluxDB ecosystem

## Deprecation Notice

```ad-warning
**Grafana Agent deprecated** (EOL November 1, 2025). Migrate to **Grafana Alloy** - the successor with improved performance and component-based architecture.
```

## Common Patterns

**Sidecar Pattern** ([[sidecar_pattern]]): Deploy Agent alongside each app instance
- Agent scrapes localhost (no network config)
- Scales 1:1 with app
- Isolated failure domains

**Centralized Pattern**: Single Agent scrapes multiple apps
- Lower resource overhead
- Centralized config
- Single point of failure

## Common Pitfalls

```ad-danger
**WAL disk full**: If remote backend unreachable, Write-Ahead Log fills disk. Configure `wal_truncate_frequency` and monitor disk usage.
```

```ad-warning
**Cardinality explosion**: Agent forwards all metrics. High-cardinality labels (user IDs, request IDs) overwhelm backend. Use `metric_relabel_configs` to drop before remote write.
```

```ad-warning
**Scrape interval mismatch**: Match or exceed remote backend's expected resolution. Grafana Cloud free tier expects 15s-60s intervals.
```

---

## References

- https://grafana.com/docs/agent/latest/
- https://grafana.com/docs/agent/latest/about/
- https://github.com/grafana/agent
- https://grafana.com/blog/2024/04/09/grafana-alloy-opentelemetry-collector-with-prometheus-pipelines/

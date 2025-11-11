🗓️ 11112025 1730

# grafana_alloy

**Core Concept:**
- Successor to [[grafana_agent]] (Agent EOL November 2025)
- OpenTelemetry Collector distribution with Prometheus pipelines built-in
- Unified telemetry collector for metrics, logs, traces, and profiles
- Component-based architecture with programmable pipelines

## Why It Matters

- **Vendor-neutral foundation** - Built on OpenTelemetry standard while maintaining Prometheus compatibility
- **Single collector** - Replaces need for separate Prometheus, OTel Collector, and Agent deployments
- **Better performance** - Improved resource efficiency and throughput vs Grafana Agent
- **Enhanced flexibility** - Expression-based configuration for complex pipeline logic
- **Native Kubernetes support** - Interacts with K8s resources without additional operators

## When to Use

- **Migrating from Grafana Agent** (required by November 2025)
- **Multi-signal collection** - Need unified collector for metrics/logs/traces/profiles
- **Complex pipelines** - Require data transformation, filtering, or enrichment before export
- **Kubernetes environments** - Need native K8s resource discovery and monitoring
- **Grafana ecosystem** - Sending to Grafana Cloud, Prometheus, Loki, Tempo, Pyroscope

## When Not to Use

- **Simple Prometheus scraping** - Use Prometheus directly if only collecting metrics locally
- **Pure OpenTelemetry** - Use vanilla OTel Collector if avoiding Grafana-specific features
- **Legacy systems** - Grafana Agent still supported until EOL if migration not urgent
- **Resource-critical edge** - Agent might be lighter for extremely constrained environments (until deprecated)

## Architecture

```
Apps expose telemetry → Alloy collects (pull/push) → Alloy processes → Alloy exports → Backends
```

**Key differences from Agent:**
- **Component-based** - Modular pipeline construction vs monolithic config
- **River language** - Custom DSL for configuration (more expressive than YAML)
- **Built-in UI** - Visual pipeline debugging and monitoring
- **Clustering** - Native workload distribution and HA

## Trade-offs

**Benefits:**
- Future-proof (active development, Agent deprecated)
- More powerful pipeline capabilities
- Better Kubernetes integration
- Built-in debugging UI
- OpenTelemetry native

**Drawbacks:**
- New configuration language (River DSL learning curve)
- Slightly higher resource usage than Agent
- Less mature (newer project)
- Migration effort from Agent

## Key Distinctions

**vs Grafana Agent:** Alloy is Agent's successor with component architecture and better performance; migrate before Agent EOL

**vs OpenTelemetry Collector:** Alloy = OTel Collector + Prometheus pipelines; use Alloy for Grafana ecosystem, OTel for vendor-neutral

**vs Prometheus:** Alloy is collector without storage; Prometheus is full TSDB; use Alloy to forward to remote backends

## Common Patterns

**Sidecar Pattern** ([[sidecar_pattern]]): Deploy Alloy alongside each app
- Collects from localhost
- Scales with application
- Isolated failure domains

**DaemonSet Pattern** (Kubernetes): One Alloy per node
- Collects from all pods on node
- Lower resource overhead
- Node-level metrics

**Centralized Pattern**: Single Alloy instance
- Scrapes multiple targets
- Centralized configuration
- Single point of failure

## Common Pitfalls

```ad-warning
**River syntax confusion**: Alloy uses River DSL, not YAML. Agent configs need conversion. Use `alloy convert` tool to migrate.
```

```ad-danger
**Component dependencies**: Components must be defined before use. Order matters in River configs. Circular dependencies will fail.
```

## Migration from Grafana Agent

**Timeline**: Agent reaches EOL November 1, 2025

**Migration steps:**
1. Use `alloy convert` tool to convert Agent YAML to River
2. Test converted config in staging
3. Deploy Alloy alongside Agent (dual-run)
4. Validate metrics/logs match
5. Switch traffic to Alloy
6. Decommission Agent

**Config conversion:**
```bash
alloy convert --source-format=static --output=config.alloy config.yaml
```

---

## References

- https://grafana.com/docs/alloy/latest/
- https://grafana.com/blog/2024/04/09/grafana-alloy-opentelemetry-collector-with-prometheus-pipelines/
- https://github.com/grafana/alloy
- https://grafana.com/docs/alloy/latest/get-started/


🗓️ 18052026 2200

# cadvisor_container_metrics

**cAdvisor** (Container Advisor) runs inside the **kubelet** and exposes per-container resource usage as Prometheus time series — CPU, memory, network, disk I/O — all prefixed with `container_`.

These metrics are the foundation of container debugging in Kubernetes: what each container actually consumes vs. its resource requests/limits. For host-level metrics (what the machine has available), see [[node_exporter_host_metrics]].

## How cAdvisor Exposes Metrics

- Embedded in kubelet — no separate deployment in K8s
- Endpoint: `:10250/metrics/cadvisor` (kubelet) or `:8080/metrics` (standalone)
- Key labels: `container`, `pod`, `namespace`, `image`, `id`
- All metrics are [[data_types]] Counters or Gauges

---

## CPU Metrics

| Metric | Type | Unit | Measures |
|--------|------|------|----------|
| `container_cpu_usage_seconds_total` | Counter | seconds | Total CPU time consumed |
| `container_cpu_user_seconds_total` | Counter | seconds | User-mode CPU time |
| `container_cpu_system_seconds_total` | Counter | seconds | Kernel-mode CPU time |
| `container_cpu_cfs_throttled_seconds_total` | Counter | seconds | Time throttled by CFS |
| `container_cpu_cfs_throttled_periods_total` | Counter | count | Throttled scheduling periods |
| `container_cpu_cfs_periods_total` | Counter | count | Total CFS scheduling periods |

### PromQL

**CPU usage rate per container:**
```promql
sum by(container, pod, namespace) (
  rate(container_cpu_usage_seconds_total{container!=""}[5m])
)
```

**CPU throttle percentage:**
```promql
rate(container_cpu_cfs_throttled_periods_total[5m])
/ rate(container_cpu_cfs_periods_total[5m]) * 100
```

**CPU usage vs request:**
```promql
sum by(pod) (rate(container_cpu_usage_seconds_total{container!=""}[5m]))
/ sum by(pod) (kube_pod_container_resource_requests{resource="cpu"})
```

---

## Memory Metrics

| Metric | Type | Unit | Measures |
|--------|------|------|----------|
| `container_memory_working_set_bytes` | Gauge | bytes | **Working set** — what K8s uses for OOMKill |
| `container_memory_rss` | Gauge | bytes | Resident Set Size (actual RAM, no cache) |
| `container_memory_usage_bytes` | Gauge | bytes | Total usage (includes page cache) |
| `container_memory_cache` | Gauge | bytes | Page cache memory |
| `container_memory_swap` | Gauge | bytes | Swap usage |
| `container_memory_max_usage_bytes` | Gauge | bytes | Peak memory recorded |
| `container_spec_memory_limit_bytes` | Gauge | bytes | Memory limit from resource spec |

```ad-warning
Use `container_memory_working_set_bytes`, not `container_memory_usage_bytes`, for OOMKill alerting. The K8s OOM killer uses working set. `usage_bytes` includes reclaimable page cache and overstates actual pressure.
```

### PromQL

**Working set vs limit (OOMKill risk %):**
```promql
container_memory_working_set_bytes{container!=""}
/ container_spec_memory_limit_bytes{container!=""} * 100
```

**RSS memory by namespace:**
```promql
sum by(namespace) (container_memory_rss{container!=""})
```

**Containers closest to OOMKill:**
```promql
topk(10,
  container_memory_working_set_bytes{container!=""}
  / container_spec_memory_limit_bytes{container!=""} * 100
)
```

---

## Network Metrics

| Metric | Type | Unit |
|--------|------|------|
| `container_network_receive_bytes_total` | Counter | bytes |
| `container_network_transmit_bytes_total` | Counter | bytes |
| `container_network_receive_errors_total` | Counter | errors |
| `container_network_transmit_errors_total` | Counter | errors |
| `container_network_receive_packets_total` | Counter | packets |
| `container_network_transmit_packets_total` | Counter | packets |
| `container_network_receive_packets_dropped_total` | Counter | packets |
| `container_network_transmit_packets_dropped_total` | Counter | packets |

### PromQL

**Bandwidth per pod (bytes/sec):**
```promql
sum by(pod) (rate(container_network_receive_bytes_total[5m]))
```

**Network error rate:**
```promql
rate(container_network_receive_errors_total[5m])
+ rate(container_network_transmit_errors_total[5m])
```

**Dropped packets:**
```promql
rate(container_network_receive_packets_dropped_total[5m])
+ rate(container_network_transmit_packets_dropped_total[5m])
```

---

## Disk I/O Metrics

| Metric | Type | Unit |
|--------|------|------|
| `container_fs_reads_total` | Counter | ops |
| `container_fs_writes_total` | Counter | ops |
| `container_fs_reads_bytes_total` | Counter | bytes |
| `container_fs_writes_bytes_total` | Counter | bytes |
| `container_fs_usage_bytes` | Gauge | bytes |
| `container_fs_limit_bytes` | Gauge | bytes |

### PromQL

**Disk write throughput:**
```promql
rate(container_fs_writes_bytes_total[5m])
```

**Filesystem usage %:**
```promql
container_fs_usage_bytes / container_fs_limit_bytes * 100
```

**IOPS:**
```promql
rate(container_fs_reads_total[5m]) + rate(container_fs_writes_total[5m])
```

---

## Label Filters

cAdvisor emits metrics for pod-level aggregates and the **pause container** alongside real containers. Filter these out:

| Filter | Purpose |
|--------|---------|
| `{container!=""}` | Excludes pod-level aggregates (no container name) |
| `{container!="POD"}` | Excludes the pause container (holds network namespace) |
| `{image!=""}` | Alternative — only containers with a real image |

Always include at least `{container!=""}` to avoid double-counting.

---

## Quick Reference

```
┌──────────────────────────┬──────────────────────────────────────────────────────────────────┐
│ I want to know…          │ PromQL                                                           │
├──────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ Container CPU usage      │ rate(container_cpu_usage_seconds_total{container!=""}[5m])       │
│ CPU throttle %           │ rate(..throttled_periods[5m]) / rate(..cfs_periods[5m]) * 100   │
│ Memory usage (real)      │ container_memory_working_set_bytes{container!=""}                │
│ OOMKill risk %           │ working_set_bytes / spec_memory_limit_bytes * 100               │
│ Network bandwidth        │ rate(container_network_receive_bytes_total[5m])                  │
│ Disk write throughput    │ rate(container_fs_writes_bytes_total[5m])                        │
│ Filesystem usage %       │ container_fs_usage_bytes / container_fs_limit_bytes * 100       │
└──────────────────────────┴──────────────────────────────────────────────────────────────────┘
```

---

## References

- [cAdvisor GitHub](https://github.com/google/cadvisor)
- [Kubernetes Resource Metrics Pipeline](https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)

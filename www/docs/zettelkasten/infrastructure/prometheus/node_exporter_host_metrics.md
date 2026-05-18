🗓️ 18052026 2200

# node_exporter_host_metrics

The Prometheus **node exporter** exposes hardware and OS-level metrics per host — CPU, memory, disk, network, filesystem — all prefixed with `node_`. It answers "what does the machine have and how much is used?"

[[cadvisor_container_metrics]] tells you what containers consume; node exporter tells you what the underlying host has available. Together: "is the container starved, or is the host overloaded?"

## How Node Exporter Works

- Runs as a **DaemonSet** in K8s (one per node) or standalone binary
- Endpoint: `:9100/metrics`
- Key label: `instance` (identifies the node)
- Reads from `/proc` and `/sys` — zero app instrumentation needed

---

## CPU Metrics

Single metric, multiple modes via the `mode` label:

| Metric | Type | Unit |
|--------|------|------|
| `node_cpu_seconds_total` | Counter | seconds |

Modes: `user`, `system`, `idle`, `iowait`, `irq`, `softirq`, `steal`, `nice`, `guest`

### PromQL

**Overall CPU utilization %:**
```promql
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

**CPU breakdown by mode:**
```promql
avg by(mode) (rate(node_cpu_seconds_total[5m])) * 100
```

**iowait (disk bottleneck signal):**
```promql
avg by(instance) (rate(node_cpu_seconds_total{mode="iowait"}[5m])) * 100
```

**Number of CPU cores:**
```promql
count by(instance) (count by(instance, cpu) (node_cpu_seconds_total))
```

**Steal time (noisy neighbor in shared infra):**
```promql
avg by(instance) (rate(node_cpu_seconds_total{mode="steal"}[5m])) * 100
```

---

## Memory Metrics

| Metric | Type | Unit | Measures |
|--------|------|------|----------|
| `node_memory_MemTotal_bytes` | Gauge | bytes | Total physical RAM |
| `node_memory_MemAvailable_bytes` | Gauge | bytes | Available memory (kernel estimate, includes reclaimable) |
| `node_memory_MemFree_bytes` | Gauge | bytes | Completely free memory (misleadingly low) |
| `node_memory_Buffers_bytes` | Gauge | bytes | Buffer cache |
| `node_memory_Cached_bytes` | Gauge | bytes | Page cache |
| `node_memory_SwapTotal_bytes` | Gauge | bytes | Total swap |
| `node_memory_SwapFree_bytes` | Gauge | bytes | Free swap |

```ad-warning
Use `MemAvailable`, not `MemFree`. Linux counts cache and buffers as "used", but they are reclaimable under pressure. `MemAvailable` accounts for this — `MemFree` makes nodes look worse than they are.
```

### PromQL

**Memory utilization %:**
```promql
(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100
```

**Swap usage %:**
```promql
(1 - node_memory_SwapFree_bytes / node_memory_SwapTotal_bytes) * 100
```

**Available memory in GB:**
```promql
node_memory_MemAvailable_bytes / 1024 / 1024 / 1024
```

---

## Disk / Filesystem Metrics

### Filesystem (capacity)

| Metric | Type | Unit |
|--------|------|------|
| `node_filesystem_size_bytes` | Gauge | bytes |
| `node_filesystem_avail_bytes` | Gauge | bytes |
| `node_filesystem_free_bytes` | Gauge | bytes |

`avail_bytes` = space available to non-root users. `free_bytes` = total free including reserved blocks.

### Disk I/O (throughput)

| Metric | Type | Unit |
|--------|------|------|
| `node_disk_read_bytes_total` | Counter | bytes |
| `node_disk_written_bytes_total` | Counter | bytes |
| `node_disk_reads_completed_total` | Counter | ops |
| `node_disk_writes_completed_total` | Counter | ops |
| `node_disk_io_time_seconds_total` | Counter | seconds |
| `node_disk_read_time_seconds_total` | Counter | seconds |
| `node_disk_write_time_seconds_total` | Counter | seconds |

### PromQL

**Filesystem usage % (exclude tmpfs/overlay):**
```promql
(1 - node_filesystem_avail_bytes{fstype!~"tmpfs|overlay"}
/ node_filesystem_size_bytes{fstype!~"tmpfs|overlay"}) * 100
```

**Disk I/O throughput (read + write bytes/sec):**
```promql
rate(node_disk_read_bytes_total[5m])
+ rate(node_disk_written_bytes_total[5m])
```

**Disk I/O utilization % (how busy the disk is):**
```promql
rate(node_disk_io_time_seconds_total[5m]) * 100
```

**IOPS:**
```promql
rate(node_disk_reads_completed_total[5m])
+ rate(node_disk_writes_completed_total[5m])
```

**Average I/O latency per write:**
```promql
rate(node_disk_write_time_seconds_total[5m])
/ rate(node_disk_writes_completed_total[5m])
```

**Predict disk full (capacity planning)** — see [[range_function_calculations]] for how `predict_linear` works:
```promql
predict_linear(node_filesystem_avail_bytes{fstype!~"tmpfs|overlay"}[6h], 24*3600) < 0
```

---

## Network Metrics

| Metric | Type | Unit |
|--------|------|------|
| `node_network_receive_bytes_total` | Counter | bytes |
| `node_network_transmit_bytes_total` | Counter | bytes |
| `node_network_receive_errs_total` | Counter | errors |
| `node_network_transmit_errs_total` | Counter | errors |
| `node_network_receive_drop_total` | Counter | packets |
| `node_network_transmit_drop_total` | Counter | packets |

### PromQL

**Network bandwidth by interface (exclude loopback):**
```promql
rate(node_network_receive_bytes_total{device!="lo"}[5m])
```

**Total network errors:**
```promql
rate(node_network_receive_errs_total[5m])
+ rate(node_network_transmit_errs_total[5m])
```

**Dropped packets:**
```promql
rate(node_network_receive_drop_total[5m])
+ rate(node_network_transmit_drop_total[5m])
```

---

## System Metrics

| Metric | Measures |
|--------|----------|
| `node_load1` / `node_load5` / `node_load15` | 1/5/15-minute load averages |
| `node_boot_time_seconds` | Unix timestamp of last boot |
| `node_time_seconds` | Current system clock |
| `node_uname_info` | Kernel/OS info (labels only, value always 1) |

### PromQL

**Uptime:**
```promql
time() - node_boot_time_seconds
```

**Load per CPU core (>1.0 = overloaded):**
```promql
node_load1
/ count by(instance) (count by(instance, cpu) (node_cpu_seconds_total))
```

---

## Quick Reference

```
┌──────────────────────────┬──────────────────────────────────────────────────────────────────────┐
│ I want to know…          │ PromQL                                                               │
├──────────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ CPU utilization %        │ 100 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100      │
│ Memory utilization %     │ (1 - MemAvailable / MemTotal) * 100                                 │
│ Disk space %             │ (1 - avail_bytes / size_bytes) * 100                                │
│ Disk I/O throughput      │ rate(node_disk_read_bytes_total[5m]) + rate(..written..[5m])        │
│ Disk I/O utilization %   │ rate(node_disk_io_time_seconds_total[5m]) * 100                     │
│ Network bandwidth        │ rate(node_network_receive_bytes_total{device!="lo"}[5m])            │
│ Uptime                   │ time() - node_boot_time_seconds                                     │
│ Load per CPU             │ node_load1 / count(cpus)                                            │
│ Disk full prediction     │ predict_linear(avail_bytes[6h], 86400) < 0                          │
└──────────────────────────┴──────────────────────────────────────────────────────────────────────┘
```

---

## References

- [Node Exporter GitHub](https://github.com/prometheus/node_exporter)
- [Prometheus Node Exporter Guide](https://prometheus.io/docs/guides/node-exporter/)

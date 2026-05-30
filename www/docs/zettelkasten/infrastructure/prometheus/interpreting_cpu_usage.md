🗓️ 29052026 1500

# interpreting_cpu_usage

`rate(container_cpu_usage_seconds_total[5m])` returns a number like `0.5` or `2.3`. That number is **CPU cores** — seconds of CPU time consumed per second of wall time.

- 0.5 = half a core
- 2.3 = two and a bit cores running simultaneously
- A single-threaded app maxes out at **1.0**
- A JVM with 4 busy threads can reach **4.0** if CPU is available

The metric is a [[data_types]] Counter. `rate()` (see [[range_function_calculations]]) on a seconds counter produces seconds-per-second = fraction of cores. For the raw metrics and queries, see [[cadvisor_container_metrics]].

## Usage vs Request vs Limit

| Concept | What it is | Enforced by |
|---------|-----------|-------------|
| **Request** | Guaranteed minimum CPU | K8s scheduler (placement) |
| **Limit** | Hard ceiling | Linux CFS (runtime) |
| **Usage** | Actual consumption | Measured by cAdvisor |

### Reading the Ratios

- **usage / request < 1.0** — underutilizing guaranteed allocation; request may be oversized
- **usage / request > 1.0** — borrowing spare capacity from the node; normal when headroom exists
- **usage / limit approaching 1.0** — CFS throttling imminent or already happening

```ad-warning
usage > request is not a problem. The container is using available slack on the node. Only usage near the limit triggers throttling.
```

## When Throttling Matters

**CFS throttle %** = fraction of 100ms scheduling periods where the container used its full quota and was paused.

- A throttled container does not get more CPU even if the node has idle cores

### Deciding Whether to Act

| Throttle % | Latency impact? | Verdict |
|-----------|----------------|---------|
| < 5% | No | Normal burst behavior |
| 5–25% | No | Acceptable for batch workloads |
| 5–25% | Yes | Limit may be too low for this traffic level |
| > 25% sustained | Yes | Raise the limit or optimize the hot path |
| > 25% sustained | No | Batch workload — likely acceptable |

- Throttle % alone is not enough — **correlate with latency** (p95/p99)
- Throttling without latency degradation is the limit doing its job

### High Throttle % but Low Average CPU

- Workload is **bursty** — short spikes saturate the limit within individual 100ms periods, then idle
- The average smooths out the spikes
- Check `irate()` for sub-minute spike visibility
- Consider raising the limit to absorb bursts, even if average usage is moderate

## JVM Considerations

- **GC is CPU-intensive** — a major GC pause can spike CPU to the limit for hundreds of milliseconds
- If GC coincides with CFS throttling, the pause extends — the GC thread is paused mid-collection, stalling the app longer than GC alone
- `process_cpu_usage` (Micrometer) and `container_cpu_usage_seconds_total` (cAdvisor) measure the same thing from different vantage points — they should roughly agree

---

## References

- [Kubernetes Resource Management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
- [CFS Bandwidth Control](https://www.kernel.org/doc/Documentation/scheduler/sched-bwc.txt)

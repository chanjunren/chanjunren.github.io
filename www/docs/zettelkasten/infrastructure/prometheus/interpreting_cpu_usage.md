🗓️ 29052026 1500

# interpreting_cpu_usage

`rate(container_cpu_usage_seconds_total[5m])` returns a number like `0.5` or `2.3`. That number is **CPU cores** — specifically, seconds of CPU time consumed per second of wall time. 0.5 = half a core. 2.3 = two and a bit cores running simultaneously.

This note explains how to read that number against requests and limits, and when throttling is a problem worth fixing. For the raw metrics and queries, see [[cadvisor_container_metrics]].

## What the Number Means

- The metric is a [[data_types]] Counter that accumulates total CPU seconds consumed
- `rate()` on that counter (see [[range_function_calculations]]) produces seconds-per-second = fraction of cores
- A single-threaded app maxes out at **1.0** — one core fully saturated
- A JVM app with 4 busy threads can reach **4.0** if CPU is available
- The number can exceed the pod's CPU request but never exceed its limit (CFS enforces this)

## Usage vs Request vs Limit

| Concept | What it is | Enforced by |
|---------|-----------|-------------|
| **Request** | Guaranteed minimum CPU | K8s scheduler (placement) |
| **Limit** | Hard ceiling | Linux CFS (runtime) |
| **Usage** | Actual consumption | Measured by cAdvisor |

### Reading the Ratios

- **usage / request < 1.0** — underutilizing guaranteed allocation; request may be oversized
- **usage / request > 1.0** — borrowing spare capacity from the node; normal and expected when headroom exists
- **usage / limit approaching 1.0** — CFS throttling imminent or already happening

```ad-warning
usage > request is not a problem. It means the container is using available slack on the node. Only usage near the limit triggers throttling.
```

## When Throttling Matters

**CFS throttle %** = what fraction of scheduling periods were capped by the CPU limit.

- Throttled periods are 100ms windows where the container used its full quota and was paused for the remainder
- A container at its limit does not get more CPU even if the node has idle cores

### Deciding Whether to Act

| Throttle % | Latency impact? | Verdict |
|-----------|----------------|---------|
| < 5% | No | Normal burst behavior |
| 5-25% | No | Acceptable for batch workloads |
| 5-25% | Yes | Investigate — limit may be too low for this traffic level |
| > 25% sustained | Yes | Raise the limit or optimize the hot path |
| > 25% sustained | No | Batch workload — likely acceptable |

Throttle % alone is not enough. **Correlate with latency** (p95/p99 from your app metrics). Throttling without latency degradation is just the limit doing its job.

### Throttle % with no CPU usage spike

If throttle % is high but average CPU usage looks low, the workload is **bursty** — short spikes that saturate the limit within individual 100ms periods, then idle. The average smooths out the spikes. In this case:

- Check `irate()` for sub-minute spike visibility
- Consider raising the limit to absorb bursts, even if average usage is moderate

## JVM-Specific Considerations

- **GC is CPU-intensive.** A major GC pause can spike CPU usage to the limit for hundreds of milliseconds
- If GC coincides with CFS throttling, the pause extends — the GC thread is paused mid-collection, and the application stalls longer than the GC alone would cause
- `process_cpu_usage` (Micrometer) and `container_cpu_usage_seconds_total` (cAdvisor) measure the same thing from different vantage points — they should roughly agree

---

## References

- [Kubernetes Resource Management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
- [CFS Bandwidth Control](https://www.kernel.org/doc/Documentation/scheduler/sched-bwc.txt)

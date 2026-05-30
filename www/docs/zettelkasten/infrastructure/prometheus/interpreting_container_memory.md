🗓️ 29052026 1500

# interpreting_container_memory

cAdvisor exposes three memory metrics per container. They measure different things, and using the wrong one for alerting causes false alarms or missed OOM kills.

For the raw metrics and PromQL queries, see [[cadvisor_container_metrics]].

## Three Metrics, Three Different Things

```
container_memory_usage_bytes        = RSS + file cache + swap
container_memory_rss                = anonymous memory only (heap, stack, mmap'd anon)
container_memory_working_set_bytes  = usage_bytes - inactive file cache
```

- **usage_bytes** — everything the cgroup is charged for, including kernel page cache from the container's I/O
- **rss** — memory the application explicitly allocated (what `top` calls RES)
- **working_set_bytes** — usage minus the portion of file cache the kernel considers inactive and reclaimable

### How They Diverge in Practice

Consider a container doing heavy log file writes:
- `usage_bytes` is high — the kernel cached those writes in page cache
- `rss` is moderate — the app's heap hasn't grown
- `working_set_bytes` is in between — active cache counts, inactive doesn't

## Why the OOM Killer Uses Working Set

- When a container hits its memory limit, the kernel reclaims inactive file cache first
- If reclaiming frees enough memory, the container survives
- OOM kill triggers only when **working_set** (non-reclaimable portion) fills the limit
- `usage_bytes` at 95% of limit is fine if most of it is reclaimable cache
- `working_set_bytes` at 95% of limit is genuinely dangerous

```ad-warning
Alert on `container_memory_working_set_bytes`, not `container_memory_usage_bytes`. The OOM killer uses working set. Alerting on usage_bytes fires on healthy containers.
```

## When High Memory Is Fine

### JVM with -Xmx Near the Limit

- A JVM configured with `-Xmx` close to the container limit shows high RSS by design
- Stable RSS matching the configured heap size is expected
- Watch for RSS exceeding -Xmx — that signals a native memory leak (thread stacks, direct buffers, metaspace)

### Heavy File I/O

- Containers reading/writing large files inflate `usage_bytes` with page cache
- If `working_set_bytes` is stable while `usage_bytes` climbs, the kernel is caching I/O — it reclaims under pressure

## When High Memory Is Dangerous

- **working_set / limit > 85%** with a **growing trend** — confirm with `deriv(container_memory_working_set_bytes[1h])`
- **RSS growing linearly** over hours or days — classic memory leak
- **No headroom for traffic spikes** — baseline working_set at 80% leaves only 20% room before OOM

## OOM Prediction Beyond the Ratio

- `working_set / limit` gives point-in-time risk
- **`deriv(container_memory_working_set_bytes[1h])`** — positive deriv = leak or growing dataset
- **Sudden spike vs gradual growth** — a spike (deploy, cache warm-up) stabilizes; a steady climb over hours is a leak
- If RSS grows but working_set is flat, file cache is being displaced by real memory — fine short-term, but cache eviction hurts I/O performance

See [[range_function_calculations]] for how `deriv()` works. Memory metrics are [[data_types]] Gauges.

---

## References

- [Kubernetes OOM Kill Behavior](https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/)
- [Linux cgroup memory accounting](https://www.kernel.org/doc/Documentation/cgroup-v1/memory.txt)

🗓️ 29052026 1500

# interpreting_container_memory

cAdvisor exposes three memory metrics per container. They measure different things, and using the wrong one for alerting causes either false alarms or missed OOM kills. This note explains what each metric counts and how to reason about memory pressure.

For the raw metrics and PromQL queries, see [[cadvisor_container_metrics]].

## Three Metrics, Three Different Things

```
container_memory_usage_bytes  =  RSS + file cache + swap
container_memory_rss          =  anonymous memory only (heap, stack, mmap'd anon)
container_memory_working_set_bytes  =  usage_bytes - inactive file cache
```

- **usage_bytes** — everything the cgroup is charged for, including kernel page cache that the container's I/O created
- **rss** — memory the application explicitly allocated (what `top` calls RES)
- **working_set_bytes** — usage minus the portion of file cache the kernel considers inactive and reclaimable

### The Mental Model

Think of a container doing heavy log file writes:
- `usage_bytes` is high because the kernel cached those writes in page cache
- `rss` is moderate — the app's heap hasn't grown
- `working_set_bytes` is somewhere in between — active cache counts, inactive doesn't

## Why the OOM Killer Uses Working Set

When a container hits its memory limit, the kernel tries to reclaim inactive file cache first. If that frees enough memory, the container survives. The OOM killer only triggers when **working_set** (the non-reclaimable portion) fills the limit.

This means:
- `usage_bytes` at 95% of limit can be perfectly fine (if most of it is reclaimable cache)
- `working_set_bytes` at 95% of limit is genuinely dangerous

```ad-warning
Alert on `container_memory_working_set_bytes`, not `container_memory_usage_bytes`. The OOM killer uses working set. Alerting on usage_bytes will wake you up for containers that are healthy.
```

## When High Memory Is Fine

### JVM with -Xmx near the limit
- A JVM configured with `-Xmx` close to the container limit will show high RSS by design — the heap is meant to use that space
- Stable RSS that matches the configured heap size is expected, not alarming
- Watch for RSS exceeding -Xmx (native memory leak outside the heap: thread stacks, direct buffers, metaspace)

### Heavy file I/O
- Containers that read/write large files inflate `usage_bytes` with page cache
- If `working_set_bytes` is stable while `usage_bytes` climbs, the kernel is just caching I/O — it will reclaim under pressure

## When High Memory Is Dangerous

- **working_set / limit > 85%** with a **growing trend** — use `deriv(container_memory_working_set_bytes[1h])` to confirm the trend
- **RSS growing linearly** over hours or days — classic memory leak pattern
- **No headroom for traffic spikes** — if baseline working_set is 80% of limit, a traffic surge has only 20% room before OOM

## OOM Prediction Beyond the Ratio

The point-in-time ratio `working_set / limit` tells you current risk. Combine with trend to predict:

- **`deriv(container_memory_working_set_bytes[1h])`** — is working_set growing? Positive deriv = leak or growing dataset
- **Sudden spike vs gradual growth** — a spike (deploy, cache warm-up) stabilizes; a steady climb over hours is a leak
- If RSS is growing but working_set is flat, file cache is being displaced by real memory usage — still fine short-term, but cache eviction hurts I/O performance

---

## References

- [Kubernetes OOM Kill Behavior](https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/)
- [Linux cgroup memory accounting](https://www.kernel.org/doc/Documentation/cgroup-v1/memory.txt)

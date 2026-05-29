🗓️ 29052026 1500

# interpreting_host_memory

A Linux node showing 90% memory "used" is usually healthy. Linux aggressively turns free RAM into **page cache** (disk read/write cache), and this cached memory is reclaimable under pressure. The right metric for actual memory pressure is `MemAvailable`, not `MemFree`.

For the raw metrics and PromQL queries, see [[node_exporter_host_metrics]].

## Linux Memory Is Supposed to Be "Used"

Free RAM is wasted RAM. Linux fills it with page cache to speed up disk I/O:
- File reads are cached so repeat reads hit RAM instead of disk
- File writes go to cache first, then flush to disk asynchronously
- This cache is **not committed** — the kernel drops it instantly when an application needs the memory

This means `MemFree` (completely unallocated memory) is misleadingly low on any server that does I/O.

## MemAvailable vs MemFree

| Metric | What it measures | Why it matters |
|--------|-----------------|----------------|
| **MemFree** | RAM with zero use — no app, no cache, nothing | Always looks alarmingly low |
| **MemAvailable** | MemFree + reclaimable page cache + reclaimable slab | Accurate estimate of what apps can actually use |

### Concrete Example

A healthy 16GB node:

| Metric | Value | Naive % used |
|--------|-------|-------------|
| MemTotal | 16 GB | — |
| MemFree | 500 MB | 97% used |
| Cached + Buffers | 8 GB | (page cache) |
| MemAvailable | 8 GB | **50% used** |

MemFree says 97% used — that looks critical. MemAvailable says 50% — the node is fine. The 8GB of cache will be reclaimed the moment applications need it.

```ad-warning
Use `(1 - MemAvailable / MemTotal) * 100` for memory utilization. The MemFree-based formula overstates pressure by 20-40% on a typical server and triggers false alerts.
```

## When Memory Pressure Is Real

MemAvailable accounts for reclaimable memory, so when it drops low, the kernel is genuinely running out of options.

### Warning signs

- **MemAvailable < 10% of MemTotal** — kernel is running low on reclaimable reserves; new allocations may stall
- **Swap usage increasing** — the kernel is evicting anonymous pages (actual application memory, not cache) to disk
- **Active swap + high iowait** — memory pressure is causing disk thrashing; applications stall on every page fault
- **MemAvailable trending toward zero** — use `predict_linear(node_memory_MemAvailable_bytes[6h], 24*3600)` to forecast

### Swap as a signal

- Swap *existing* on the system is not a problem
- Swap *being actively used* (SwapFree decreasing over time) means the kernel ran out of page cache to reclaim and is now evicting real memory
- `rate(node_vmstat_pswpin[5m])` and `rate(node_vmstat_pswpout[5m])` (if available) show active swap I/O — a better signal than swap size alone

## Impact on Containers

Host memory pressure affects containers even when their individual limits are not reached:

- **Page cache reclamation** — the kernel reclaims cache from all cgroups; containers doing heavy file I/O see slower reads as their cached data is evicted
- **Host OOM killer** — if the node's total memory is exhausted, the kernel's OOM killer picks a process to kill; it can choose a container process even if that container's `working_set_bytes` is below its own limit
- **Eviction** — Kubernetes evicts pods when node memory pressure exceeds thresholds (configurable via kubelet `evictionHard`), starting with pods exceeding their requests

The takeaway: a container's memory limit protects the node from that container, but does not fully protect the container from the node.

---

## References

- [Linux MemAvailable](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=34e431b0ae398fc54ea69ff85ec700722c9da773)
- [Kubernetes Node Pressure Eviction](https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/)

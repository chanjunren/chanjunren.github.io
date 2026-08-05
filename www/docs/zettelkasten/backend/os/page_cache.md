🗓️ 13062026 2200

# page_cache

The kernel uses physical RAM to cache recently read and written file data. This is the **page cache**. It can avoid later storage I/O, but cache hits are not literally instant and cached memory still has a real reclaim cost.

Page cache is central to understanding both [[interpreting_host_memory]] (why MemFree is misleadingly low) and [[interpreting_container_memory]] (why `container_memory_usage_bytes` overstates real pressure).

## How Reads Work

1. Application calls `read()` (a [[system_calls]])
2. Kernel checks if the file's pages are already in the page cache
3. **Cache hit**: use the page already in RAM — no storage I/O for that page
4. **Cache miss**: read from disk into the page cache, then copy to the application

Subsequent reads of the same file may hit the cache while those pages remain resident. This is why a second read is often much faster than the first.

## How Writes Work

1. Application calls `write()`
2. Kernel writes to page cache pages and marks them **dirty**
3. A buffered `write()` can return before the data reaches durable storage
4. Kernel flushes dirty pages to disk asynchronously via writeback threads

This is why buffered writes can appear fast. Data only in dirty page-cache pages is not durable across power loss or a kernel crash. Applications use mechanisms such as `fsync()` when they require stronger persistence guarantees.

## Active vs Inactive Pages

The kernel tracks which cached pages were recently accessed using two lists:

- **Active list** — pages accessed recently; kept in cache
- **Inactive list** — pages not accessed recently; eviction candidates

When memory runs low, the kernel evicts pages from the inactive list first. Pages that get accessed again move back to the active list.

This distinction is the key to understanding `container_memory_working_set_bytes`: it equals `usage_bytes` minus **inactive** file cache. Active cache counts toward working set because the kernel considers it still needed. See [[interpreting_container_memory]].

## Reclamation Under Pressure

Under pressure, Linux balances several reclaim mechanisms. A useful simplified progression is:

1. **Inactive file-backed pages** — drop them; re-read from disk if needed later
2. **Active file-backed pages** — more costly but still reclaimable
3. **Anonymous pages to swap** — write heap/stack pages to disk (expensive, causes stalls)
4. **OOM kill** — last resort when nothing reclaimable remains (see [[linux_oom_killer]])

This is why `MemAvailable` estimates a reclaimable portion of cache rather than treating all cache as either fully free or fully unavailable. See [[proc_meminfo]].

## Container-Level Page Cache Accounting

The kernel charges file I/O page cache to the **cgroup** that performed the I/O. This is why `container_memory_usage_bytes` is high for containers doing heavy file I/O — the container is "charged" for its cached reads and writes, even though that memory is reclaimable.

A container writing large log files:
- `usage_bytes` climbs (page cache from log writes charged to the cgroup)
- `rss` stays stable (the application heap hasn't grown)
- `working_set_bytes` depends on whether the cached pages are still active

```ad-warning
Dropping page cache (`echo 3 > /proc/sys/vm/drop_caches`) temporarily frees RAM but forces all subsequent file reads to hit disk. Performance drops sharply. The cache rebuilds automatically, but the interim can cause latency spikes across all services on the node.
```

---

## References

- [Linux page cache documentation](https://www.kernel.org/doc/html/latest/admin-guide/mm/concepts.html)
- [Linux cgroup memory accounting](https://www.kernel.org/doc/Documentation/cgroup-v1/memory.txt)

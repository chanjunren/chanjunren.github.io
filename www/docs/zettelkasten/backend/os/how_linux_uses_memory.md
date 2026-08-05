🗓️ 06082026 0000

# how_linux_uses_memory

Linux treats RAM as shared workspace for applications and the kernel. It deliberately uses otherwise-idle RAM to make the system faster, so **used RAM** is not the same as **RAM that applications cannot reclaim**.

This distinction is the starting point for reading any Linux memory dashboard.

## Four useful buckets

Think about physical RAM in four broad buckets:

| Bucket | Example | Can Linux free it cheaply? |
|---|---|---|
| Completely unused | `MemFree` | Already free |
| Reclaimable cache | Clean file data, some kernel caches | Usually; recreate it later |
| Application memory | Heap and stack | Not cheaply; keep it or swap it |
| Required kernel memory | Core kernel data and reserves | No, or not safely right now |

The boundaries are more complicated inside the kernel, but this model answers the first operational question: **if a program needs more RAM, how much can Linux supply without serious disruption?**

## Why Linux fills spare RAM

RAM is much faster than storage. When a program reads a file, Linux keeps a copy of that file data in the [[page_cache]]. If the file is read again, Linux can serve it from RAM.

This creates a healthy pattern:

```text
application finishes using RAM
  → RAM becomes available
  → Linux uses some of it as cache
  → another application needs RAM
  → Linux discards reclaimable cache
  → RAM is given to the application
```

A dashboard that calls all cache “used” makes a healthy machine look full.

## Reclaimable does not mean unused

**Reclaimable** memory is doing useful work now, but Linux has a way to free it when more important work needs RAM.

- Clean file-cache pages can be discarded because the file remains on storage.
- Some kernel object caches can be rebuilt later.
- Dirty file pages must be written to storage before they can be discarded.
- Application heap and stack pages cannot simply be discarded because their only current copy may be in RAM.

Reclaiming memory also has a performance cost. A cache that is discarded must be rebuilt or reread later. “Available” means usable without swapping or killing a process; it does not mean free of consequences.

## The kernel needs breathing room

Linux keeps memory reserves so the kernel can still perform critical work while the system is under pressure. It also considers how much cache is practically reclaimable rather than assuming every cached byte can vanish immediately.

That is why available memory is an estimate. It cannot be calculated accurately from one obvious bucket.

Read [[linux_memory_pages]] next to understand what Linux is reclaiming, then [[proc_meminfo]] to see how Linux reports it.

## References

- [Linux memory management concepts](https://docs.kernel.org/admin-guide/mm/concepts.html)
- [Linux `/proc/meminfo` documentation](https://docs.kernel.org/filesystems/proc.html#meminfo)

🗓️ 13062026 2200

# virtual_memory

Each process gets its own **virtual address space** — a private view of memory that looks contiguous and starts at address 0. The OS and CPU hardware translate these virtual addresses to physical RAM locations transparently. Without virtual memory, every process would need to know where in physical RAM it lives, and one process could corrupt another's data.

This is the foundation for understanding all container memory metrics: RSS, VIRT, working set, and page cache all describe different aspects of the virtual-to-physical mapping.

## Three Key Mechanisms

### Virtual Address Space

- Each process sees its own address space (128 TB on x86-64 Linux)
- Most of it is unmapped — accessing unmapped addresses causes a segfault
- The process's code, heap, stack, and memory-mapped files all live at virtual addresses
- Two processes can use the same virtual address (e.g. `0x7fff0000`) — they map to different physical frames

### Page Tables

- A per-process data structure maintained by the kernel
- Maps virtual pages to physical frames: "virtual page 42 lives in physical frame 1837"
- The CPU's **MMU** (memory management unit) does this translation on every memory access, in hardware
- The kernel updates page tables; the MMU reads them

### Pages

- Memory is managed in fixed-size **pages** — 4 KB on x86
- Allocation, mapping, and eviction all happen at page granularity
- A process requesting 1 byte still gets a 4 KB page

## Demand Paging

Pages can exist in the page table but not yet be backed by physical RAM. The kernel defers allocation until the page is actually accessed:

1. Process allocates memory (e.g. `malloc(1GB)`) — kernel creates page table entries, no physical RAM used yet
2. Process writes to a page for the first time
3. CPU raises a **page fault** (not an error — a normal event)
4. Kernel allocates a physical frame, maps it in the page table
5. CPU retries the memory access — succeeds

This is why VIRT is much larger than RSS. VIRT counts all mapped virtual pages. RSS counts only pages backed by physical RAM.

## RSS vs VIRT

| Metric | Measures | Why it matters |
|--------|---------|---------------|
| **VIRT** | Total virtual address space mapped | What the process *could* use — includes unmapped reservations |
| **RSS** (Resident Set Size) | Pages actually resident in physical RAM | What the process *is* using right now |

A JVM with `-Xmx4g` and memory-mapped files may show VIRT = 8 GB but RSS = 2 GB. Only 2 GB of physical RAM is in use. Container memory limits apply to physical usage (RSS + cache), not virtual address space. See [[interpreting_container_memory]] for how this maps to `container_memory_rss` and `container_memory_usage_bytes`.

## Why the Kernel Can Reclaim Pages

Physical frames can be taken back from a process without destroying data:

- **File-backed pages** (code, memory-mapped files, [[page_cache]]) — can be dropped and re-read from disk later
- **Anonymous pages** (heap, stack) — must be written to swap first if swap is enabled; otherwise cannot be reclaimed without killing the process

This reclamation mechanism is why Linux aggressively fills free RAM with page cache — cached pages are reclaimable, so they cost nothing when applications need the memory. See [[interpreting_host_memory]] for why a Linux node showing 90% memory "used" is usually healthy.

```ad-warning
Container memory limits apply to physical memory (RSS + page cache charged to the cgroup), not virtual address space. A JVM can map 8 GB of virtual memory but only hit a 2 GB container limit when its physical usage reaches 2 GB.
```

---

## References

- [Linux virtual memory layout (x86-64)](https://www.kernel.org/doc/html/latest/x86/x86_64/mm.html)
- [Understanding the Linux Virtual Memory Manager](https://www.kernel.org/doc/gorman/html/understand/)

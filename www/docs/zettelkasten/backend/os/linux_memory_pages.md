🗓️ 06082026 0000

# linux_memory_pages

Linux manages virtual and physical memory in fixed-size blocks called **pages**. On many systems a normal page is 4 KiB, although the size depends on the architecture and Linux also supports larger pages.

Pages matter because “can this memory be reclaimed?” depends largely on what backs each page and whether another valid copy exists.

## Virtual pages map to physical RAM

Each process sees a private [[virtual_memory]] address space. The kernel and CPU map the virtual pages a process uses to physical pages in RAM.

```text
process virtual page
  → page table mapping
  → physical page in RAM
```

A virtual address range can exist without every page currently occupying RAM. This is why a process's virtual size can be much larger than its resident memory.

## Anonymous pages hold process state

**Anonymous memory** is not backed by an ordinary file. Common examples include a process heap and stack.

If Linux needs the RAM occupied by an anonymous page, it cannot recreate that page from a file. It must either:

- Keep the page in RAM
- Write it to swap and load it back later
- Terminate the process and discard all of its state

This makes anonymous memory more expensive to reclaim than clean file-backed memory.

## File-backed pages can be reconstructed

**File-backed memory** represents data that also exists in a file. It includes cached reads and many memory-mapped files.

- A **clean page** still matches the copy on storage. Linux can discard it and read the file again later.
- A **dirty page** contains newer data. Linux must write it back before the page becomes safely discardable.

The [[page_cache]] is mostly file-backed memory. This is why much of it can be reclaimed without losing application state.

## tmpfs and shared memory are a special case

`tmpfs` looks like a filesystem, but its file contents live in memory and may use swap. Shared-memory segments are commonly implemented using the same memory-filesystem machinery.

These pages can appear in cache-related `/proc/meminfo` accounting even though there is no persistent disk file from which Linux can reconstruct them. Treating all of `Cached` as freely discardable therefore overestimates available memory.

`ramfs` also stores file contents in memory, but unlike `tmpfs` it has no normal size limit and cannot use swap. An unbounded `ramfs` can exhaust RAM.

## Page state affects reclaim cost

| Page kind | Other copy exists? | Typical reclaim action |
|---|---:|---|
| Clean file-backed | Yes, in the file | Discard, reread later |
| Dirty file-backed | Not yet | Write back, then discard |
| Anonymous with swap | Swap can hold a copy | Swap out, reload later |
| Anonymous without usable swap | No | Keep it or eventually OOM |
| tmpfs/shared memory | No persistent file | Keep it or swap it if supported |

This table is a mental model, not the exact order of every kernel reclaim decision.

Read [[page_cache]] for the file-I/O path and [[proc_meminfo]] for the reported totals.

## References

- [Linux memory management concepts](https://docs.kernel.org/admin-guide/mm/concepts.html)
- [tmpfs documentation](https://docs.kernel.org/filesystems/tmpfs.html)
- [ramfs, rootfs, and initramfs](https://docs.kernel.org/filesystems/ramfs-rootfs-initramfs.html)

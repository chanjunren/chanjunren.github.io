🗓️ 06082026 0000

# proc_meminfo

`/proc/meminfo` is a text interface through which the Linux kernel reports system-wide memory accounting. Tools such as `free`, node exporter, and monitoring dashboards derive many of their memory values from these fields.

`/proc` is a **virtual filesystem**: reading a file such as `/proc/meminfo` asks the kernel for current information. It is not reading a normal file stored on disk.

## Start with these fields

```text
MemTotal:       4000000 kB
MemFree:         200000 kB
MemAvailable:    700000 kB
Buffers:          50000 kB
Cached:          600000 kB
SReclaimable:    120000 kB
Shmem:           180000 kB
SwapTotal:      1000000 kB
SwapFree:        250000 kB
```

The numbers are illustrative rather than a snapshot of go2c.

| Field | Big idea |
|---|---|
| `MemTotal` | Usable physical RAM known to Linux |
| `MemFree` | RAM currently doing nothing |
| `MemAvailable` | Estimate of RAM available for starting work without swapping |
| `Buffers` | Cache for raw block-device metadata and blocks; usually small on modern systems |
| `Cached` | File cache plus tmpfs/shared-memory-related accounting, excluding swap cache |
| `SReclaimable` | Slab objects the kernel expects it can reclaim |
| `Shmem` | tmpfs and shared-memory usage included in cache-related totals |
| `SwapTotal` / `SwapFree` | Configured swap space and the unused portion |

## Why `MemFree + Cached` is wrong

An old approximation treated available memory as:

```text
MemFree + Cached
```

It has two problems:

1. `Cached` includes `Shmem`, such as tmpfs and shared-memory pages. Those pages contain live data and are not equivalent to a clean copy of a normal disk file.
2. It omits reclaimable slab memory such as cached directory entries and inode objects.

In the illustrative values, blindly adding `MemFree + Cached` gives 800 MB. That does not mean Linux can cheaply hand 800 MB to a new process: part of `Cached` is shared memory, while reclaimable slab was not counted at all.

## MemAvailable is a kernel estimate

`MemAvailable` estimates how much memory can be given to new work without causing swapping. Conceptually, it considers:

- Currently free pages
- Reclaimable page cache
- Reclaimable slab
- Memory Linux must keep as safety reserves

It does **not** equal one stable arithmetic formula over the displayed fields. The kernel estimate accounts for reclaim limits and watermarks, and its implementation can evolve.

Use `MemAvailable / MemTotal` as the first dashboard signal for host headroom. Then look for active swap I/O and memory-pressure evidence before diagnosing a cause.

## How node exporter maps the fields

The node-exporter meminfo collector exposes these fields as Prometheus gauges:

| `/proc/meminfo` | Prometheus metric |
|---|---|
| `MemTotal` | `node_memory_MemTotal_bytes` |
| `MemFree` | `node_memory_MemFree_bytes` |
| `MemAvailable` | `node_memory_MemAvailable_bytes` |
| `Cached` | `node_memory_Cached_bytes` |
| `SReclaimable` | `node_memory_SReclaimable_bytes` |
| `Shmem` | `node_memory_Shmem_bytes` |
| `SwapTotal` | `node_memory_SwapTotal_bytes` |
| `SwapFree` | `node_memory_SwapFree_bytes` |

The kernel reports most `/proc/meminfo` sizes in KiB. Node exporter converts size fields to bytes, which is why the metric names end in `_bytes`.

Read [[interpreting_host_memory]] next, then trace the calculation through [[host_memory_dashboard_walkthrough]].

## References

- [Linux `/proc/meminfo` documentation](https://docs.kernel.org/filesystems/proc.html#meminfo)
- [Linux commit introducing `MemAvailable`](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=34e431b0ae398fc54ea69ff85ec700722c9da773)
- [node exporter meminfo collector](https://github.com/prometheus/node_exporter/blob/master/collector/meminfo_linux.go)

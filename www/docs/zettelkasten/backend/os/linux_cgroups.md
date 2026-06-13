🗓️ 13062026 2200

# linux_cgroups

**Cgroups** (control groups) are a Linux kernel feature that limits and accounts for resource usage — CPU, memory, I/O, PIDs — per group of processes. Every container is a cgroup. Without cgroups, Docker's `--memory` and `--cpus` flags would do nothing.

Cgroups handle **resource control** (how much can a group use). They do not handle **isolation** (what can a group see) — that is namespaces.

## How They Work

A cgroup is a directory in a virtual filesystem:

```
/sys/fs/cgroup/
  └── kubepods/
      └── pod-abc123/
          ├── container-xyz/
          │   ├── memory.limit_in_bytes    # hard memory limit
          │   ├── memory.usage_in_bytes    # current memory usage
          │   ├── cpu.cfs_quota_us         # CPU quota per period
          │   ├── cpu.cfs_period_us        # period length (default 100ms)
          │   ├── pids.max                 # max process count
          │   └── cgroup.procs            # list of PIDs in this cgroup
```

- Assign a process to a cgroup by writing its PID to `cgroup.procs`
- The kernel enforces limits on all processes within the cgroup
- Docker and Kubernetes do this automatically when creating containers

## Hierarchy

Cgroups form a tree. A child cgroup cannot exceed its parent's limits:

```
node cgroup (total node resources)
  └── kubepods (allocatable resources)
      ├── burstable/
      │   ├── pod-A/ (request: 1 CPU, 2 GB)
      │   │   ├── container-1/
      │   │   └── container-2/
      │   └── pod-B/
      └── guaranteed/
          └── pod-C/ (request = limit)
```

This hierarchy is how kubelet enforces node-level resource budgets. The total of all pod limits cannot exceed the node's allocatable resources.

## Memory Accounting

The cgroup tracks physical memory usage for all its processes:

- **RSS** — heap, stack, anonymous mmap'd memory
- **Page cache** — file I/O cached in RAM, charged to the cgroup that read/wrote the file (see [[page_cache]])
- **Swap** — anonymous pages evicted to disk

`container_memory_usage_bytes` reads this total. The kernel reclaims page cache within the cgroup first before invoking the [[linux_oom_killer]]. This is why [[interpreting_container_memory]] distinguishes `usage_bytes` (includes reclaimable cache) from `working_set_bytes` (excludes inactive cache).

## CPU Accounting

CPU limits use a **quota/period** mechanism:

- `cpu.cfs_period_us` = period length, default `100000` (100ms)
- `cpu.cfs_quota_us` = how many microseconds of CPU time allowed per period

| Container CPU limit | Quota | Period | Meaning |
|-------------------|-------|--------|---------|
| 0.5 CPU | 50,000 us | 100,000 us | 50ms of CPU per 100ms wall time |
| 1 CPU | 100,000 us | 100,000 us | 100ms per 100ms — one full core |
| 2 CPU | 200,000 us | 100,000 us | 200ms per 100ms — two cores |

When a cgroup exhausts its quota within a period, the CFS scheduler **throttles** all threads in the cgroup until the next period. See [[cfs_bandwidth_control]] for the mechanics and [[interpreting_cpu_usage]] for how to read throttle metrics.

## Cgroups v1 vs v2

| | v1 | v2 |
|---|---|---|
| **Hierarchy** | Separate tree per resource (one for memory, another for CPU) | Single unified tree |
| **Control files** | `memory.limit_in_bytes`, `cpu.cfs_quota_us` | `memory.max`, `cpu.max` |
| **Adoption** | Legacy, still common | Default on newer kernels, Kubernetes migrating |

The metrics exposed by [[cadvisor_container_metrics]] are the same regardless of version — cAdvisor abstracts the difference.

```ad-warning
Cgroups limit resources but do NOT provide isolation. A cgroup-limited container can still see host processes, network interfaces, and filesystems unless namespaces restrict the view. Cgroups answer "how much can it use?" Namespaces answer "what can it see?"
```

---

## References

- [Linux cgroup v2 documentation](https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html)
- [Docker resource constraints](https://docs.docker.com/config/containers/resource_constraints/)
- [Kubernetes resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)

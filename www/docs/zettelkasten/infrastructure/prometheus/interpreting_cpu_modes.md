🗓️ 29052026 1500

# interpreting_cpu_modes

`node_cpu_seconds_total` has a `mode` label that breaks CPU time into categories: user, system, iowait, steal, irq, softirq, nice, idle. Knowing which mode is elevated tells you **why** CPU is busy — and whether adding cores, fixing code, or changing infrastructure is the right response.

For the raw metric and PromQL queries, see [[node_exporter_host_metrics]]. Container-level CPU (see [[cadvisor_container_metrics]]) does not expose mode breakdown — you need node exporter for this.

## What Each Mode Means

| Mode | What the CPU is doing | Elevated means |
|------|----------------------|----------------|
| **user** | Running application code | App is compute-bound |
| **system** | Running kernel code on behalf of apps (syscalls) | Heavy I/O ops, context switching, network stack work |
| **iowait** | Idle, waiting for disk I/O to complete | Disk is the bottleneck, not CPU |
| **steal** | Hypervisor gave this CPU slice to another VM | Your VM is being preempted by neighbors |
| **irq** | Handling hardware interrupts | Rare to be high; hardware issue or misconfigured NIC |
| **softirq** | Handling software interrupts (network packets, timers) | High packet rate (load balancers, many small requests) |
| **nice** | Running low-priority user processes | Background jobs consuming CPU |
| **idle** | Doing nothing | CPU has capacity |

## Reading a Mode Breakdown

### High user, low system
Normal application workload. The CPU is doing useful compute.
- Response: scale horizontally, optimize hot code paths, or accept the load

### High system
Kernel is working hard on behalf of your applications.
- Common causes: excessive small I/O operations, heavy logging to disk, many short-lived network connections, frequent context switches between threads
- Response: look at syscall patterns, not just application code; reduce I/O chattiness

### High iowait
CPU is idle but blocked waiting for disk. **Adding more CPU cores will not help.**
- Common causes: slow disk (HDD vs SSD), sequential I/O on a busy volume, database queries scanning large tables on disk
- Response: check disk throughput and IOPS via `node_disk_*` metrics; upgrade storage or optimize queries
- iowait can mislead: it only counts CPUs that are idle *and* waiting; if other work fills those CPUs, iowait drops even though disk is still slow

### High steal
The hypervisor is taking CPU time away from your VM to serve other tenants.
- No application-level optimization will help
- Response: resize the instance, move to dedicated hosts, or talk to the cloud provider
- Steal > 5% sustained is worth investigating; > 10% is a performance-impacting problem

### High softirq
Software interrupt processing, usually network packet handling.
- Common on: load balancers, reverse proxies, services handling thousands of small requests per second
- Response: check if packet rate is expected; consider kernel tuning (RPS/RFS) or scaling out

## What "Normal" Looks Like

| Workload type | user | system | iowait | steal |
|--------------|------|--------|--------|-------|
| Typical web server | 40-60% | 5-15% | < 5% | 0% |
| Database server | 20-40% | 10-20% | 10-30% (SSDs) | 0% |
| Batch/ML training | 70-95% | 2-5% | < 2% | 0% |
| Load balancer | 10-30% | 10-20% | < 1% | 0% |

These are rough ranges. The key is knowing what pattern to *expect* for your workload so deviations stand out.

```ad-warning
High iowait with low overall CPU utilization is deceptive. The node looks "idle" but applications are stalled on disk. Check disk metrics before concluding the node has spare capacity.
```

## Why This Matters for Container Debugging

- `container_cpu_usage_seconds_total` shows **total** CPU consumed but not *what kind* of work
- A container using 2 cores could be compute-bound (user), syscall-heavy (system), or stuck on I/O (iowait at the node level)
- When a container's CPU looks high or latency spikes, check node CPU modes to determine the cause
- If the node shows high steal, all containers on that node are affected regardless of their individual metrics

---

## References

- [Linux CPU accounting](https://man7.org/linux/man-pages/man5/proc.5.html) (`/proc/stat` documentation)
- [Understanding CPU steal time](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-credits-baseline-concepts.html)

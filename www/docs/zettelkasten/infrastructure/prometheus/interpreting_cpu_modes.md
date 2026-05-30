🗓️ 29052026 1500

# interpreting_cpu_modes

`node_cpu_seconds_total` has a `mode` label that breaks CPU time into categories: user, system, iowait, steal, irq, softirq, nice, idle. The elevated mode tells you **why** CPU is busy — and whether adding cores, fixing code, or changing infrastructure is the right response.

Container-level CPU (see [[cadvisor_container_metrics]]) does not expose mode breakdown. You need node exporter for this. For the raw metric and queries, see [[node_exporter_host_metrics]].

## What Each Mode Means

| Mode | CPU is doing | Elevated means |
|------|-------------|----------------|
| **user** | Running application code | App is compute-bound |
| **system** | Running kernel code (syscalls) | Heavy I/O ops, context switching, network stack work |
| **iowait** | Idle, waiting for disk I/O | Disk is the bottleneck, not CPU |
| **steal** | Hypervisor gave this slice to another VM | VM is preempted by neighbors |
| **irq** | Handling hardware interrupts | Rare; hardware issue or misconfigured NIC |
| **softirq** | Handling software interrupts (packets, timers) | High network packet rate |
| **nice** | Running low-priority user processes | Background jobs consuming CPU |
| **idle** | Doing nothing | CPU has capacity |

## Diagnosing by Mode Pattern

### High User, Low System

- Normal application workload — CPU is doing useful compute
- Scale horizontally, optimize hot code paths, or accept the load

### High System

- Kernel is working hard on behalf of applications
- Common causes: excessive small I/O operations, heavy logging to disk, many short-lived connections, frequent context switches
- Look at syscall patterns, not just application code

### High Iowait

- CPU is idle but blocked waiting for disk. **Adding more CPU cores will not help.**
- Common causes: slow disk (HDD vs SSD), sequential I/O on a busy volume, database queries scanning large tables
- Check disk throughput and IOPS via `node_disk_*` metrics
- Caveat: iowait only counts CPUs that are idle *and* waiting. If other work fills those CPUs, iowait drops even though disk is still slow

### High Steal

- The hypervisor is taking CPU time for other tenants. No application-level fix.
- Resize the instance, move to dedicated hosts, or talk to the cloud provider
- &gt; 5% sustained = worth investigating. > 10% = performance-impacting

### High Softirq

- Software interrupt processing, usually network packet handling
- Common on load balancers, reverse proxies, services handling thousands of small requests/sec
- Consider kernel tuning (RPS/RFS) or scaling out

## Typical Baselines by Workload

| Workload | user | system | iowait | steal |
|----------|------|--------|--------|-------|
| Web server | 40–60% | 5–15% | < 5% | 0% |
| Database | 20–40% | 10–20% | 10–30% (SSDs) | 0% |
| Batch / ML training | 70–95% | 2–5% | < 2% | 0% |
| Load balancer | 10–30% | 10–20% | < 1% | 0% |

```ad-warning
High iowait with low overall CPU utilization is deceptive. The node looks "idle" but applications are stalled on disk. Check disk metrics before concluding the node has spare capacity.
```

## Why This Matters for Containers

- `container_cpu_usage_seconds_total` shows **total** CPU consumed but not what kind of work
- A container using 2 cores could be compute-bound (user), syscall-heavy (system), or stuck on I/O (iowait at the node level)
- When container CPU looks high or latency spikes, check node CPU modes for the cause
- If the node shows high steal, all containers on that node are affected regardless of their individual metrics

---

## References

- [Linux CPU accounting — /proc/stat](https://man7.org/linux/man-pages/man5/proc.5.html)
- [Understanding CPU steal time](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-credits-baseline-concepts.html)

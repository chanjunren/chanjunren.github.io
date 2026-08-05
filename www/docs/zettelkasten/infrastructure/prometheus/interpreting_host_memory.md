🗓️ 06082026 0000

# interpreting_host_memory

Host-memory interpretation begins with one question: **how much more work can Linux accept without swapping heavily or killing a process?** `MemAvailable` is the best first estimate. “Percent used” and `MemFree` do not answer that question reliably.

Read [[how_linux_uses_memory]], [[linux_memory_pages]], and [[proc_meminfo]] first if page cache, reclaimable memory, slab, or `/proc` are unfamiliar.

## Begin with availability, not usage

Linux uses spare RAM for the [[page_cache]] and reclaimable kernel objects. That memory appears used but can be reclaimed for applications.

Use:

```promql
node_memory_MemAvailable_bytes
/ node_memory_MemTotal_bytes
* 100
```

This produces the percentage still available. For “memory utilization,” invert it:

```promql
(1 - node_memory_MemAvailable_bytes
/ node_memory_MemTotal_bytes)
* 100
```

Both queries describe the same state from opposite directions. A panel must say which direction it displays.

## Interpret low availability as a symptom

Low `MemAvailable` means Linux has little immediately free or practically reclaimable memory. It establishes **host pressure**, but it does not identify the cause.

Possible causes include:

- Application heaps or other anonymous memory grew
- Several ordinary processes are collectively too large for the host
- tmpfs or shared-memory usage grew
- Kernel memory grew
- A workload created a burst of dirty file data that cannot yet be discarded
- The host is simply undersized for the workloads it must run

A memory-leak diagnosis needs evidence that a particular consumer grows continually and does not return to a stable baseline.

## Follow a diagnostic ladder

### 1. Confirm duration and direction

Check whether availability dipped briefly, remains low, or declines steadily. A one-minute dip and a week-long downward slope describe different risks.

### 2. Check active swapping

Configured or previously used swap is not automatically a current problem. Look for pages moving now:

```promql
rate(node_vmstat_pswpin[5m])
rate(node_vmstat_pswpout[5m])
```

Swap-out activity means Linux is moving anonymous pages from RAM to storage. Swap-in activity means workloads need those pages again. Sustained activity can add severe latency.

### 3. Check pressure and I/O symptoms

If available, Linux Pressure Stall Information reports time when tasks were delayed waiting for memory. Also inspect disk latency and CPU `iowait`: active swapping turns a memory shortage into storage work.

### 4. Find the consumers

Compare process or container working sets and RSS. Then ask whether the largest consumer is expected, merely large, or growing abnormally.

### 5. Check OOM evidence

Inspect `container_oom_events_total`, container restart reasons, kernel logs, and [[linux_oom_killer]]. An OOM event proves that an allocation boundary was exhausted; it does not by itself prove a leak.

## Host and container pressure are different

A container can reach its cgroup limit while the host has plenty of available RAM. Conversely, the host can run out because many containers and host processes collectively consume memory even though each container is below its own limit.

| Situation | Host `MemAvailable` | Container working set / limit |
|---|---:|---:|
| Container limit pressure | May be healthy | Near 100% |
| Host capacity pressure | Low | Each may look acceptable |
| Both boundaries pressured | Low | One or more near limit |
| Cache-heavy but reclaimable | Often healthy | Raw usage may look high |

Read [[interpreting_container_memory]] to understand the container boundary.

## Thresholds need context

A threshold such as 15% available memory can be a useful warning, but it is not a universal physical law. Choose the threshold and duration using:

- Normal workload variation
- Host size; 10% of 4 GB and 10% of 256 GB are very different reserves
- Swap configuration and observed swap activity
- Recovery time and the cost of an OOM event
- Whether PSI or other pressure signals are available

Use a threshold to request investigation. Do not make the threshold itself the diagnosis.

## References

- [Linux `/proc/meminfo` documentation](https://docs.kernel.org/filesystems/proc.html#meminfo)
- [Linux PSI documentation](https://docs.kernel.org/accounting/psi.html)
- [Prometheus node exporter](https://github.com/prometheus/node_exporter)

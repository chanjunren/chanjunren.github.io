🗓️ 13062026 2200

# cfs_bandwidth_control

The **Completely Fair Scheduler** (CFS) is Linux's default CPU scheduler. **CFS Bandwidth Control** is the mechanism that enforces CPU limits on [[linux_cgroups]]. When a container hits its CPU limit, CFS throttling is what pauses it — even if the node has idle cores.

This explains the throttle metrics in [[interpreting_cpu_usage]] and the `container_cpu_cfs_throttled_periods_total` counter in [[cadvisor_container_metrics]].

## CFS Basics

CFS gives each runnable thread a fair share of CPU time based on its weight (priority). It tracks **virtual runtime** — how much CPU each thread has received — and always schedules the thread with the lowest virtual runtime next. No thread starves.

Bandwidth control layers on top of this: even if CFS would give a thread more CPU time, the cgroup's quota limits how much it can actually get.

## Quota and Period

Each cgroup gets two parameters (set via cgroup control files — see [[linux_cgroups]]):

- **Period** — time window, default 100ms (`cpu.cfs_period_us = 100000`)
- **Quota** — how many microseconds of CPU time the cgroup can use within one period

When the cgroup's threads collectively exhaust the quota, **all threads are paused** until the next period starts. This is throttling.

### Example

Container with CPU limit = 2 cores:
- Quota = 200,000 us (200ms of CPU time per period)
- Period = 100,000 us (100ms wall time)
- 4 threads can each run for 50ms in parallel (total: 200ms CPU time) before being throttled for the remaining 50ms of the period

## Why Throttling Happens With Idle CPUs

CFS bandwidth control is per-cgroup, not per-node. A container limited to 1 CPU core gets throttled after using 100ms of CPU time in a 100ms period, **even if the node has 15 idle cores**. The limit is a hard ceiling, not a fair-share mechanism.

This surprises people: the node dashboard shows 20% CPU utilization, but individual containers are being throttled. The node has capacity; the container's cgroup does not.

## Bursty Workloads

A single-threaded request handler limited to 0.5 CPU (50ms quota per 100ms period):

- **One request per period** needing 40ms of CPU — fits within quota, no throttling
- **Two requests in the same period** needing 40ms each — first completes, second gets 10ms before quota exhausts, then stalls for the remaining period
- **Average CPU** looks low (the idle periods between bursts pull it down)
- **p99 latency** spikes because the second request waited for a new period

This is the "High Throttle % but Low Average CPU" pattern described in [[interpreting_cpu_usage]].

## JVM Impact

### GC and Throttling Compound

- A major GC pause is CPU-intensive — it can consume the entire quota within one period
- If the GC thread is throttled mid-collection, the GC pause extends
- Application threads are paused waiting for GC **and** waiting for the CFS period to reset
- Result: a 200ms GC pause can become 400ms+ under tight CPU limits

### Thread Count vs CPU Limit

A JVM with 200 threads but a 2-CPU limit: if many threads become runnable simultaneously (e.g. after a GC pause releases them all), they collectively exhaust the quota in milliseconds. The remaining period is dead time — all 200 threads are paused.

```ad-example
Container with limit 1 CPU running 4 threads that each need 30ms of CPU in a burst. Total demand = 120ms. Quota = 100ms. After 100ms of aggregate CPU time (which takes ~25ms of wall time with 4 parallel threads), all 4 threads are throttled for the remaining ~75ms. Wall-clock latency: 100ms instead of 30ms.
```

---

## References

- [CFS Bandwidth Control (kernel doc)](https://www.kernel.org/doc/Documentation/scheduler/sched-bwc.txt)
- [CFS Scheduler design](https://www.kernel.org/doc/Documentation/scheduler/sched-design-CFS.txt)
- [Kubernetes CPU throttling deep dive](https://engineering.indeedblog.com/blog/2019/12/cpu-throttling-regression-fix/)

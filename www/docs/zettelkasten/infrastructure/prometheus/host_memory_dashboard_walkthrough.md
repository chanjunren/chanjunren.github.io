🗓️ 06082026 0000

# host_memory_dashboard_walkthrough

A Grafana host-memory panel is the end of a measurement pipeline. Read it backwards—from displayed percentage to query, metric, `/proc/meminfo`, and finally the Linux memory model.

This walkthrough uses the go2c memory investigation from August 2026 as a worked example.

## The operational question

The useful question is not “how much RAM has any use?” It is:

> How much memory could Linux give new work without swapping, and has that headroom stayed dangerously low?

That wording explains why the panel uses `MemAvailable` rather than `MemFree` or a naive sum involving `Cached`. See [[proc_meminfo]].

## The raw measurements

Node exporter reads host data exposed by Linux and publishes gauges:

```text
node_memory_MemTotal_bytes
node_memory_MemAvailable_bytes
```

- `node_memory_MemTotal_bytes` is the host's usable physical-memory total.
- `node_memory_MemAvailable_bytes` is Linux's estimate of memory available without swapping.
- With no varying labels other than the target identity, each host contributes one series for each metric.

These are **gauges** because their current values can move up or down. See [[data_types]].

## The PromQL calculation

The available fraction is:

```promql
node_memory_MemAvailable_bytes
/ node_memory_MemTotal_bytes
```

If available memory is 684 MiB on a 3.82 GiB host:

```text
684 MiB / 3.82 GiB ≈ 0.175
```

Grafana can display `0.175` as 17.5% when configured with a percent unit for values from zero to one. Multiplying the query by 100 requires the percent unit intended for values from zero to 100. A unit mismatch can make a correct query look wrong.

## The alert calculation

The go2c investigation used the equivalent condition:

```promql
node_memory_MemAvailable_bytes
/ node_memory_MemTotal_bytes
< 0.15
```

The 15% threshold asks whether host headroom is low. The alert duration asks whether it stayed low long enough to matter.

At the time of the investigation:

- Total host RAM was about 3.82 GiB.
- Available memory was about 684 MiB, or 17.5%.
- The 30-day minimum was about 11.4%.
- The host spent roughly 356 minutes below 15% during that window.
- Swap had been close to exhausted at one point.

This supported a host-pressure diagnosis. It did not yet identify which workload caused it.

## The next panels supplied the cause evidence

Container working-set panels showed multiple memory-heavy services sharing the 4 GB host. The largest observed consumers included Metabase instances, MySQL, and Alloy.

That evidence changed the conclusion from:

```text
host has low memory headroom
```

to:

```text
several expected workloads collectively exceed the comfortable capacity of this host
```

The remediation followed from the second statement: stop unused environments, apply intended container limits, or enlarge the host. Raising container limits on the same host would not create more physical RAM.

## What this panel cannot prove

The availability panel alone cannot tell you:

- Which process owns the memory
- Whether a process leaks
- Whether a container is near its own cgroup limit
- Whether swap is actively moving pages now
- Whether low memory is causing application latency
- Whether the alert threshold is appropriate for this host

Use [[interpreting_host_memory]] as the diagnostic ladder and [[interpreting_container_memory]] for the container boundary.

## A reusable panel-reading template

| Question | Answer for this panel |
|---|---|
| What question does it answer? | How much host memory headroom remains? |
| Where does the value originate? | Linux `/proc/meminfo` |
| Which component exposes it? | node exporter |
| What are the metric type and unit? | Gauges, bytes |
| What does PromQL do? | Divides available bytes by total bytes |
| What does Grafana do? | Plots or reduces the ratio and formats it as a percentage |
| What is a safe conclusion? | Low sustained values indicate host pressure |
| What must be checked next? | Swap activity, PSI, consumers, cgroup limits, OOM evidence |

Apply this template to every unfamiliar panel before reading a long metric catalog.

## References

- [Grafana Prometheus query editor](https://grafana.com/docs/grafana/latest/datasources/prometheus/query-editor/)
- [Linux `/proc/meminfo` documentation](https://docs.kernel.org/filesystems/proc.html#meminfo)
- [Prometheus node exporter](https://github.com/prometheus/node_exporter)

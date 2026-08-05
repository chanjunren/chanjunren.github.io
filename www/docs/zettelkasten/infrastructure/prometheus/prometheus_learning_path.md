🗓️ 06082026 0000

# prometheus_learning_path

Start here if a Grafana dashboard feels like a wall of unfamiliar numbers. Do not begin by memorizing metrics. Learn one path from the operating system to a panel, then reuse that method for CPU, storage, network, and applications.

The path is:

```text
real system
  → operating-system measurement
  → exporter metric
  → Prometheus samples
  → PromQL calculation
  → Grafana panel
  → operational decision
```

## First path: understand host memory

Read these in order:

1. [[how_linux_uses_memory]] — why “used memory” is not the same as “unavailable memory”
2. [[linux_memory_pages]] — anonymous memory, file-backed memory, clean and dirty pages
3. [[page_cache]] — why Linux spends spare RAM on faster file access
4. [[proc_meminfo]] — where Linux reports `MemFree`, `Cached`, slab, swap, and `MemAvailable`
5. [[interpreting_host_memory]] — how to recognize real host pressure
6. [[host_memory_dashboard_walkthrough]] — how the Linux values become a Grafana panel and alert
7. [[interpreting_container_memory]] — why a container can be under pressure even when the host is not, and vice versa

After this path, you should be able to explain:

- Why low `MemFree` is normal
- Why `MemFree + Cached` is not a reliable available-memory formula
- Why `MemAvailable` is an estimate rather than a simple sum
- Why historical swap usage is different from active swapping
- Why one memory panel cannot prove that an application leaks memory
- Why host and container memory alerts can disagree

## Then learn how Prometheus represents the value

Read:

1. [[overview]] — the collection and query pipeline
2. [[time_series_basics]] — samples, series, labels, and scrape intervals
3. [[data_types]] — counters, gauges, histograms, and summaries
4. [[range_function_calculations]] — rates and calculations over a time window
5. [[node_exporter_host_metrics]] — lookup page for host metrics

Use these notes to explain a panel you already understand at the Linux level. Prometheus should answer “how was the evidence collected and transformed?”, not replace the system model.

## Read every dashboard panel with seven questions

1. **Question** — What operational question is the panel supposed to answer?
2. **Source** — Which component measured the value?
3. **Metric** — What does the raw metric mean, including its unit and type?
4. **Labels** — What does each returned line represent?
5. **PromQL** — What did the query aggregate, divide, or average?
6. **Display** — How do the time range, unit, and threshold change the presentation?
7. **Conclusion** — What can this panel prove, and what must be checked elsewhere?

If you cannot answer the first question, the panel may be decorative rather than diagnostic.

## Continue by resource

### CPU

Read [[cpu_privilege_modes]], [[interpreting_cpu_modes]], [[cfs_bandwidth_control]], and [[interpreting_cpu_usage]]. The important distinction is demand versus delivered CPU time versus time lost to throttling or another bottleneck.

### Storage

Begin with [[inodes]] and the filesystem section of [[node_exporter_host_metrics]]. A future storage path should separate filesystem capacity from block-device performance.

### Containers

Read [[linux_cgroups]], [[cadvisor_container_metrics]], [[interpreting_container_memory]], and [[linux_oom_killer]]. A container is a cgroup accounting boundary, not a separate kernel.

### Applications

Read [[prometheus_spring_boot_pipeline]] and [[visualization_queries]] after the foundation notes. Application panels are easier once counters, gauges, labels, and rates are familiar.

## Use real dashboards as exercises

For each section, choose one go2c panel and write down answers to the seven questions. Prefer panels tied to an alert or a real incident. Ignore unused exported metrics until a dashboard, alert, or investigation gives you a reason to learn them.

## References

- [Prometheus overview](https://prometheus.io/docs/introduction/overview/)
- [Grafana Prometheus query editor](https://grafana.com/docs/grafana/latest/datasources/prometheus/query-editor/)

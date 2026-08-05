# Prometheus and Linux notes improvement plan

## Outcome

Turn the existing notes into a short, dependency-ordered course for interpreting host and container dashboards. The finished collection should help a reader move from “this panel is red” to:

1. what Linux or application mechanism the panel represents;
2. how an exporter measured it;
3. how PromQL transformed the samples;
4. what the value does and does not imply;
5. what to inspect or change next.

The goal is broad literacy, not exhaustive Linux internals. Each note should teach one durable mental model and define the terms needed to use it.

## Actual starting point

Assume the reader has completed only `interpreting_host_memory` and does not yet understand kernel memory vocabulary. Do not begin with Prometheus architecture or a catalog of metrics.

The first learning slice should answer one concrete question: **How does Linux decide how much memory is genuinely available?**

Teach it in this order:

1. **RAM is shared workspace.** Programs and the kernel both use physical memory.
2. **A page is a fixed-size unit of memory management.** Linux accounts for memory in pages rather than reasoning about arbitrary bytes.
3. **Anonymous memory belongs to a process.** Heaps and stacks cannot simply be discarded; Linux must keep them in RAM or write them to swap.
4. **File-backed memory can often be reconstructed.** Cached file contents can be discarded and read from the file again later.
5. **The page cache uses spare RAM to avoid slow disk reads.** Cache is usage, but much of it is reclaimable usage.
6. **tmpfs, shared memory, and ramfs complicate `Cached`.** They may appear in cache-related accounting even though Linux cannot reclaim them like an ordinary clean file page.
7. **The slab caches kernel objects.** Some slab memory is reclaimable and some is not.
8. **`MemFree + Cached` therefore mixes unlike things and misses other reclaimable memory.** It is not a sound estimate of what applications can still allocate.
9. **`MemAvailable` is the kernel's estimate.** It considers free pages, reclaimable file cache, reclaimable slab, and the reserves Linux must retain.
10. **Node exporter exposes these `/proc/meminfo` fields.** Only after the Linux model is clear should the reader see `node_memory_MemAvailable_bytes` and its Grafana query.

Every later topic should use the same progressive structure: familiar problem → minimum Linux model → raw OS evidence → exporter mapping → PromQL → panel → decision.

### Vocabulary required before the first memory dashboard

Define these terms in plain language before using them as explanations:

- kernel and user process
- physical RAM and virtual memory
- page
- anonymous versus file-backed memory
- page cache, clean page, and dirty page
- reclaimable
- tmpfs, ramfs, and shared memory
- slab and kernel object
- swap
- memory reserve and watermarks
- `/proc` and `/proc/meminfo`

The reader needs the big idea for each term, not implementation-level kernel detail.

## What exists now

The repository already contains strong raw material:

- Prometheus data model, metric types, range functions, and common queries
- node exporter and cAdvisor metric catalogs
- host and container memory interpretation
- CPU modes, CPU usage, throttling, cgroups, virtual memory, page cache, and the OOM killer
- Grafana Alloy and the Spring Boot/Micrometer pipeline

The main problems are structural:

- No entry point or reading order connects the notes.
- Exporter catalogs mix definitions, query recipes, and interpretation.
- Linux mechanisms and their dashboard metrics live in different directory branches without an explicit bridge.
- Disk/filesystem and network panels lack the conceptual support already present for CPU and memory.
- Grafana panel mechanics, PromQL aggregation, vector matching, cardinality, and metric pruning are not taught as first-class topics.
- Some existing links are unresolved, including `metric_types` and `sidecar_pattern`; all wiki targets need a full audit.
- A few statements need precision checks, especially working set versus OOM behavior, cgroup/Kubernetes limits, summary accuracy, and deployment-specific cAdvisor labels.

## Proposed information architecture

Keep atomic notes as the source of truth. Add one small curriculum note that orders them by dependency and points to practical dashboard exercises.

### 0. Beginner bridge: Linux evidence before monitoring abstractions

- `how_linux_uses_ram` — applications, kernel, cache, and the reclaimability mental model
- `linux_memory_pages` — pages, anonymous memory, file-backed memory, dirty pages, and swap
- `linux_kernel_memory` — slab, reclaimable slab, tmpfs/ramfs/shared memory, and kernel reserves
- `proc_meminfo` — what the interface is and how its important fields relate
- `linux_memavailable` — why the old `MemFree + Cached` estimate fails and what `MemAvailable` estimates
- `host_memory_dashboard_walkthrough` — map the model to node-exporter metrics and the actual Grafana panels

These may ultimately be consolidated into fewer notes if each remains readable. The dependency order matters more than the number of files.

### 1. Foundations: what Prometheus stores

- `prometheus_learning_path` — entry point, outcomes, reading order, exercises
- `prometheus_architecture` — target, exporter, scrape, sample, TSDB, remote write, Grafana
- `time_series_basics` — sample, series, metric name, label set, scrape interval, staleness
- `prometheus_metric_types` — counter, gauge, classic/native histogram, summary
- `promql_vector_basics` — scalar, instant vector, range vector, aggregation, label preservation
- `promql_rates_and_windows` — rate, increase, resets, `$__rate_interval`, query step

Refactor or rename existing notes instead of duplicating them. Split `range_function_calculations` because it currently spans several independent query concepts.

### 2. How a Grafana panel gets its value

- `reading_a_grafana_panel` — time range, step, resolution, legend, units, transformations, “instant” queries
- `promql_aggregation_and_vector_matching` — `sum by`, `sum without`, binary operators, matching failures
- `dashboard_interpretation_workflow` — symptom → scope → saturation → contention → cause
- `prometheus_cardinality_and_cost` — active series, label cardinality, scrape interval versus series count, Grafana Cloud billing vocabulary
- `metric_pruning` — collector filters, metric relabel drop/keep, label drop, allowlists, and dependency auditing

`metric_pruning` should use the prior task as its running example: cAdvisor contributed about 2,040 active series, host metrics about 1,022, and filesystem/block-I/O families were candidates only after checking dashboard and alert dependencies.

### 3. Linux concepts behind host panels

Reuse the existing OS notes, but make the learning path explicit:

- CPU: process/thread → scheduler → user/system/idle/iowait/steal → load average → saturation and PSI
- Memory: virtual memory → pages and RSS → page cache and reclaim → MemAvailable → swap → OOM
- Storage: block device → filesystem → mount → inode → capacity versus I/O → latency, queueing, and saturation
- Network: interface → packet → byte throughput → errors/drops → sockets and connection states

Add only the missing bridges:

- `processes_threads_and_scheduling`
- `linux_load_average`
- `linux_pressure_stall_information`
- `block_devices_filesystems_and_mounts`
- `linux_disk_io`
- `linux_networking_for_metrics`

Do not create a separate note for every field. Define minor terms inline and promote them only when they have their own useful mental model.

### 4. Containers as a second accounting boundary

Suggested order:

- namespaces versus cgroups
- cgroup v2 CPU and memory accounting
- container CPU usage and throttling
- container memory: usage, RSS, cache, working set, limit, and OOM events
- container filesystem and block-I/O metrics
- host pressure versus cgroup pressure

Split `cadvisor_container_metrics` into interpretation notes plus a compact metric lookup page. Avoid assuming Kubernetes labels when the monitored environment is standalone Docker.

### 5. Applications and the full telemetry path

- Spring Boot/Micrometer meter → `/actuator/prometheus`
- Alloy scrape/relabel/remote-write pipeline
- Grafana Cloud storage and query
- RED metrics for services and USE metrics for infrastructure
- JVM heap, native memory, threads, GC, and connection pools

Retire `grafana_agent` from the main reading path. Keep it only as migration/history context because Alloy is the current collector.

## Revision phases

### Phase A — repair the immediate memory learning path

Do this before the broader Phase 0 inventory because it addresses the reader's current blocker.

- Rewrite `interpreting_host_memory` so it does not assume page-cache, slab, tmpfs, swap, or `/proc` knowledge.
- Create or revise the minimum prerequisite notes listed in the beginner bridge.
- Add one worked `/proc/meminfo` example that classifies memory as immediately free, reclaimable, or not cheaply reclaimable.
- Connect the example to the exact node-exporter metrics and the host memory panel used in go2c.
- End with a small diagnostic ladder: available memory → swap activity → memory pressure/stalls → largest consumers → OOM evidence.

Deliverable: the quoted kernel documentation about `MemFree + Cached` is understandable without reading external material first.

### Phase 0 — establish conventions and safety checks

- Use the repository Codex skill at `.codex/skills/zettelkasten` for all note work.
- Generate an inventory with filename, H1, line count, links, and references.
- Detect missing and ambiguous wiki targets.
- Record current dashboard and alert metric dependencies before pruning any metric guidance.
- Decide rename policy: use redirects/aliases if the site supports them; otherwise update every inbound link atomically.

Deliverable: clean inventory and agreed rename map.

### Phase 1 — build the learning spine

- Create `prometheus_learning_path`.
- Rewrite the architecture overview around the end-to-end data flow.
- Refactor time series, metric types, vector basics, and rates/windows.
- Add “what you should now be able to explain” checks to the learning path, not to every atomic note.

Deliverable: a reader can explain how a changing process value becomes a Grafana line.

### Phase 2 — make CPU and memory coherent vertical slices

- Connect scheduler/cgroup mechanics to node exporter and cAdvisor metrics.
- Correct and consolidate memory definitions across virtual memory, page cache, host memory, container memory, and OOM notes.
- Add worked examples using the referenced incident: a 4 GB host, low MemAvailable, swap pressure, and Metabase containers near their limits.
- State clearly that a red memory panel is evidence of pressure, not by itself a diagnosis of a leak.

Deliverable: a reader can distinguish host pressure, container-limit pressure, cache growth, and a probable leak.

### Phase 3 — fill storage and network gaps

- Teach device, filesystem, mount, inode, capacity, throughput, IOPS, latency, and queue depth in that order.
- Explain why `node_filesystem_*`, `node_disk_*`, `container_fs_*`, and `container_blkio_*` answer different questions.
- Teach interfaces, throughput, errors, drops, retransmits, and socket pressure without turning the notes into a networking textbook.

Deliverable: a reader can interpret common node-exporter storage and network rows and knows which panels are safe pruning candidates.

### Phase 4 — teach Grafana and PromQL interpretation

- Separate query semantics from visualization semantics.
- Add examples of misleading panels caused by wrong units, aggregation, window, step, missing labels, and duplicate counting.
- Explain dashboard variables and legend labels only to the depth needed to read existing dashboards.
- Convert `visualization_queries` into a true cheatsheet after canonical explanations live elsewhere.

Deliverable: a reader can reconstruct what a panel means from its metric, labels, PromQL, and display settings.

### Phase 5 — cardinality and safe pruning

- Explain series cardinality as the product of label-value combinations, with histograms and per-device metrics as examples.
- Distinguish `labeldrop` from dropping metric families: label dropping reduces combinations; it does not stop every sample for that family.
- Document a repeatable audit: inventory queries and alerts → measure series by job/family → classify required/optional/unknown → prune conservatively → verify → observe one billing window.
- Use the cAdvisor filesystem/block-I/O proposal as a case study, not a universal recommendation.
- Cover node-exporter collector selection after the cAdvisor pass.

Deliverable: a reader can reduce cost without silently breaking dashboards or alerts.

### Phase 6 — consolidate and validate

- Remove duplicate explanations after choosing canonical notes.
- Fix every unresolved link and ambiguous basename in scope.
- Verify technical claims against primary Prometheus, Grafana, Linux kernel, cAdvisor, and exporter documentation.
- Run the site build and inspect changed pages.
- Read the curriculum start to finish and remove detail that does not improve a dashboard decision.

Deliverable: one coherent reading path plus fast lookup notes.

## Reading plan

Use four passes. Each session should take roughly 30–45 minutes: read two to four notes, answer the checkpoint without looking, then inspect one real panel.

### Start here — one memory panel, from Linux to Grafana

Do this before Pass 1:

1. How Linux shares RAM between programs and caches
2. Pages, anonymous memory, file-backed memory, and reclaimability
3. Page cache, tmpfs/shared memory, and reclaimable slab
4. `/proc/meminfo`: `MemFree`, `Cached`, `SReclaimable`, and `MemAvailable`
5. Node-exporter mapping: `node_memory_*_bytes`
6. The go2c host memory panel and alert expression
7. The go2c incident: low MemAvailable, swap pressure, and container consumers

Checkpoint: Explain in your own words why `MemFree + Cached` can both count unavailable memory and omit reclaimable memory.

## How to use the Grafana/Prometheus MCP

Use the MCP to make the curriculum specific, not exhaustive.

### Inventory once

- List the go2c dashboards, folders, alert rules, recording rules, and data sources.
- Extract every PromQL expression and referenced metric name.
- Record panel title, dashboard, query, visualization type, unit, legend, threshold, and variables.
- Group panels by host CPU, host memory, storage, network, containers, JVM/application, and monitoring cost.
- Count which metrics and concepts recur. Those are the curriculum priorities.

### Build a dashboard coverage map

For each panel, track:

| Field | Question |
|---|---|
| User question | What operational question is this panel meant to answer? |
| Linux/app mechanism | What produces the underlying state? |
| Raw metric | Which exporter exposes it, with which important labels? |
| PromQL | What rate, aggregation, ratio, or join changes the raw samples? |
| Display | How do unit, time range, step, and thresholds affect what is visible? |
| Safe conclusion | What can be inferred from this panel alone? |
| Next checks | Which panels, commands, or logs distinguish likely causes? |
| Pruning dependency | Which metric families must remain for this panel or alert? |

### Elaborate selectively

- Fully explain every dashboard **concept** that appears in the active dashboards.
- Define every displayed metric briefly in a lookup page.
- Give deep treatment only to metrics that drive alerts, recur across panels, are commonly misread, or support real operational decisions.
- Group repetitive metrics into families. Do not create one note per `node_memory_*` or `container_fs_*` metric.
- Treat unused exported metrics as pruning candidates, not compulsory study material.

### Re-check after revisions

- Confirm every active panel and alert has a conceptual explanation or lookup entry.
- Confirm suggested pruning rules preserve all recorded dependencies.
- Query representative values so worked examples use realistic magnitudes and labels.
- Re-run the coverage inventory when dashboards or monitoring configuration materially change.

### Pass 1 — follow one number end to end

1. Prometheus architecture
2. Time series and labels
3. Counters, gauges, and histograms
4. Instant/range vectors and rates
5. Reading a Grafana panel

Checkpoint: Given a panel query, identify the raw metric, series dimensions, time window, transformation, and displayed unit.

### Pass 2 — CPU and memory

1. Processes, threads, scheduler, and CPU modes
2. Load average and pressure stall information
3. Virtual memory and page cache
4. Host memory and swap pressure
5. Cgroups, container memory, limits, and OOM
6. Node exporter and cAdvisor lookup notes

Checkpoint: Explain why 90% used RAM may be healthy, why low MemAvailable may not be, and why host and container alerts can disagree.

### Pass 3 — storage and network

1. Block devices, filesystems, mounts, and inodes
2. Capacity versus disk I/O
3. Container filesystem versus block-I/O accounting
4. Interfaces, throughput, errors, drops, and sockets

Checkpoint: For a “disk is slow” report, choose panels that separate full filesystem, busy device, high latency, and memory-induced I/O.

### Pass 4 — operate and optimize the monitoring system

1. Alloy collection and remote write
2. PromQL aggregation and vector matching
3. Cardinality and Grafana Cloud usage
4. Metric pruning and dependency checks
5. Application RED and JVM metrics

Checkpoint: Propose a pruning rule, estimate what it saves, list what it could break, and define verification queries.

## Definition of done

- A newcomer has one obvious start page and a dependency-ordered route.
- Every necessary term is defined inline or linked to an existing canonical note.
- CPU, memory, storage, and network each connect mechanism → metric → query → interpretation → action.
- Metric catalogs are lookup-oriented; conceptual notes are explanation-oriented.
- No unresolved or ambiguous wiki links remain in the revised scope.
- PromQL examples preserve the labels required for their stated meaning and avoid divide-by-zero or unlimited-resource traps where relevant.
- Pruning advice includes dashboard/alert dependency checks and rollback guidance.
- The Docusaurus build succeeds.

🗓️ 29042026 1530
📎 #java #jvm #gc

# gc_algorithms_g1_zgc_shenandoah

> The four collectors a modern Java service is likely to encounter: Parallel (throughput), G1 (default since JDK 9), ZGC (sub-millisecond pauses), Shenandoah (similar low-pause). Picking the right one is mostly about heap size, pause-time tolerance, and JDK version.

## The Lineage

- **Serial GC** — single-threaded everything. Used for small heaps (`<100 MB`) or single-CPU machines. Embedded use only.
- **Parallel GC (Throughput Collector)** — multi-threaded young + old, stop-the-world. Maximises throughput at the cost of pauses. Default before JDK 9.
- **CMS (Concurrent Mark Sweep)** — first widely-used low-pause collector. Concurrent old-gen mark and sweep. **Deprecated in JDK 9, removed in JDK 14.** Suffers from fragmentation.
- **G1 (Garbage-First)** — region-based, mostly-concurrent, predictable pause goal. Default since JDK 9.
- **ZGC** — sub-millisecond pauses, very large heaps. Production-ready since JDK 15.
- **Shenandoah** — concurrent compaction, similar low-pause goals. Red Hat's collector. Production since JDK 15.

## Parallel GC (Throughput Collector)

Stop-the-world young + stop-the-world old. Multi-threaded across cores.

| Property             | Behaviour                                                |
|----------------------|----------------------------------------------------------|
| Pause time           | Long for old-gen collection (seconds on large heaps)    |
| Throughput           | Highest — no concurrent overhead                         |
| Heap size            | Up to ~10 GB before pauses become unbearable             |
| Use case             | Batch jobs, offline data processing, anything tolerant of pauses |

Tuning: `-XX:+UseParallelGC -XX:MaxGCPauseMillis=200 -XX:GCTimeRatio=99`.

## G1 — Garbage-First

The default since JDK 9. Region-based: heap divided into ~2048 equal regions of 1–32 MB. Each region tagged at runtime as Eden, Survivor, Old, or Humongous.

```
┌────┬────┬────┬────┬────┬────┐
│Eden│Eden│ Old│ Old│Surv│ ...│
├────┼────┼────┼────┼────┼────┤
│ Old│Eden│ Old│Eden│Eden│ ...│
└────┴────┴────┴────┴────┴────┘
```

GC strategy: collect the regions with most garbage first ("Garbage-First"). Each pause is bounded by how many regions you can process in the budget.

| Property             | Behaviour                                                  |
|----------------------|-----------------------------------------------------------|
| Pause time           | Predictable, target via `-XX:MaxGCPauseMillis=200`        |
| Throughput           | Slightly lower than Parallel (concurrent work overhead)   |
| Heap size            | Designed for 4 GB to a few hundred GB                     |
| Use case             | Default for most server applications                      |

Concurrent phases: marking (in parallel with app threads); evacuation pauses are still STW but bounded.

Pitfalls:
- Humongous allocations (objects > 50% of region size) bypass normal flow → fragment.
- Very high allocation rates cause "evacuation failure" → temporary fall back to full STW.

## ZGC

Designed for **sub-millisecond pauses regardless of heap size**, even at hundreds of GB.

Key innovations:
- **Colored pointers** (or load barriers, depending on the JDK / mode): GC state encoded in the pointer itself; load barrier intercepts loads to handle concurrent moves.
- **Concurrent everything**: marking, relocation, reference processing. STW only for very short root scans.
- **Region-based** like G1; regions can be small (2 MB) or huge.

| Property             | Behaviour                                                |
|----------------------|----------------------------------------------------------|
| Pause time           | Sub-millisecond, often `<1 ms` even at 1 TB heap         |
| Throughput           | Lower than Parallel/G1 due to load barrier overhead (5–15%) |
| Heap size            | Designed for 8 GB to 16 TB                                |
| Production-ready     | JDK 15+ (preview earlier)                                 |

Use case: latency-sensitive services where any pause >10 ms is unacceptable, especially with large working sets.

Tuning: `-XX:+UseZGC` and that's most of it. Far fewer knobs than G1.

## Shenandoah

Red Hat's low-pause collector. Similar pause-time goals to ZGC, different mechanism (Brooks pointers / forwarding pointers, then load reference barriers).

| Property             | Behaviour                                                |
|----------------------|----------------------------------------------------------|
| Pause time           | Sub-millisecond to a few ms, regardless of heap          |
| Throughput           | Lower than Parallel/G1                                    |
| Heap size            | Tens of GB to hundreds                                    |
| Production-ready     | JDK 15+ (Red Hat builds had it earlier)                   |

Differences from ZGC:
- Slightly different concurrency model — concurrent compaction via forwarding pointers.
- Originally Red Hat–backed; ZGC is Oracle. Both upstream now.

In practice ZGC and Shenandoah occupy the same niche; pick based on JDK availability and benchmarks for your specific workload.

## Comparison Cheatsheet

| Collector  | STW pause      | Throughput | Heap range       | Default? |
|------------|----------------|------------|------------------|----------|
| Serial     | Long           | Low        | `<100 MB`        | No       |
| Parallel   | Long           | Highest    | up to 10 GB      | No (was, before JDK 9) |
| G1         | ~100 ms target | High       | 4 GB to ~100 GB  | **Yes (JDK 9+)** |
| ZGC        | `<10 ms`       | Medium     | 8 GB to 16 TB    | No       |
| Shenandoah | `<10 ms`       | Medium     | tens to hundreds GB | No    |

## Choosing

- **Default**: stay on G1 unless you have a specific reason. It's the JDK default for good reason.
- **Latency target `<10 ms` p99**: ZGC or Shenandoah. Pick by JDK version availability and your benchmark.
- **Throughput-only batch job**: Parallel GC, especially with limited cores.
- **Embedded / single-CPU**: Serial.
- **`<2 GB` heap**: Serial or Parallel — concurrent collectors have overhead that doesn't pay off.

## Common Pitfalls

- **Switching to ZGC without measuring** — the throughput hit (5–15%) can outweigh the latency benefit on workloads with no pause sensitivity.
- **Ignoring application allocation rate** — at extreme allocation rates (multi-GB/s), even ZGC may struggle. Sometimes the answer is to allocate less, not GC harder.
- **Tuning G1 like CMS** — knobs differ. `-XX:NewRatio` doesn't apply to G1 (regions are dynamically assigned). Use `-XX:G1NewSizePercent`.
- **Setting unrealistic `MaxGCPauseMillis`** — too low (e.g. 10 ms) on G1 with a large heap forces tiny young gen → constant minor GCs → throughput tanks.
- **Humongous objects in G1** — anything `>50%` of region size becomes "humongous" and lives in old gen even if newly allocated. Fragmentation risk. Increase region size: `-XX:G1HeapRegionSize=32m`.
- **Confusing GC log formats across JDK versions** — JDK 8 vs 9+ vs 11+ all changed the unified GC log format. Use consistent tools (GCEasy, JFR).
- **`-Xmx` smaller than working set** — endless GC trying to make room. Symptom: 90%+ time in GC, throughput drops to almost zero. The "GC overhead limit exceeded" OOM.
- **Not running with `-Xms = -Xmx`** — heap resizing is itself a STW operation. Pin the size in production.

## Related

- [[jvm_memory_areas]] — what these collectors operate on.
- [[jvm_garbage_collection_basics]] — generational principles.
- [[thread_pool_executor_internals]] — pool work generates the allocation rate that GC handles.
- `escape_analysis_jit` *(planned)* — JIT can sometimes avoid heap allocation entirely.

---

## References

- Oracle: [HotSpot GC Tuning Guide](https://docs.oracle.com/en/java/javase/17/gctuning/)
- ZGC: [JEP 333](https://openjdk.org/jeps/333), [JEP 377](https://openjdk.org/jeps/377)
- Shenandoah: [JEP 379](https://openjdk.org/jeps/379)
- "The Garbage Collection Handbook" (Jones, Hosking, Moss).

🗓️ 29042026 1530

# algorithms_g1_zgc_shenandoah

Four collectors a modern Java service encounters: **Parallel** (throughput), **G1** (default since JDK 9), **ZGC** (sub-millisecond pauses), **Shenandoah** (similar low-pause). Choosing depends on heap size, pause tolerance, and JDK version.

For the generational model these collectors build on, see [[basics]].

## Collector Lineage

- **Serial** — single-threaded. Small heaps (&lt;100 MB), embedded use only.
- **Parallel (Throughput)** — multi-threaded STW. Max throughput at cost of pauses. Default before JDK 9.
- **CMS** — first low-pause collector. Deprecated JDK 9, removed JDK 14. Suffered fragmentation.
- **G1** — region-based, predictable pauses. Default since JDK 9.
- **ZGC** — sub-millisecond pauses, any heap size. Production-ready JDK 15+.
- **Shenandoah** — concurrent compaction, similar goals to ZGC. Red Hat's collector. Production JDK 15+.

## Comparison

| Collector | STW Pause | Throughput | Heap Range | Default? |
|-----------|-----------|------------|------------|----------|
| Serial | Long | Low | &lt;100 MB | No |
| Parallel | Long | Highest | up to ~10 GB | No (was pre-JDK 9) |
| G1 | ~100 ms target | High | 4 GB–100 GB | **Yes (JDK 9+)** |
| ZGC | &lt;10 ms | Medium | 8 GB–16 TB | No |
| Shenandoah | &lt;10 ms | Medium | tens–hundreds GB | No |

---

## Parallel GC

STW young + STW old, multi-threaded across cores.

- **Pause**: long for old-gen (seconds on large heaps)
- **Throughput**: highest — no concurrent overhead
- **Use case**: batch jobs, offline processing, anything tolerant of pauses
- Flag: `-XX:+UseParallelGC -XX:MaxGCPauseMillis=200 -XX:GCTimeRatio=99`

## G1

Region-based. Heap divided into ~2048 equal regions (1–32 MB each). Each region tagged at runtime as Eden, Survivor, Old, or Humongous.

```
┌────┬────┬────┬────┬────┬────┐
│Eden│Eden│ Old│ Old│Surv│ ...│
├────┼────┼────┼────┼────┼────┤
│ Old│Eden│ Old│Eden│Eden│ ...│
└────┴────┴────┴────┴────┴────┘
```

Collects regions with most garbage first — each pause bounded by how many regions fit the budget.

- **Pause**: predictable, target via `-XX:MaxGCPauseMillis=200`
- **Throughput**: slightly lower than Parallel (concurrent work overhead)
- **Use case**: default for most server applications
- Concurrent marking runs alongside app threads; evacuation pauses are STW but bounded

```ad-warning
**Humongous allocations** (objects >50% of region size) bypass normal flow and fragment. Increase region size: `-XX:G1HeapRegionSize=32m`.
```

## ZGC

**Sub-millisecond pauses regardless of heap size**, even at hundreds of GB.

Key innovations:
- **Colored pointers**: GC state encoded in the pointer itself. A load barrier intercepts loads to handle concurrent moves.
- **Concurrent everything**: marking, relocation, reference processing. STW only for very short root scans.
- **Region-based** like G1; regions can be 2 MB or huge.

| Property | Value |
|----------|-------|
| Pause | &lt;1 ms, even at 1 TB heap |
| Throughput | 5–15% lower than G1 (load barrier overhead) |
| Heap range | 8 GB–16 TB |
| Flag | `-XX:+UseZGC` |

Use case: latency-sensitive services where any pause >10 ms is unacceptable. Far fewer tuning knobs than G1.

## Shenandoah

Red Hat's low-pause collector. Similar goals to ZGC, different mechanism (forwarding pointers, load reference barriers).

| Property | Value |
|----------|-------|
| Pause | Sub-millisecond to a few ms |
| Throughput | Lower than Parallel/G1 |
| Heap range | Tens to hundreds of GB |
| Flag | `-XX:+UseShenandoahGC` |

ZGC and Shenandoah occupy the same niche. Pick based on JDK availability and benchmarks for your workload.

---

## Choosing a Collector

- **Default**: stay on G1 unless you have a specific reason
- **Latency target &lt;10 ms p99**: ZGC or Shenandoah
- **Throughput-only batch job**: Parallel GC
- **&lt;2 GB heap**: Serial or Parallel — concurrent collectors have overhead that doesn't pay off

## Common Pitfalls

### Switching to ZGC without measuring

The 5–15% throughput hit can outweigh the latency benefit on workloads with no pause sensitivity.

### Ignoring allocation rate

At extreme rates (multi-GB/s), even ZGC struggles. Sometimes the answer is to allocate less, not GC harder.

### Tuning G1 like CMS

Different knobs. `-XX:NewRatio` doesn't apply to G1 (regions are dynamic). Use `-XX:G1NewSizePercent`.

### Unrealistic MaxGCPauseMillis

Too low (e.g. 10 ms) on G1 with a large heap → tiny young gen → constant minor GCs → throughput tanks.

### `-Xmx` smaller than working set

Endless GC trying to make room. Symptom: 90%+ time in GC, near-zero throughput. `GC overhead limit exceeded` OOM.

### Not pinning heap size

`-Xms` ≠ `-Xmx` → heap resizing is itself a STW operation. Pin the size in production.

---

## References

- [HotSpot GC Tuning Guide](https://docs.oracle.com/en/java/javase/17/gctuning/)
- [ZGC — JEP 333](https://openjdk.org/jeps/333), [JEP 377](https://openjdk.org/jeps/377)
- [Shenandoah — JEP 379](https://openjdk.org/jeps/379)
- "The Garbage Collection Handbook" (Jones, Hosking, Moss)

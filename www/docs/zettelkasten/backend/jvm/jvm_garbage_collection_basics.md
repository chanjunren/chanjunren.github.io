🗓️ 29042026 1515
📎 #java #jvm #gc

# jvm_garbage_collection_basics

> The empirical observation behind every modern JVM GC: **most objects die young**. Generational GC exploits this with separate young and old regions, optimising the common case (collect young; old rarely touched). Knowing the model explains every tuning knob and pause-time discussion later.

## The Generational Hypothesis

Empirical observation across decades of memory profiling: **the lifetime distribution of objects is heavily skewed toward "die almost immediately"**.

- Most allocations: locals, request-scoped, temporary builders. Live for nanoseconds-to-milliseconds.
- A small fraction: long-lived caches, sessions, framework singletons. Live for the process lifetime.
- Almost nothing in between.

GC algorithms that copy / compact only the young region exploit this — the old region is rarely touched, so the cost stays low even with a large heap.

## Young vs Old Generation

```
┌─────────────────────────────────────────┐
│          Heap                            │
│  ┌──────────────┐   ┌─────────────┐      │
│  │ Young (10%)  │   │ Old (90%)   │      │
│  └──────────────┘   └─────────────┘      │
│  ┌────┬────┬────┐                        │
│  │Eden│ S0 │ S1 │                        │
│  └────┴────┴────┘                        │
└─────────────────────────────────────────┘
```

- **Eden** — where `new` allocations land. Most fill and die here.
- **Survivor 0 / Survivor 1** — two equal-sized regions; one always empty during steady state. Used as the destination of the copying collector.
- **Old** — where survivors of multiple young collections get **promoted** ("tenured").

Default size ratio (G1 may differ): old is ~2× young; survivor is ~1/8 of young.

## Minor GC — Collecting Young

Triggered when Eden fills:

1. Mark live objects in Eden + the active Survivor.
2. **Copy** them to the empty Survivor.
3. Increment each survivor's "age" (survival count).
4. Eden is now empty (no compaction needed; everything's been moved out).
5. Active and empty survivor swap roles for next time.

Cost is proportional to the **live set in young**, not its capacity. If 95% of Eden is dead, GC processes the 5% — fast.

This is why allocation in Java is "free" in practice: unused space is reclaimed in bulk, not freed object-by-object.

## Promotion to Old

Two paths from young to old:

- **Age threshold** — after N (default 15) survivor copies, promote to old.
- **Survivor overflow** — if the Survivor doesn't fit all live objects, the remainder spills directly to old.

Tunable: `-XX:MaxTenuringThreshold=N`, `-XX:TargetSurvivorRatio=N`.

A poorly-sized survivor causes premature promotion: young objects that *would* have died in two more GCs end up in old, where they're collected via a much heavier process.

## Major / Full GC — Collecting Old

Old gen fills via promotion. When old gen is full:

- **Major GC** (CMS, G1's mixed): collects old (or a portion of it).
- **Full GC**: collects everything including old. Stop-the-world, slow.

Old-gen collection is **mark-sweep-compact** rather than copying, because the live density is too high to make copying efficient. Compaction defragments the heap; without it, allocations may fail despite total free space being adequate.

The cost of major/full GC scales with **total live old-gen size**, which is large by design. This is why pause-time targets are mostly about avoiding or accelerating old-gen collection.

## Stop-the-World Pauses

Most GC steps require **all application threads stopped** so the GC can scan references without races. The pause is the entire reason "GC tuning" exists.

Modern collectors aim to:
- Make young collections short (small live set).
- Make old-gen work mostly **concurrent** (running while app threads run).
- Only stop the world for short critical phases (root scan, remark, evacuation pauses).

See [[gc_algorithms_g1_zgc_shenandoah]] — each algorithm has a different STW story.

## Cross-Generation References (Card Table)

Problem: the old gen has references to young-gen objects (e.g. a long-lived cache pointing at a request-scoped object). When you collect young, you must scan old to find these references. Naive scan = "collect young takes as long as collect everything", defeating the point.

Solution: **card table**. The old gen is divided into "cards" (typically 512 bytes each). Whenever the app writes a reference into an old object pointing to a young object, the JVM marks the corresponding card as dirty (a write barrier). Young GC then only scans dirty cards.

The card table makes young GC's cost proportional to writes-into-old-pointing-to-young, not total old-gen size.

## What's "Live" — Reachability

Reachability is from the **GC roots**:
- Active stack frames (local references in every running thread).
- Static fields of loaded classes.
- JNI references.
- Synchronization roots.

An object is live if it's reachable from any root, transitively. Anything else is garbage and reclaimable.

This is why holding a reference in a long-lived data structure (Map, cache, listener list) constitutes a **memory leak** even though the language has GC — reachability does not equal usefulness.

## Common Pitfalls

- **Optimising allocation rate when GC is fine** — GC tuning matters when pauses or throughput suffer. Allocation rate is rarely the problem in practice; the JVM is highly optimised for cheap allocation.
- **Old-gen growing without bound** — memory leak, regardless of GC algorithm. No GC fixes a leak; you have to find the unreachable-but-still-reachable references.
- **Premature promotion** — survivor too small, objects spill to old too early. Symptom: high old-gen usage with low actual long-lived data. Increase survivor size or check allocation patterns.
- **Frequent full GC** — old gen fills repeatedly. Either too small, or you have leaks, or you're allocating large objects directly into old (huge byte arrays).
- **Big heap = better** — larger heap → larger old gen → longer full GC pauses. Up to a point, increasing heap helps; past that it hurts. ZGC mitigates by going concurrent on old.
- **`System.gc()` in production code** — provokes full GC. Almost never the right call. Prefer `-XX:+DisableExplicitGC` to neutralise.
- **Confusing `OutOfMemoryError` with "GC is too slow"** — OOM means there's no garbage to collect. Free heap = 0; live heap = max. Tuning won't help; finding the leak will.
- **Tuning by intuition without metrics** — GC log + a tool (GCEasy, Java Flight Recorder). Without numbers, tuning is guessing.

## Related

- [[jvm_memory_areas]] — what the heap is and isn't.
- [[gc_algorithms_g1_zgc_shenandoah]] — concrete algorithms.
- `threadlocal_memory_leak` *(planned)* — a common reachability-driven leak.
- [[thread_pool_executor_internals]] — pool tasks holding references.

---

## References

- Oracle: [HotSpot Garbage Collection Tuning Guide](https://docs.oracle.com/en/java/javase/17/gctuning/)
- "Java Performance" 2nd ed. (Oaks) ch. 5–6
- "The Garbage Collection Handbook" (Jones, Hosking, Moss) — definitive reference.

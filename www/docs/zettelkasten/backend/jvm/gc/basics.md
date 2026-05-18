🗓️ 29042026 1515

# basics

Most objects die young. **Generational GC** exploits this: separate young and old regions, optimize for the common case (collect young fast, touch old rarely). This model explains every tuning knob and pause-time discussion in [[algorithms_g1_zgc_shenandoah]].

## The Generational Hypothesis

The lifetime distribution of objects is heavily skewed toward "die almost immediately."

- Most allocations: locals, request-scoped, temporary builders. Live nanoseconds to milliseconds.
- A small fraction: long-lived caches, sessions, singletons. Live for the process lifetime.
- Almost nothing in between.

GC algorithms that copy/compact only the young region exploit this — old is rarely touched, so cost stays low even with a large heap.

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

- **Eden** — where `new` allocations land. Most die here.
- **Survivor 0 / Survivor 1** — two equal regions; one always empty. Destination of the copying collector.
- **Old** — survivors of multiple young collections get **promoted** here.

Default ratio: old ~2× young; survivor ~1/8 of young.

## Minor GC — Collecting Young

Triggered when Eden fills:

1. Mark live objects in Eden + active Survivor.
2. **Copy** them to the empty Survivor.
3. Increment each survivor's age.
4. Eden is now empty — no compaction needed.
5. Active and empty survivors swap roles.

Cost is proportional to the **live set in young**, not capacity. If 95% of Eden is dead, GC processes 5%. This is why Java allocation is effectively free — dead space reclaimed in bulk.

## Promotion to Old

Two paths from young to old:

- **Age threshold** — after N survivor copies (default 15), promote to old
- **Survivor overflow** — if Survivor doesn't fit all live objects, remainder spills to old

Tunable: `-XX:MaxTenuringThreshold=N`, `-XX:TargetSurvivorRatio=N`.

Poorly-sized survivor → premature promotion: young objects that would die in 2 more GCs end up in old, where collection is heavier.

## Major / Full GC — Collecting Old

Old gen fills via promotion. When full:

- **Major GC** (G1 mixed): collects old or a portion of it
- **Full GC**: collects everything. Stop-the-world, slow.

Old-gen uses **mark-sweep-compact** (not copying) because live density is too high for copying to be efficient. Compaction defragments the heap.

Cost scales with **total live old-gen size** — large by design. Pause-time targets are about avoiding or accelerating old-gen collection.

## Stop-the-World Pauses

Most GC steps stop all application threads so references don't move during scanning. This pause is the entire reason GC tuning exists.

Modern collectors aim to:
- Keep young collections short (small live set)
- Do old-gen work **concurrently** (while app threads run)
- Stop the world only for short phases (root scan, remark, evacuation)

See [[algorithms_g1_zgc_shenandoah]] for how each algorithm handles STW differently.

## Cross-Generation References (Card Table)

**Problem**: old gen holds references to young-gen objects (e.g. a cache pointing at a request-scoped object). Collecting young requires scanning old to find these. Naive scan defeats the point of generational collection.

**Solution**: **card table**. Old gen divided into 512-byte cards. When the app writes an old→young reference, a write barrier marks the card dirty. Young GC only scans dirty cards.

Cost of young GC becomes proportional to writes-into-old-pointing-to-young, not total old-gen size.

## Reachability

An object is live if reachable from a **GC root**:
- Active stack frames (local references in every running thread)
- Static fields of loaded classes
- JNI references
- Synchronization roots

Anything unreachable is garbage. Holding a reference in a long-lived structure (Map, cache, listener list) constitutes a **memory leak** — reachability does not equal usefulness.

## Common Pitfalls

### Premature optimization of allocation rate

GC tuning matters when pauses or throughput suffer. Allocation rate is rarely the problem — the JVM is optimized for cheap allocation.

### Old gen growing without bound

Memory leak. No GC algorithm fixes a leak. Find the unreachable-but-still-reachable references.

### Premature promotion

Survivor too small → objects spill to old too early. Symptom: high old-gen usage but low actual long-lived data. Increase survivor size.

### Frequent full GC

Old gen fills repeatedly. Either too small, leaking, or large objects (big byte arrays) allocate directly into old.

### `System.gc()` in production

Provokes full GC. Almost never correct. Use `-XX:+DisableExplicitGC` to neutralize.

### OOM does not mean "GC is slow"

OOM means no garbage to collect. Free heap = 0; live heap = max. Tuning won't help. Finding the leak will.

---

## References

- [HotSpot GC Tuning Guide](https://docs.oracle.com/en/java/javase/17/gctuning/)
- "Java Performance" 2nd ed. (Oaks) ch. 5–6
- "The Garbage Collection Handbook" (Jones, Hosking, Moss)

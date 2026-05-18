🗓️ 29042026 1715
📎 #java #jvm #concurrency #moc

# moc_jvm_concurrency

> Map of Content for the JVM-and-concurrency cluster. Memory model, garbage collection, and the synchronisation primitives that the rest of `java.util.concurrent` is built on.

## Concept Order

### Memory and Garbage Collection
1. [[memory_areas]] — heap / stack / metaspace / code cache / direct memory.
2. [[basics]] — generational hypothesis, young/old, minor/major GC.
3. [[algorithms_g1_zgc_shenandoah]] — concrete collectors and when to pick which.

### The Memory Model
4. [[java_memory_model_happens_before]] — visibility and ordering rules between threads.

### Synchronisation Primitives
5. [[volatile_synchronized_atomic_difference]] — the three tools and what each provides.
6. [[cas_compare_and_swap]] — the atomic primitive underneath the others.
7. [[reentrantlock_vs_synchronized]] — when to pick explicit locks over the keyword.

### Higher-Level Constructs
8. [[concurrenthashmap_internals]] — case study combining all primitives; JDK 7 vs JDK 8 designs.
9. [[thread_pool_executor_internals]] — submission rule, queue choice, reject policies, lifecycle.

### Planned
- `aqs_abstractqueuedsynchronizer` — the framework underneath every `j.u.c.locks` lock and many synchronisers.
- `thread_pool_sizing_little_law` — sizing maths and CPU-bound vs I/O-bound rules.
- `completablefuture_async_chains` — async composition; ForkJoinPool common pool gotchas.
- `threadlocal_memory_leak` — classic reachability-driven leak in pooled threads.
- `class_loading_parent_delegation` — what fills Metaspace and how to leak classloaders.
- `virtual_threads_loom_jdk21` — JDK 21+ virtual threads and what changes.
- `forkjoin_pool` (P2) — work-stealing pool details.
- `escape_analysis_jit` (P2) — when the JIT can elide allocation entirely.

## How to Use This MOC

- **First pass**: memory areas → GC basics → algorithms; then JMM → primitives → higher-level. The latter half builds on the former; don't skip the memory-model chapter.
- **Second pass**: rebuild the synchronisation primitives in your head from the JMM rules. If `volatile` makes sense, the rest cascades.
- **Application drill**: take a concurrent bug from production (race, memory leak, slow GC) and trace which zettel diagnoses it.

## Bridges to Other Domains

- → DB internals: [[transaction_isolation_levels]] is the database analogue of these visibility/atomicity rules; [[concurrency_control]] is their parent concept.
- → Distributed systems: [[consistency_models]] generalises [[java_memory_model_happens_before]] to many machines.
- → Caching: [[redis_distributed_lock]] is what you reach for when single-JVM locks aren't enough.
- → API resilience: [[circuit_breaker_pattern]], [[retry_backoff_jitter]] live on top of `ThreadPoolExecutor` and need its sizing math.
- → Spring (planned): `spring_aop_proxies_jdk_vs_cglib`, `spring_transaction_propagation` rely on these primitives.

🗓️ 29042026 1600
📎 #java #concurrency

# volatile_synchronized_atomic_difference

> The three Java tools for shared-state coordination. They solve overlapping but distinct problems — visibility, atomicity, mutual exclusion — and confusing them produces real bugs (racy counters, lost updates, mysterious infinite loops). The right tool depends on whether you need *just* visibility, *just* atomicity, or *full* mutual exclusion.

## What Each Provides

```ad-abstract
**volatile** — visibility + ordering only. Reads see latest writes; reorderings around the variable are restricted. **No atomicity, no mutual exclusion.**

**synchronized / Lock** — mutual exclusion + visibility + ordering. Only one thread inside the critical section. Establishes happens-before across enter/exit pairs.

**AtomicXxx (java.util.concurrent.atomic)** — atomicity + visibility for *single* compound operations on a single value, via [[cas_compare_and_swap]]. Lock-free.
```

## When Each Fits

| Need                                            | Tool                                |
|-------------------------------------------------|-------------------------------------|
| One thread writes, others read a flag           | `volatile boolean`                  |
| Atomic increment of a counter                    | `AtomicInteger.incrementAndGet()`   |
| Atomic update of a single object reference       | `AtomicReference.compareAndSet()`   |
| Critical section involving multiple fields       | `synchronized` or `ReentrantLock`   |
| Read-mostly data, occasional update              | `volatile` reference + COW pattern  |
| Counter you increment from many threads          | `LongAdder` (better than AtomicLong under contention) |

## volatile — Visibility

A `volatile` read sees the most recent write from any thread. Without `volatile`, the JIT may hoist a read out of a loop, never seeing the updated value.

```java
volatile boolean stop = false;

// Thread A:
while (!stop) {
  doWork();
}

// Thread B:
stop = true;   // visible to thread A's loop
```

Without `volatile`, the JIT can transform `while (!stop)` into `if (!stop) while (true)` — a permanent infinite loop. (This is real, not theoretical.)

What `volatile` does NOT do:

```java
volatile int counter = 0;
counter++;   // STILL RACY — read-modify-write, three separate ops
```

`++` is `temp = counter; temp = temp + 1; counter = temp;`. Two threads reading 5 both write 6. Lost update. `volatile` ensures *visibility*, not *atomicity*.

## synchronized — Mutual Exclusion

Acquires a monitor (every Java object has one) before entering the block; releases on exit.

```java
synchronized(this) {
  // critical section: only one thread at a time
  count++;
  list.add(x);
}
```

Properties:
- **Mutual exclusion** — guaranteed by the monitor.
- **Happens-before** — unlock happens-before subsequent lock (see [[java_memory_model_happens_before]]).
- **Reentrant** — same thread can re-enter without deadlocking itself.
- **Visibility** — every read inside sees writes from prior holders.

Cost: lock acquisition + release. Modern JVMs have **biased locking** (now removed in JDK 15+) and **lightweight locks** that make uncontended `synchronized` near-free; under contention it escalates to a "fat" lock with kernel-level wait/wake.

## AtomicXxx — Lock-Free Atomicity

`AtomicInteger`, `AtomicLong`, `AtomicReference`, etc. wrap a single value and expose atomic operations:

```java
AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();              // atomic +1
counter.compareAndSet(5, 10);           // CAS: only succeeds if current==5
counter.updateAndGet(v -> v * 2);       // atomic functional update
```

Built on [[cas_compare_and_swap]]. Each operation is one read-modify-write, atomic at the CPU level via `LOCK CMPXCHG` (x86) or LL/SC (ARM).

Properties:
- **No locks** — no thread blocks. Failed CAS retries.
- **Visibility** — same guarantees as `volatile` (`AtomicXxx` fields are internally `volatile`).
- **Atomicity for single values only** — atomically updating two fields together requires either a lock or a wrapper object.

## LongAdder — When Contention Is High

`AtomicLong` under heavy contention has a known limit: every CAS contends on the same cache line. At very high write rates, throughput plateaus.

`LongAdder` (JDK 8+) sidesteps this with **striped counters** — multiple internal cells, each thread CAS-es a different cell. `sum()` reads all cells.

| Metric             | AtomicLong                  | LongAdder                          |
|--------------------|-----------------------------|------------------------------------|
| Update under low contention  | Slightly faster   | Slightly slower (more memory)      |
| Update under high contention | Slow (CAS retries) | **Much faster**                    |
| Read                | One word                   | Sums N cells (slower)              |

Use `LongAdder` for hot counters (request totals, metrics). Use `AtomicLong` when you need to read the current value frequently.

## Combining

Real concurrent code mixes these:

- A `volatile` flag + a `synchronized` block: flag for fast cancellation check, lock for the critical section once entered.
- A `ConcurrentHashMap` (uses CAS + synchronized internally) holding an `AtomicInteger` per key.
- An `AtomicReference<ImmutableState>` with copy-on-write: atomic reference swap, immutable contents.

## Performance Hierarchy (Rough)

Uncontended → contended:

| Tool                                  | Uncontended | Lightly contended | Heavily contended |
|---------------------------------------|-------------|-------------------|-------------------|
| `volatile` read/write                 | ~1 ns       | ~1 ns             | ~1 ns             |
| `AtomicInteger.incrementAndGet`       | ~5 ns       | ~10 ns            | tens of ns (CAS retry) |
| `LongAdder.increment`                 | ~5 ns       | ~5 ns             | ~5 ns (striped)   |
| `synchronized` (biased / thin lock)   | ~5 ns       | ~50 ns            | ~µs (kernel wait) |
| `ReentrantLock`                       | ~20 ns      | ~50 ns            | ~µs (kernel wait) |

Numbers are illustrative; benchmark for your hardware. The shape — locks degrading to kernel waits under contention — holds universally.

## Common Pitfalls

- **Using `volatile` for compound operations** — `counter++`, `if (x) ... else x = ...`. Always racy. Use atomic or lock.
- **Forgetting `volatile` on the singleton field in DCL (double-checked locking)** — under reordering, another thread can see a partially-constructed instance. Always:
  ```java
  private volatile Singleton instance;
  ```
- **Locking on `String` literals or boxed primitives** — interned, shared across the JVM. Unrelated code can deadlock you. Use a dedicated lock object.
- **Locking on `this` in public classes** — anyone can also lock on your instance, deadlocking unrelated code paths. Use a private final lock object.
- **Big synchronized blocks** — long critical sections kill throughput. Narrow scope to just the contended state.
- **Holding a lock during I/O** — calls out to network/disk while holding a lock; thread pool drains; cascading slowness. Release before I/O.
- **`AtomicLong` everywhere** — under contention, `LongAdder` is far better for counters. Default to `LongAdder` if you only `add` and occasionally `sum`.
- **Mixing locks for the same shared state** — `synchronized` and a separate `ReentrantLock` on the same data → no mutual exclusion between them. Pick one mechanism per state.
- **`Boolean` autoboxing in `volatile` references** — `volatile Boolean flag` involves `valueOf` calls and pointer comparisons. Prefer `volatile boolean`.

## Related

- [[java_memory_model_happens_before]] — the rules these primitives establish.
- [[cas_compare_and_swap]] — what AtomicXxx uses internally.
- [[reentrantlock_vs_synchronized]] — choosing between explicit and intrinsic locks.
- [[concurrenthashmap_internals]] — case study of all three tools combined.
- [[thread_pool_executor_internals]] — internal state managed via these primitives.

---

## References

- "Java Concurrency in Practice" (Goetz) ch. 3, 15.
- JEP 374: [Disable and Deprecate Biased Locking](https://openjdk.org/jeps/374).
- Doug Lea: [JSR-166 documentation](http://gee.cs.oswego.edu/dl/concurrency-interest/).

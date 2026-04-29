🗓️ 29042026 1615
📎 #java #concurrency #atomic

# cas_compare_and_swap

> The atomic primitive underneath every lock-free data structure in `java.util.concurrent`. CAS lets a thread say *"set this location to NEW_VALUE only if it currently equals EXPECTED"* — atomically, in one instruction. The cost is busy-retry under contention; the benefit is no kernel-level blocking.

## The Operation

```ad-abstract
**CAS(addr, expected, new)** — atomically:
1. Read the value at `addr`.
2. If it equals `expected`, write `new` and return success.
3. Else return failure (and report the actual value).
The whole sequence is a single uninterruptible CPU operation.
```

x86: `LOCK CMPXCHG`. ARM: load-linked / store-conditional (LL/SC). Both are guaranteed atomic by the hardware.

## What CAS Buys You

- **Lock-free updates** — no thread blocks; failed CAS retries.
- **Wait-free reads** — readers don't see partial updates.
- **No deadlock** — without locks, no lock-ordering issues.
- **No priority inversion** — no thread holds anything long enough to invert.

What it costs:

- **Busy retry under contention** — `cas-fails-retry` loops burn CPU in tight contention.
- **CPU cache-line ping-pong** — the contended cache line bounces between cores.
- **Limited to single-word atomicity** — multi-field updates need wrapper objects or other tricks.
- **ABA problem** — see below.

## In Java

`AtomicInteger.compareAndSet(int expected, int update)` is the canonical example:

```java
AtomicInteger value = new AtomicInteger(0);

// Atomic increment via CAS-loop:
int current;
do {
  current = value.get();
} while (!value.compareAndSet(current, current + 1));
```

The standard increment loop. If a competing thread updates between `get` and `compareAndSet`, the CAS fails and the loop retries. Eventually one thread wins.

`incrementAndGet()` does this internally — you rarely write the loop yourself.

## CAS-Built Primitives in JDK

Most of `java.util.concurrent` is CAS-based at the lowest layer:

| Class                        | Built on                                            |
|------------------------------|-----------------------------------------------------|
| `AtomicInteger`, `AtomicLong`| Direct CAS via `Unsafe.compareAndSwap*`             |
| `AtomicReference<T>`         | CAS on object reference                              |
| `AtomicStampedReference<T>`  | CAS on `(reference, version)` pair — solves ABA     |
| `ConcurrentHashMap` (JDK 8+) | CAS for first insertion per bucket; lock for collision |
| `ConcurrentLinkedQueue`      | CAS on next-pointer for enqueue                      |
| `LongAdder`                  | Striped CAS-able cells                               |
| `AbstractQueuedSynchronizer` (`AQS`) | CAS on the state field for fast path        |

`Unsafe` (and its successor `VarHandle` since JDK 9) is how Java code calls CAS at the JVM intrinsics level.

## The ABA Problem

CAS only checks if the value matches. It cannot detect that the value was changed and changed back:

```
Thread A: reads X = 5
Thread B: changes X to 7
Thread B: changes X back to 5
Thread A: CAS(X, 5, 8) succeeds — but the world changed in between!
```

In some lock-free algorithms, "the world changed" matters. Classic example: a stack with CAS on the top pointer:

```
Stack: A → B → C
Thread X reads top = A
Thread Y pops A, pops B, then pushes A back: top = A → C
Thread X CAS-es top from A to A.next = B  ← but B was freed!
```

Stack is now corrupted: X just pushed a freed pointer.

### Solutions

- **AtomicStampedReference** — pair `(value, version)`; every write increments the version. CAS checks both. Two threads cannot both see the same `(value, version)` because version monotonically increases.
- **Hazard pointers / epoch-based reclamation** — coordinate with the memory reclaimer to ensure no thread holds an old pointer when the underlying memory is reused. Used in C++ lock-free libraries.
- **Tagged pointers** — use spare bits in the pointer for a counter. Same idea as `AtomicStampedReference` packed into one word.

In practice for Java application code: ABA is mostly invisible because:
- The garbage collector doesn't recycle objects until no thread holds a reference. So "value was changed back to the same reference" almost never means "to a different object" — it's the *same* object.
- Pure value updates (counters, flags) don't have ABA issues because the values aren't pointer-equal in a meaningful way.

ABA matters when you're rolling your own lock-free data structure with manual memory management. For everyday `AtomicInteger.compareAndSet`, ABA is a curiosity, not a hazard.

## Spinning, Backoff, Livelock

A naive CAS loop:

```java
while (true) {
  int cur = atomicVar.get();
  if (atomicVar.compareAndSet(cur, cur + 1)) return;
}
```

Under N-thread contention, only one thread per iteration succeeds; N-1 retry. Wasted CPU = O(N²) total work to perform N increments.

Mitigations in practice:
- **Built-in JVM backoff** — `Thread.onSpinWait()` (JDK 9+) hints that this is a spin loop; CPU may yield resources.
- **Striping** — `LongAdder`'s approach: spread the contention across cells.
- **Exponential backoff** — sleep increasingly between retries. Trades latency for less wasted CPU.

Pure CAS loops can also **livelock**: every thread retries indefinitely without progress. Most JDK primitives are designed to make at least one thread succeed each iteration (lock-free guarantee), avoiding livelock.

## CAS vs Locks — Performance

| Scenario                | Lock                                | CAS                                    |
|-------------------------|--------------------------------------|----------------------------------------|
| Uncontended             | Fast (biased / lightweight)         | Fast (single instruction)              |
| Lightly contended       | Fast (no kernel)                    | Fast                                   |
| Heavily contended       | Kernel wait/wake; slow              | Cache-line bouncing; slow              |
| Fairness                | `ReentrantLock(true)` available     | First-come-first-served not guaranteed; some threads can starve under heavy load |
| Composability           | Easy (multiple locks)               | Hard (multi-CAS not provided)          |

Rule of thumb: CAS wins for short, single-word updates. Locks win for multi-step critical sections. The JDK uses CAS for state and locks for the slow path.

## Common Pitfalls

- **Mistaking ABA-vulnerability for ordinary CAS use** — most application code is safe. ABA is a hazard for hand-written lock-free data structures with manual reclamation.
- **CAS-loop without bound** — under pathological contention, can spin forever. Use a yield/backoff/timeout.
- **Comparing floats/doubles** — equality on floats is a minefield. `compareAndSet(0.0, 0.0)` may fail if NaN is involved or the encoding differs (`+0.0` vs `-0.0`). `AtomicDouble` doesn't exist; use `Double.doubleToLongBits` and `AtomicLong`.
- **Using CAS for what should be a lock** — multi-field updates via several CAS calls aren't atomic across fields. Use a wrapper object + AtomicReference, or take a lock.
- **Ignoring the cache-line cost** — under heavy contention, the CPU spends most of its time bouncing the contended line. Sometimes a lock plus parking is *faster* than a CAS spin storm.
- **Building your own concurrent structure with CAS** — almost always a mistake outside JDK or specialised libraries. The JDK's primitives are highly tuned and battle-tested.
- **Forgetting that CAS establishes happens-before** — `compareAndSet` is a volatile-like operation. Every successful CAS is a memory barrier. See [[java_memory_model_happens_before]].

## Related

- [[volatile_synchronized_atomic_difference]] — the wider toolkit CAS sits in.
- [[java_memory_model_happens_before]] — CAS is itself an HB-establishing operation.
- [[concurrenthashmap_internals]] — the JDK 8+ map relies on bucket-level CAS.
- [[reentrantlock_vs_synchronized]] — `ReentrantLock`'s fast path uses CAS via AQS.

---

## References

- "Java Concurrency in Practice" (Goetz) ch. 15.
- IBM Research: ["Going atomic"](https://web.archive.org/web/20120322023149/http://www.ibm.com/developerworks/java/library/j-jtp11234/) — early Java atomic primer.
- Maged Michael, ["Hazard Pointers"](https://www.research.ibm.com/people/m/michael/ieeetpds-2004.pdf) — for the ABA solution side.

🗓️ 29042026 1545
📎 #java #concurrency #memory_model

# java_memory_model_happens_before

> The rules that decide what one thread can see of another thread's writes. The Java Memory Model (JMM, defined in JSR-133) specifies a **happens-before** ordering: if action A happens-before action B, then everything visible to A is visible to B. Without an explicit happens-before edge, all bets are off — even ordinary loads can return arbitrarily stale values.

## Why a Memory Model Exists

Modern hardware and compilers reorder, cache, and re-issue memory operations for performance:

- CPUs have per-core caches. A write on core 1 may not be visible on core 2 until cache coherence catches up.
- Compilers reorder independent statements (`a = 1; b = 2;` may execute as `b = 2; a = 1;`).
- The CPU's out-of-order execution further reorders at the instruction level.

Without rules, "thread B should see what thread A wrote" has no answer. The JMM defines exactly when one thread's actions are guaranteed visible to another.

## Happens-Before Defined

```ad-abstract
**A happens-before B** means: A's effects are visible to B, and A's effects appear ordered before B's from any thread observing both.
```

This does **not** require A to literally execute before B in wall-clock time. The JVM and CPU can reorder freely as long as the happens-before constraints are preserved.

## The Happens-Before Rules

1. **Program order rule** — within a single thread, every action happens-before every later action in program order.

2. **Monitor lock rule** — unlock of a monitor happens-before every subsequent lock of the same monitor.

3. **Volatile variable rule** — write to a `volatile` variable happens-before every subsequent read of the same variable.

4. **Thread start rule** — `Thread.start()` happens-before any action in the started thread.

5. **Thread termination rule** — every action in a thread happens-before any other thread's successful return from `join()` on that thread.

6. **Thread interruption rule** — `Thread.interrupt()` happens-before the interrupted thread observes interruption.

7. **Finalizer rule** — end of constructor happens-before start of `finalize()`.

8. **Transitivity** — if A happens-before B and B happens-before C, then A happens-before C.

The transitive rule is the workhorse — most multi-thread reasoning chains volatile or lock edges through transitivity.

## Worked Example: Why volatile Suffices

```java
class Holder {
  int data = 0;
  volatile boolean ready = false;

  void writer() {
    data = 42;        // (1)
    ready = true;     // (2)  volatile write
  }

  void reader() {
    if (ready) {      // (3)  volatile read
      use(data);      // (4)
    }
  }
}
```

Why thread B's `use(data)` sees `42` (not `0`):

- (1) happens-before (2) — program order in writer.
- (2) happens-before (3) — volatile write before subsequent read.
- (3) happens-before (4) — program order in reader.
- Therefore (1) happens-before (4) — transitivity.

`data` itself is **not** volatile, but the volatile flag piggybacks the visibility for everything written before it. This is why a single volatile flag often "publishes" an entire structure.

Without `volatile` on `ready`, none of these edges exist. The reader could see `ready=true` but `data=0` indefinitely.

## What Happens-Before Does NOT Mean

- **Not real-time ordering**. Two unrelated threads can produce events that aren't ordered by any rule; observers may see them in any order.
- **Not mutual exclusion**. Happens-before is about visibility/ordering; doesn't prevent races. `volatile int counter; counter++;` still has a race because `++` is read-modify-write, not a single visible action.
- **Not "we ran on the same core"**. Cache coherence is one mechanism, but JMM is independent of hardware. A correct program runs on any conformant JVM.

## How happens-before is Established in Practice

| Action                        | Establishes happens-before?                            |
|-------------------------------|--------------------------------------------------------|
| Read / write of `volatile`    | Yes (volatile rule)                                    |
| `synchronized` enter / exit   | Yes (monitor lock rule)                                |
| `Lock.lock()` / `Lock.unlock()` | Yes (same as monitor lock rule)                      |
| `Thread.start()` / `join()`   | Yes (start/termination rules)                          |
| `BlockingQueue.put()` / `take()` | Yes (implementation guaranteed by API contract)     |
| `CountDownLatch.countDown()` / `await()` | Yes                                          |
| `ExecutorService.submit(task)` → task running | Yes (analogous to `Thread.start`)         |
| `Future.get()` after task completion | Yes                                              |
| Plain field read / write      | **No**                                                 |

## Memory Barriers — The Hardware Layer

Beneath happens-before, the JIT inserts CPU memory barriers (fences):
- **LoadLoad** — prevents reordering of two reads.
- **StoreStore** — prevents reordering of two writes.
- **LoadStore** — prevents read after store reordering.
- **StoreLoad** — prevents store after load reordering. The expensive one (full barrier).

A volatile write is roughly: `StoreStore + StoreLoad`. A volatile read: `LoadLoad + LoadStore`.

You don't write barriers in Java code (you can't, except via `Unsafe`). The JIT emits them based on the JMM rules.

## Common Pitfalls

- **Assuming "synchronized" gives just mutual exclusion** — it also gives happens-before, which is why visibility "magically" works after a `synchronized` block. Both effects matter.
- **`volatile` on a compound operation** — `volatile int counter; counter++;` is still racy. Use `AtomicInteger` for atomic compound updates. See [[volatile_synchronized_atomic_difference]].
- **Double-checked locking without volatile** — the classic broken idiom. Construction can be reordered such that another thread sees a partially-constructed object. Add `volatile` to the field.

  ```java
  // CORRECT (since Java 5+ with volatile):
  private volatile Singleton instance;
  ```

- **Treating object publication as automatic** — putting a new object in a non-volatile field doesn't establish happens-before for its contents. Other threads may read uninitialised state.
- **Synchronisation on different objects** — `synchronized(obj1)` and `synchronized(obj2)` don't synchronise with each other. Use the same lock object.
- **Using `==` on shared `Boolean`** — autoboxing produces different objects; `==` compares references. Always use `equals` or unbox.
- **Per-object locks for class-level state** — a `static` field guarded by `synchronized(this)` is racy across instances. Use `synchronized(MyClass.class)` or a dedicated lock.
- **Reading and writing without any happens-before edge** — the JIT can hoist a non-volatile read out of a loop, producing infinite loops on flag-poll patterns. Make the flag `volatile`.

## Related

- [[volatile_synchronized_atomic_difference]] — how the rules play out across the three primitives.
- [[cas_compare_and_swap]] — the atomic CAS itself is a memory-barriered operation.
- [[reentrantlock_vs_synchronized]] — both establish monitor-lock-rule edges.
- [[concurrenthashmap_internals]] — heavy user of volatile + CAS for visibility.
- [[thread_pool_executor_internals]] — task submission establishes happens-before to task execution.

---

## References

- JSR-133: [Java Memory Model and Thread Specification](https://www.cs.umd.edu/~pugh/java/memoryModel/jsr133.pdf)
- "Java Concurrency in Practice" (Goetz) ch. 16 — best plain-English explanation.
- Doug Lea: [The JSR-133 Cookbook](https://gee.cs.oswego.edu/dl/jmm/cookbook.html) — for the barrier-level details.

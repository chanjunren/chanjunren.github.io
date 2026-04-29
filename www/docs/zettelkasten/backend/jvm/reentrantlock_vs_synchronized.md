🗓️ 29042026 1630
📎 #java #concurrency #locking

# reentrantlock_vs_synchronized

> Two ways to take a lock in Java. `synchronized` is the keyword: simple, JVM-managed, and now usually as fast as anything else for the common case. `ReentrantLock` is the explicit class: more flexible, supports interruptible/timed/fair acquisition and condition variables. The choice is mostly about whether you need any feature `synchronized` doesn't provide.

## The Two Mechanisms

```ad-abstract
**`synchronized` (intrinsic / monitor lock)** — every Java object has an associated monitor. `synchronized(obj)` enters the monitor; the JVM manages acquisition, release, and contention.

**`ReentrantLock` (explicit lock, java.util.concurrent.locks)** — an object you call `lock()` and `unlock()` on. Built on `AbstractQueuedSynchronizer` (AQS) with CAS for the fast path.
```

Both are **reentrant** — the same thread can acquire the same lock multiple times without deadlocking itself.

## Side-by-Side

| Feature                              | `synchronized`           | `ReentrantLock`              |
|--------------------------------------|--------------------------|------------------------------|
| Reentrant                            | Yes                      | Yes                          |
| Mutual exclusion                     | Yes                      | Yes                          |
| Establishes happens-before           | Yes (monitor lock rule)  | Yes                          |
| Try-acquire (non-blocking)           | No                       | `tryLock()`                  |
| Timed acquire                         | No                       | `tryLock(timeout)`           |
| Interruptible acquire                 | No (uninterruptible)     | `lockInterruptibly()`        |
| Fair acquisition                      | No                       | `new ReentrantLock(true)`    |
| Multiple condition variables          | One (via `wait/notify`)  | Multiple (`newCondition()`)  |
| Auto-release on exception             | Yes (block exit)         | No — must `try/finally`      |
| Lock acquisition order               | LIFO (unfair)            | LIFO unfair / FIFO fair      |
| Performance under low contention      | Equal (modern JVMs)      | Equal                        |
| Performance under high contention     | Equal or slightly slower | Equal or slightly faster     |

## When to Pick `synchronized`

Default to `synchronized` unless you need a feature it can't provide. Reasons:

- **Less code** — no `try/finally` boilerplate.
- **Auto-release** — exception in the block? Lock released. With `ReentrantLock`, forgetting `unlock()` in `finally` leaks the lock forever.
- **JVM optimisations** — biased locking (removed in JDK 15+), thin locks, lock coarsening, lock elision. The JIT can sometimes elide locks entirely (escape analysis sees the lock object never leaves the thread).
- **Familiar to all readers** — explicit locks signal "something fancy is happening", which is sometimes a feature, sometimes noise.

## When to Pick `ReentrantLock`

You need at least one of:

- **`tryLock()`** — give up if the lock is held; retry later. Great for opportunistic batch processing.
- **`tryLock(timeout)`** — wait up to N ms. Avoids permanent blocking on a stuck holder.
- **`lockInterruptibly()`** — let `Thread.interrupt()` break a thread waiting for the lock. Critical for graceful shutdown.
- **Fairness** — `new ReentrantLock(true)` queues threads FIFO. `synchronized` gives no fairness guarantee. Fairness costs throughput; use only when ordering matters.
- **Multiple condition variables** — one lock, multiple wait queues (e.g. "not-empty" and "not-full" in a bounded buffer).
- **Inspection** — `getQueueLength()`, `hasQueuedThread()` etc. for diagnostics.

## Standard Pattern with ReentrantLock

```java
private final ReentrantLock lock = new ReentrantLock();

public void doWork() {
  lock.lock();
  try {
    // critical section
  } finally {
    lock.unlock();
  }
}
```

The `try/finally` is non-negotiable. Without it, an exception in the critical section leaks the lock. This is the single biggest reason `synchronized` is the default — it's automatic.

## Multiple Conditions Example

A bounded buffer needs two waits: "not full" (producer waits when full) and "not empty" (consumer waits when empty). `synchronized` gives only one condition (the implicit `wait/notify`):

```java
class BoundedBuffer<T> {
  private final ReentrantLock lock = new ReentrantLock();
  private final Condition notFull = lock.newCondition();
  private final Condition notEmpty = lock.newCondition();
  private final Object[] items = new Object[16];
  private int count, putIdx, takeIdx;

  public void put(T x) throws InterruptedException {
    lock.lock();
    try {
      while (count == items.length) notFull.await();
      items[putIdx] = x;
      putIdx = (putIdx + 1) % items.length;
      count++;
      notEmpty.signal();
    } finally { lock.unlock(); }
  }
  // take() symmetric
}
```

With one condition (`synchronized` + `wait/notify`), you'd `notifyAll()` and have woken consumers re-check the predicate. Two conditions let you wake exactly the right side.

## Read-Write Lock

`ReentrantReadWriteLock` — separate read and write locks. Multiple readers concurrent; writer exclusive.

```java
private final ReentrantReadWriteLock rw = new ReentrantReadWriteLock();
private final Lock readLock = rw.readLock();
private final Lock writeLock = rw.writeLock();
```

Useful when:
- Read frequency >> write frequency.
- Reads are non-trivial (otherwise overhead exceeds benefit).
- Writes are short (long writes block all readers).

For very read-heavy data, `StampedLock` (JDK 8+) offers an **optimistic read** mode that doesn't even acquire a lock — just validates the version after the read.

## StampedLock (Optimistic Reads)

```java
StampedLock sl = new StampedLock();
long stamp = sl.tryOptimisticRead();
int local = sharedField;
if (!sl.validate(stamp)) {
  stamp = sl.readLock();
  try { local = sharedField; }
  finally { sl.unlockRead(stamp); }
}
```

Optimistic read = no lock acquired; validate after to confirm no writer interfered. Fall back to a real read lock on validation failure.

Caveats:
- Not reentrant. A thread holding a stamp lock cannot recursively acquire it.
- Easy to misuse. Many production codebases stick to `ReentrantReadWriteLock` for safety.

## Performance — Modern Reality

Pre-JDK 6: `synchronized` was substantially slower than `ReentrantLock`. Lots of guides recommend the latter on those grounds.

JDK 6+ optimisations made `synchronized` fast:
- Biased locking (removed in 15+).
- Lightweight locks via CAS.
- Lock coarsening (multiple adjacent locks merged by JIT).
- Lock elision (escape-analysis-driven).

In practice today: **`synchronized` and `ReentrantLock` perform comparably** on most workloads. Pick by feature need, not performance.

The exception: extreme contention. Under heavy contention, `ReentrantLock` may have slightly better-tuned wait-queue behaviour. But if you're at extreme contention, the bigger question is whether you should be using locks at all.

## Common Pitfalls

- **Forgetting `unlock()` in `finally`** — exception leaks the lock; every subsequent acquirer hangs. Make `try/finally` muscle memory.
- **Locking on `String` literals** — interned, JVM-shared. Unrelated code can deadlock you.
- **Locking on boxed primitives** — same reason; `Integer.valueOf(1)` returns a cached instance.
- **Using `ReentrantLock` for everything** — verbose, error-prone, no advantage when `synchronized` suffices.
- **Acquiring locks in inconsistent orders** — classic deadlock. Establish a global lock ordering.
- **Holding a lock across I/O** — see [[volatile_synchronized_atomic_difference]] pitfalls. Equally true here.
- **Fairness without need** — `new ReentrantLock(true)` halves throughput in many workloads. Only use when ordering is required (e.g. preventing starvation under sustained contention).
- **`wait()` without checking the condition** — spurious wakeups exist. Always `while (!condition) wait();`, never `if (!condition) wait();`.
- **`signal()` instead of `signalAll()` on multi-condition `wait`** — wakes one thread that may not be the one whose condition was satisfied. With `synchronized`+`notify`, prefer `notifyAll`. With `Condition`, `signal` is OK if you have separate conditions for each waiter type.

## Related

- [[volatile_synchronized_atomic_difference]] — the wider primitive landscape.
- [[java_memory_model_happens_before]] — both locks establish HB-edges.
- [[cas_compare_and_swap]] — `ReentrantLock`'s fast path is CAS via AQS.
- `aqs_abstractqueuedsynchronizer` *(planned)* — the framework underneath every `j.u.c.locks` lock.

---

## References

- "Java Concurrency in Practice" (Goetz) ch. 13.
- Doug Lea: [JSR-166 documentation](http://gee.cs.oswego.edu/dl/concurrency-interest/).
- JEP 374: [Disable and Deprecate Biased Locking](https://openjdk.org/jeps/374).

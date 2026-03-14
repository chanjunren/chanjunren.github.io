🗓️ 13032026 1200

# java_synchronized

`synchronized` acquires a **monitor lock** (intrinsic lock) on an object. Only one thread can hold a given object's monitor at a time. Others block until it's released.

```java
synchronized (someObject) {
    // only one thread at a time (per object) can be here
}
```

## Intrinsic vs Explicit Locks
Every Java object has a hidden lock built into it — that's the **intrinsic** lock. You don't create it.

The **other kind** is an **explicit lock** you create yourself:

```java
ReentrantLock lock = new ReentrantLock();
lock.lock();
try { ... } finally { lock.unlock(); }  // must unlock manually
```

| | Intrinsic (`synchronized`) | Explicit (`ReentrantLock`) |
|---|---|---|
| Create it? | No, every object has one | Yes, you instantiate it |
| Release it? | Automatic when block exits | Manual (`unlock()` in `finally`) |
| Try without blocking? | No | Yes (`tryLock()`) |
| Timeout? | No | Yes (`tryLock(5, SECONDS)`) |

---

## Key Properties

### Lock Target
The lock is on the **object**, not the code block — two `synchronized` blocks on the same object are mutually exclusive, even if they contain different code.

| Syntax | Locks on |
|---|---|
| `synchronized (obj) { }` | `obj` |
| `synchronized void foo()` | `this` |
| `static synchronized void foo()` | the `Class` object |

### Reentrant
If a thread **already holds** the lock, it can enter another `synchronized` block on the **same object** without deadlocking itself.

```java
public synchronized void methodA() {
    methodB();  // calls another synchronized method on `this`
}

public synchronized void methodB() {
    // Without reentrancy this would deadlock:
    // methodA holds the lock on `this`, methodB tries to acquire
    // the same lock → thread waits for itself forever
    //
    // But since synchronized IS reentrant, this works fine
}
```

### Visibility (Happens-Before)
`synchronized` solves both the CPU cache and reordering problems (see [[cpu_cache_and_memory_visibility]]).

```java
synchronized (lock) {
    value = 42;
    ready = true;
}  // exiting → flushes ALL changes to main memory

synchronized (lock) {
    // entering → reads fresh values from main memory
    // guaranteed to see: value=42, ready=true
}
```

**Rule**: everything Thread A did **before releasing** the lock is visible to Thread B **after acquiring** the same lock.

---

## Monitor Lock Internals
The JVM optimizes `synchronized` with three lock states:

| State | When | How | Cost |
|---|---|---|---|
| **Biased** | Only one thread ever uses the lock | Stamps thread ID in object header, no real locking | Near zero |
| **Thin (lightweight)** | Low contention (few threads) | [[compare_and_swap]] to acquire — spin briefly if contended | Low |
| **Fat (heavyweight)** | High contention (many threads) | OS mutex — threads actually sleep and get woken | High |

- Escalation: biased → thin → fat (does **not** downgrade)
- This is why `synchronized` is fast in the common case (single thread / low contention)

---

## synchronized vs Alternatives

| Mechanism | When to Prefer |
|---|---|
| `synchronized` | Simple mutual exclusion, low contention |
| `ReentrantLock` | Need tryLock, timed lock, interruptible lock, or multiple conditions |
| `ReadWriteLock` | Many readers, few writers |
| `StampedLock` | Optimistic reads with occasional writes (Java 8+) |
| `ConcurrentHashMap.compute` | Atomic per-key operations without explicit locking |

---
## References
- [[cpu_cache_and_memory_visibility]]
- [[compare_and_swap]]
- [[java_double_checked_locking]]
- [[java_synchronization_pitfalls]]
- [[java_concurrency_guidelines]]
- [[java_concurrency_data_structures]]

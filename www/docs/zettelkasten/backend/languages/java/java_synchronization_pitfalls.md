🗓️ 13032026 1200

# java_synchronization_pitfalls

## What NOT to Synchronize On

| Bad Target | Why |
|---|---|
| `String` / `String.intern()` | String pool is JVM-global — **any code** synchronizing on the same string competes for the lock |
| `Integer`, `Long`, `Boolean` | Small values are cached (`Integer -128..127`) — same problem as interned strings |
| `this` (when exposed) | External callers can `synchronized(yourObj)` and interfere |
| Class literals in libraries | Other code may lock on the same `Class` object |

## Safe Alternative: Private Lock Objects
```java
// Per-instance lock
private final Object lock = new Object();

// Per-key lock map
private final ConcurrentHashMap<String, Object> locks = new ConcurrentHashMap<>();

Object lock = locks.computeIfAbsent(appId, k -> new Object());
synchronized (lock) {
    // safe — lock is private to this class
}
```

---
## References
- [[java_synchronized]]

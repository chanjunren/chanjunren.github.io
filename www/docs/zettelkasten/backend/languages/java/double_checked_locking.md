🗓️ 13032026 1200

# double_checked_locking

```mermaid
sequenceDiagram
    participant T1 as Thread A
    participant T2 as Thread B
    participant I as Instance field
    T1->>I: First volatile read: null
    T1->>T1: Acquire class lock
    T1->>I: Second read: null
    T1->>I: Construct and publish instance
    T2->>I: Volatile read observes instance
    Note over T2: Constructor writes are visible
```

## Pattern
```java
CachedToken current = tokenCache.get(appId);
if (current != null && !current.isExpired()) {
    return current.token;  // fast path — no lock needed
}
synchronized (lock) {
    // re-check: another thread may have refreshed while we waited for the lock
    current = tokenCache.get(appId);
    if (current != null && !current.isExpired()) {
        return current.token;
    }
    return refreshToken(appConfig);
}
```

## Why Two Checks?
- **First check** avoids locking when value is already cached (majority of calls)
- **Second check** inside `synchronized` prevents duplicate refresh from racing threads

## Visibility Requirement
The shared variable must be safely published. Either:
- Use `volatile` on the reference, or
- Use a thread-safe collection (e.g. `ConcurrentHashMap`) so readers see the latest write

Without proper visibility guarantees, the first (unsynchronized) check may read a **partially constructed** object due to instruction reordering (see [[cpu_cache_and_memory_visibility]]).

---
## References
- [[synchronized]]
- cpu cache and memory visibility

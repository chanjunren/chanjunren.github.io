🗓️ 06022026 1116

# caffeine-refresh-vs-expire

## Overview

| Feature         | `expireAfterWrite`                            | `refreshAfterWrite`                                  |
|-----------------|-----------------------------------------------|------------------------------------------------------|
| **Behavior**    | Entry is **removed** after duration           | Entry is **refreshed** asynchronously after duration |
| **Stale reads** | No (returns null or recomputes synchronously) | Yes (returns stale value while refreshing)           |
| **Blocking**    | Yes (on cache miss)                           | No (refresh happens in background)                   |
| **Use case**    | Data that must not be stale                   | Data where eventual consistency is acceptable        |

## expireAfterWrite

Entries are **evicted** after the specified duration. The next request will block while the value is recomputed.

```java
LoadingCache<String, User> cache = Caffeine.newBuilder()
    .expireAfterWrite(5, TimeUnit.MINUTES)
    .build(key -> userService.fetchUser(key));

// After 5 minutes, entry is removed
// Next get() blocks until fetchUser() completes
User user = cache.get("user123");
```

**Timeline:**
```
t=0    -> cache.get("A") -> MISS, blocks, fetches, returns fresh value
t=4min -> cache.get("A") -> HIT, returns cached value
t=6min -> cache.get("A") -> MISS (expired), blocks, fetches, returns fresh value
```

## refreshAfterWrite

Entries are **refreshed asynchronously** after the specified duration. The stale value is returned immediately while refresh happens in the background.

```java
LoadingCache<String, User> cache = Caffeine.newBuilder()
    .refreshAfterWrite(5, TimeUnit.MINUTES)
    .expireAfterWrite(10, TimeUnit.MINUTES)  // recommended: set expiry as upper bound
    .build(key -> userService.fetchUser(key));

// After 5 minutes, entry is marked for refresh
// get() returns stale value immediately, triggers async refresh
User user = cache.get("user123");
```

**Timeline:**
```
t=0    -> cache.get("A") -> MISS, blocks, fetches, returns fresh value
t=4min -> cache.get("A") -> HIT, returns cached value
t=6min -> cache.get("A") -> HIT (stale), returns cached value, triggers async refresh
t=6min+1ms -> refresh completes in background, cache updated
t=7min -> cache.get("A") -> HIT, returns fresh value
```

## Key Differences

### 1. Blocking Behavior

```java
// expireAfterWrite: blocks on expired entry
cache.get("key"); // blocks if expired

// refreshAfterWrite: never blocks (returns stale)
cache.get("key"); // returns immediately, even if stale
```

### 2. Combined Usage (Recommended)

Always pair `refreshAfterWrite` with `expireAfterWrite` as a **failsafe**:

```java
Caffeine.newBuilder()
    .refreshAfterWrite(1, TimeUnit.MINUTES)   // refresh after 1 min
    .expireAfterWrite(5, TimeUnit.MINUTES)    // hard expiry after 5 min
    .build(loader);
```

**Why is expireAfterWrite needed?**

`refreshAfterWrite` only triggers **on access**. The expiry acts as a safety net for edge cases:

| Scenario                 | Without expireAfterWrite         | With expireAfterWrite   |
| ------------------------ | -------------------------------- | ----------------------- |
| Key never accessed again | Stale data sits in cache forever | Evicted after 5 min     |
| Refresh throws exception | Stale value remains indefinitely | Evicted after 5 min     |
| Refresh keeps failing    | Data becomes arbitrarily old     | Hard limit on staleness |

**In normal operation** (frequent reads, successful refreshes), expireAfterWrite rarely triggers — the refresh keeps the entry fresh. It's a **worst-case bound**, not for typical flow.

## When to Use What

| Scenario | Recommendation |
|----------|----------------|
| User session data | `expireAfterWrite` (security-sensitive) |
| Config/settings | `refreshAfterWrite` + `expireAfterWrite` |
| External API responses | `refreshAfterWrite` + `expireAfterWrite` |
| Rate limit counters | `expireAfterWrite` (must be accurate) |
| Feature flags | `refreshAfterWrite` (eventual consistency OK) |


---
## References

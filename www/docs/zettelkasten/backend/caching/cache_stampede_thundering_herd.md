🗓️ 29042026 1945
📎 #caching #reliability #patterns

# cache_stampede_thundering_herd

> When a single popular cache entry expires, every concurrent reader misses simultaneously and stampedes the source. Different vocabulary in different communities, same mechanism: "thundering herd" (Unix), "cache stampede" (web), "cache breakdown / 击穿" (Chinese tech blogs).

## The Mechanism

```
t=0: 10k requests/sec, cache hit, source untouched
t=10: cache entry expires
t=10.001: first request misses → starts recomputing
t=10.001 → 10.050: 500 more requests miss → all start recomputing the same value
t=10.050: first request finishes, sets cache
t=10.051 → 10.100: requests now hit cache again, but source took 500x its normal load
```

The cache provided zero protection during the recomputation window. If recompute is expensive (a DB query, an API call, a computation), the source can collapse.

## Solutions

### 1. Mutex / Single-Flight

Only one request recomputes; others wait on the result.

**Pseudo-code:**

```
get(key):
  v = cache.get(key)
  if v: return v
  # try to acquire lock
  if cache.setnx("lock:" + key, 1, ttl=5s):
    v = source.fetch(key)
    cache.set(key, v, ttl)
    cache.del("lock:" + key)
    return v
  else:
    # another request is recomputing; wait briefly and retry
    sleep(jitter)
    return get(key)
```

**Tools that implement this:**
- Go: `singleflight.Group.Do(key, fn)`
- Java: Caffeine `LoadingCache.get(key, loader)` deduplicates concurrent loads
- Python: `aiocache.Cache.get_or_set` with lock=True
- Redis-backed: `SET lock:key val NX PX 5000` for cross-process

**Trade-off:** waiting requests are blocked or polling. Tail latency increases for the unlucky few.

### 2. Refresh-Ahead

Recompute the value before it expires, while serving the old one.

```
get(key):
  v, age = cache.get(key)
  if age > 0.8 * ttl:
    async_recompute(key)        # background refresh
  return v
```

The hot key never produces a synchronous miss. Cold keys still go through the normal path.

**Pros**: zero latency penalty for hot keys.

**Cons**: complexity (need async machinery); wasted recomputes for keys that were about to go cold; doesn't help the very first request.

### 3. Probabilistic Early Expiration (XFetch)

Each read has a small chance to recompute before expiry, scaling with proximity to TTL.

```
should_refresh(remaining_ttl, recompute_time):
  return random() < (recompute_time / remaining_ttl) * beta
```

Spreads the recompute across many requests rather than concentrating at expiry.

**Pros**: no coordination, no locks, no async machinery.

**Cons**: math-heavy; tuning `beta` requires understanding of recompute distribution.

Reference: Vattani et al., "Optimal Probabilistic Cache Stampede Prevention" (2015).

### 4. Stale-While-Revalidate

Serve the stale value while a background process refreshes. Common in HTTP caches (`Cache-Control: stale-while-revalidate=...`).

```
get(key):
  v, fresh = cache.get(key)
  if not fresh:
    async_recompute(key)
  return v       # may be stale, but that's OK
```

Application must tolerate brief staleness. Good for content that changes slowly.

### 5. Never-Expiring Hot Keys

Manage the hot set explicitly:
- Pin in cache (no TTL).
- Background job refreshes them on a schedule.
- Eviction protected by tier or pinning.

Most operational, least clever. Good for the top 1% of keys you can identify.

## Choosing

- **Default**: single-flight. Simple, correct, available in most languages.
- **Hot, predictable keys**: refresh-ahead or pinning.
- **Many keys, math-tolerant team**: probabilistic early expiration.
- **Content-style data**: stale-while-revalidate.

## Common Pitfalls

- **No lock TTL** — if the recomputing request crashes, the lock never releases. Other requests wait forever (or fail). Always set a lock TTL.
- **Lock TTL shorter than recompute time** — lock expires, second request also recomputes. You're back to the stampede with extra latency.
- **Polling without backoff** — waiting requests hammer the cache checking for the result. Use sleep + jitter or pubsub.
- **Refresh-ahead too aggressive** — refreshing at 50% TTL means roughly 2x the source load. Tune the threshold.
- **Single-flight scope is per-process** — if 10 app instances each miss simultaneously, you have 10 source calls. Cross-process single-flight needs a Redis lock.

## Related

- [[cache_aside]] — the pattern this protects against.
- [[cache_penetration_breakdown_avalanche]] — same mechanism as "breakdown".
- [[redis_distributed_lock]] — cross-process single-flight implementation.
- `circuit_breaker_pattern` *(planned)* — fallback when the source can't keep up regardless.

---

## References

- Vattani, Chierichetti, Lowenstein, "Optimal Probabilistic Cache Stampede Prevention" (VLDB 2015)
- HTTP RFC 5861: [stale-while-revalidate](https://www.rfc-editor.org/rfc/rfc5861)
- Caffeine docs: [Population](https://github.com/ben-manes/caffeine/wiki/Population)

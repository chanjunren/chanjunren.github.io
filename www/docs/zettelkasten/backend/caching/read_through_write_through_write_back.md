🗓️ 29042026 1915
📎 #caching #patterns

# read_through_write_through_write_back

> The three patterns where the cache itself manages persistence — alternatives to [[cache_aside]] for cases where the application shouldn't (or can't) drive cache logic explicitly.

## The Three Patterns

```ad-abstract
**Read-through** — on miss, the cache fetches from the source, populates itself, and returns.
**Write-through** — application writes to the cache; the cache writes synchronously to the source before returning.
**Write-back / write-behind** — application writes to the cache; the cache asynchronously batches writes to the source.
```

In all three, the cache participates in the path. Compare to [[cache_aside]] where the cache is "on the side" and the app drives invalidation.

## Read-through

```
read(key):
  return cache.get(key)
  # cache library handles miss → fetch → populate transparently
```

The application sees a single API: `cache.get(key)`. The cache library knows how to load on miss (configured via a loader function or DAO).

**Pros**: app code is simpler. Cache and source are tightly integrated.

**Cons**: hides failures (a slow source slows every miss). Couples app to a specific cache library's loader API. Hard to swap caches.

**Used in**: Caffeine (Java) `LoadingCache`, Guava cache, AWS ElastiCache with read-through, Spring `@Cacheable`.

## Write-through

```
write(key, v):
  cache.set(key, v)        # cache writes to source synchronously
  # source write happens before cache returns
```

Every write goes through the cache and waits for the source to confirm. The cache is always consistent with the source.

**Pros**: no read/write race; reads after writes always see the new value. Stronger consistency than cache-aside.

**Cons**: writes are slow (cache RTT + source RTT). Requires a write path through the cache, which not all systems support (Redis doesn't natively; you build it on top).

**Used in**: write-through caches in DBs (InnoDB buffer pool with `O_SYNC`-like semantics), some CDN edge caches, Memcached + custom write-through wrapper.

## Write-back (Write-behind)

```
write(key, v):
  cache.set(key, v)        # returns immediately
  # cache asynchronously batches writes to source later
```

The cache acks the write before the source has the value. The source catches up on a timer or batch threshold.

**Pros**: very fast writes. Coalesces multiple writes to the same key (only the last one hits the source). Buffers spikes.

**Cons**: the source lags the cache — readers querying the source directly see stale data. Cache crash before flush = **data loss**. Requires durable cache or replication for any safety.

**Used in**: CPU caches (the original write-back), database buffer pools, log-structured merge trees, click counters, view counters where loss is tolerable.

## Comparison Table

| Pattern        | App writes to | Source updated | Read-after-write | Failure mode                      |
|----------------|---------------|----------------|------------------|-----------------------------------|
| Cache-aside    | Source        | Always         | Eventual (after invalidate) | Stale data if invalidate missed |
| Read-through   | Source        | Always         | Same as cache-aside | Slower miss path (hidden)      |
| Write-through  | Cache         | Synchronously  | Immediate (consistent) | Slow writes                  |
| Write-back     | Cache         | Asynchronously | Immediate (cache); lagged (source) | **Data loss on cache crash** |

## Choosing

- **Cache-aside** for typical web apps. App-driven, robust, well-understood.
- **Read-through** when you want to hide caching from business code (e.g. Spring `@Cacheable`).
- **Write-through** for stronger consistency on writes when latency budget allows.
- **Write-back** for write-heavy ephemeral data (counters, logs, telemetry) where loss windows are acceptable.

## Common Pitfalls

- **Write-back without durability is dangerous** — a crash loses every unflushed write. Use replicated cache or persist-on-write to local disk before acking.
- **Mixing patterns** — different code paths using different patterns for the same key produces confused invalidation. Pick one per cache.
- **Read-through hides slow source** — your "cache hit rate" looks fine but tail latency on misses is hidden inside the cache layer. Monitor source latency separately.
- **Write-through on a slow source** — cache write throughput becomes source write throughput. If your source can do 1k writes/sec, neither can your cache.
- **Eviction with write-back** — if the cache evicts a dirty (unflushed) entry, you lose the write. Pin or block eviction of dirty entries; flush before eviction.

## Related

- [[cache_aside]] — the more common alternative.
- [[cache_stampede_thundering_herd]] — read-through with naive miss handling can stampede.
- [[redis_cluster]] — write-through to a clustered Redis is non-trivial under partition.
- `outbox_pattern` — for write-back-like behaviour with durability guarantees.

---

## References

- AWS docs: [Caching Best Practices](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Strategies.html)
- Caffeine docs: [LoadingCache](https://github.com/ben-manes/caffeine/wiki/Population)

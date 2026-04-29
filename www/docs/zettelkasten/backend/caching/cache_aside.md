🗓️ 29042026 1900
📎 #caching #patterns

# cache_aside

> The default caching pattern in production. The application reads from cache, falls back to the source on miss, and invalidates the cache on writes — the cache is "on the side", not in the write path.

## The Read Path

```
read(key):
  v = cache.get(key)
  if v is not null:
    return v                  # cache hit
  v = db.get(key)             # cache miss
  cache.set(key, v, ttl)
  return v
```

The cache is **never authoritative**. The DB is. Cache is a performance shortcut.

## The Write Path

Two reasonable choices on writes:

```
# Option A: invalidate
write(key, v):
  db.update(key, v)
  cache.delete(key)

# Option B: update
write(key, v):
  db.update(key, v)
  cache.set(key, v, ttl)
```

**Almost always pick Option A (delete, not update).** The reason is the read/write race below.

## The Read/Write Race

Sequence with Option B (update on write):

```
T1 reads cache → miss → reads DB(v=1) → ...slow...
T2 writes DB(v=2) → updates cache(v=2)
T1 ...continues... → sets cache(v=1)   ← stale wins
```

T1's stale read clobbers T2's fresh write. Result: cache stuck on v=1 until TTL.

With Option A (delete on write):

```
T1 reads cache → miss → reads DB(v=1) → ...slow...
T2 writes DB(v=2) → deletes cache
T1 ...continues... → sets cache(v=1)   ← still stale!
```

Same race exists with delete. The fix is **double-delete** (delete cache, write DB, delete cache again after a short delay) — but in practice the TTL plus low race probability make a single delete acceptable for most workloads. Strict consistency needs a different pattern (write-through, or change-data-capture-driven invalidation).

## Why Cache-Aside Wins by Default

- **App stays in control** — the cache is dumb, the app drives all logic. Easy to swap caches.
- **Failures isolated** — cache down means slow reads, not broken writes. App still works.
- **Simple mental model** — read-through-fallback is universally understood.
- **No vendor lock-in** — pattern works over any KV store (Redis, Memcached, in-memory).

## Common Pitfalls

- **Update-on-write** is tempting but produces the race above. Default to delete.
- **Cache penetration** — many requests for keys that don't exist in DB. Each miss queries the DB. Cache the negative result (with shorter TTL) or gate with a [[bloom_filter]]. See [[cache_penetration_breakdown_avalanche]].
- **Cache stampede** — popular key expires; many concurrent reads all miss; all hit DB. See [[cache_stampede_thundering_herd]].
- **TTL too long** — stale reads after writes when delete is missed (e.g. invalidation message lost). Tune TTL to the staleness budget you can tolerate.
- **TTL too short** — defeats the purpose; mostly misses.
- **Inconsistency window** — between DB write and cache delete, readers see stale. Acceptable for most use cases; if not, switch to write-through.
- **Forgetting to delete** in some write paths — the most common cause of mysterious stale data. Centralise writes through a single repository layer to make invalidation harder to skip.

## When Not to Use

- **Strong consistency required** — use write-through (cache is in the write path) or no cache.
- **Write-heavy workload** — invalidations dominate; reads can't amortise the cost.
- **Compute-on-read** — if the cached value is expensive to recompute, prefer refresh-ahead (recompute before expiry) to avoid stampedes.

## Related

- [[read_through_write_through_write_back]] — alternative patterns where the cache participates in writes.
- [[cache_penetration_breakdown_avalanche]] — three classic failure modes layered on cache-aside.
- [[cache_stampede_thundering_herd]] — what happens when one hot key expires.
- [[redis_cluster]] — the storage-layer fragility under multi-key access.
- [[bloom_filter]] — gating cache misses for non-existent keys.

---

## References

- "Designing Data-Intensive Applications" ch. 1 (caching as derived data)
- AWS docs: [Caching strategies](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Strategies.html)

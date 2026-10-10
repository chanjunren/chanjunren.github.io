🗓️ 29042026 1945

# cache_stampede

A **cache stampede** happens when concurrent misses trigger duplicate loads of the same result. An expired hot key, called breakdown (击穿), is one trigger; cold starts and eviction can trigger it too.

A **thundering herd** is the broader pattern of many workers waking or competing together.

## Why recomputation time matters

At 1,000 requests/second, a 0.5-second load window can admit about 500 requests. Without coordination, each may load the same value.

That estimate assumes steady traffic and no other limits. Slower source responses widen the window.

## Coalesce loads

**Single-flight** lets one caller load a key while others share its result.

Schematic flow:

```text
read(key):
  if cache has a usable entry:
    return entry
  return singleflight(key, function:
    recheck cache
    if a usable entry exists:
      return entry
    value = source.fetch(key)
    cache.set(key, value, ttl)
    return value)
```

Rechecking avoids loading a value filled while the caller waited.

Go's `singleflight.Group.Do` suppresses duplicate calls for a key within that group. Separate instances still have separate groups. Caffeine supports atomic compute-and-insert through `Cache.get(key, loader)`.

## Shared coordination

A [[redis_distributed_lock]] can reduce duplicate loads across processes.

- Acquire with a unique token and expiration.
- Recheck the cache after acquisition.
- Release atomically only if the token matches.
- Bound waiting; retry with backoff and jitter.

Expiration during a load can admit another loader. Token-checked release protects the lock; it does not stop an older loader publishing stale data. Use [[cache_consistency]] controls when ordering matters.

## Refresh strategies

| Strategy | Behavior | Boundary |
| --- | --- | --- |
| Refresh-ahead | Refresh before the entry expires. | Cold misses remain; refreshes need coordination. |
| Stale-while-revalidate | Serve an old entry during background refresh. | Bound stale age and coalesce refreshes. |
| Managed hot entries | Refresh selected entries without relying on TTL. | Eviction and failed refreshes still matter. |
| Probabilistic early refresh | Randomly refresh near expiry. | Reduces duplication; does not exclude it. |

Caffeine's `refreshAfterWrite` makes entries eligible for refresh. A read triggers it; it is not a periodic job.

## Probabilistic early refresh

XFetch samples an exponentially distributed early-refresh window:

```text
u = random strictly between 0 and 1
window = -recompute_time * beta * ln(u)
refresh if remaining_ttl <= window
```

`recompute_time` is the previous load duration; `beta > 0` adjusts eagerness. Larger windows become more likely to cover the remaining TTL near expiration. Keep normal loading for missing entries.

## References

- [Go: singleflight](https://pkg.go.dev/golang.org/x/sync/singleflight)
- [Caffeine: Population](https://github.com/ben-manes/caffeine/wiki/Population)
- [Caffeine: Refresh](https://github.com/ben-manes/caffeine/wiki/Refresh)
- [Redis: Distributed locks](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)
- [RFC 5861: HTTP stale-response extensions](https://www.rfc-editor.org/rfc/rfc5861)
- [Vattani et al.: Optimal Probabilistic Cache Stampede Prevention](https://cseweb.ucsd.edu/~avattani/papers/cache_stampede.pdf)

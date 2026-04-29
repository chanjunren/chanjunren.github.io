🗓️ 29042026 1930
📎 #caching #reliability

# cache_penetration_breakdown_avalanche

> Three distinct cache failure modes that all end the same way: the database gets buried. Each has a specific cause and a specific fix — confusing them leads to the wrong mitigation.

## The Three Modes

```ad-abstract
**Penetration** (穿透) — requests for keys that don't exist in the source. Every lookup misses the cache, then misses the DB. The cache provides zero protection.
**Breakdown** (击穿) — a single hot key expires. Concurrent reads all miss simultaneously and stampede the DB recomputing the same value.
**Avalanche** (雪崩) — many keys expire at once (often because they were populated together with the same TTL). A traffic spike floods the DB.
```

## Penetration

### What's happening

```
client → cache(MISS) → db(NOT FOUND) → null
client → cache(MISS) → db(NOT FOUND) → null   (every request)
```

The cache cannot help when the data is genuinely absent. Common causes:
- Scraping or scanning for nonexistent IDs.
- Malicious traffic probing keys (`/user/-1`, `/user/0`, `/user/9999999`).
- Bug emitting bad keys.

### Mitigations

| Approach              | Mechanism                                    | Trade-off                          |
|-----------------------|----------------------------------------------|------------------------------------|
| **Cache the null**    | Store `null` (or sentinel) with short TTL    | Wastes a bit of cache space; brief staleness if the row is later inserted |
| **[[bloom_filter]]**  | Probabilistic gate; reject keys "definitely not in DB" | False positives still hit DB (rare); cannot remove from filter without rebuilding |
| **Input validation**  | Reject impossible keys at API boundary        | Catches the easy cases only       |
| **Rate limit per IP** | Slows attacker; doesn't fix benign traffic    | Adds a layer to operate           |

In practice: cache-the-null + bloom filter is the textbook combo.

## Breakdown

### What's happening

A single very hot key expires. Between the moment of expiry and the moment one request finishes recomputing it, every other in-flight request also misses → all hit the DB → all run the same expensive query.

```
t=0: cache holds key, 1000 reads/sec serve from cache
t=10: key expires
t=10.001 → t=10.500: 500 concurrent misses, all query DB
t=10.500: one of them sets cache; rest also try to set
t=10.501: cache restored
```

### Mitigations

| Approach                    | Mechanism                                                    |
|-----------------------------|--------------------------------------------------------------|
| **Mutex / single-flight**   | Only one request recomputes; others wait on the result       |
| **Refresh-ahead**           | Periodically refresh hot keys before expiry — they never miss |
| **Never expire hot keys**   | Manage hot keys explicitly, refresh from a background job    |
| **Probabilistic early refresh** | Each request has small chance to refresh before TTL — spreads load |

`singleflight.Group` (Go), `Caffeine.LoadingCache` (Java), or a Redis-based mutex (`SET key val NX PX 5000`) all solve this. See [[cache_stampede_thundering_herd]] for the broader pattern.

## Avalanche

### What's happening

Many keys expire near-simultaneously. The DB gets a sudden surge of traffic.

Common cause: bulk warm-up populated keys at the same instant with the same TTL → they all expire at the same instant.

```
t=0: 1M keys cached with TTL=3600s
t=3600: 1M keys expire simultaneously
t=3601: spike of 1M misses → DB overload → cascading failure
```

Worse cause: cache cluster restart or region failover wipes everything at once.

### Mitigations

| Approach                | Mechanism                                                                  |
|-------------------------|---------------------------------------------------------------------------|
| **TTL jitter**          | Spread TTL randomly (e.g. `3600 + random(-300, +300)` seconds) so expiries scatter |
| **Multi-tier cache**    | L1 (in-process) absorbs while L2 (Redis) recovers; L2 cushions DB         |
| **Circuit breaker**     | Detect DB overload; serve stale-from-secondary or degrade gracefully       |
| **Pre-warm on deploy**  | Restore hot keys before opening traffic                                    |
| **Pin critical keys**   | A small set of always-cached keys with refresh-ahead, never relying on TTL |

## Distinguishing the Three

| Symptom                                  | Most likely cause     |
|------------------------------------------|------------------------|
| DB load high; cache hit rate suspiciously low; lots of unique missing keys | Penetration |
| DB spike on one specific query that's normally fast and cached | Breakdown |
| DB spike across many queries simultaneously, often at a regular interval | Avalanche |

## Common Pitfalls

- **Treating breakdown and stampede as different things** — they're the same mechanism. Different vocabulary, same fix (single-flight or refresh-ahead).
- **Setting TTL=0 (no expiry) without a refresh strategy** — the cache becomes stale forever; eventual config drift.
- **Bloom filter without rebuild plan** — once data is added to the source, the filter must be rebuilt to recognise it. Stale filters reject valid keys.
- **Cache-the-null forever** — short TTL is essential; otherwise newly-created entities stay invisible.
- **Single Redis node as cache** — when it fails, every request falls through to DB. Avalanche by failover. Use a clustered cache or a shared L1 layer.

## Related

- [[cache_aside]] — the underlying pattern these modes attack.
- [[cache_stampede_thundering_herd]] — same mechanism as breakdown.
- [[bloom_filter]] — penetration mitigation.
- [[redis_cluster]] — failover behaviour relevant to avalanche.

---

## References

- Aliyun docs: [Cache penetration / breakdown / avalanche](https://help.aliyun.com/document_detail/26380.html)
- Mailinator: ["Mailinator Architecture"](http://mailinator.blogspot.com/2007/01/architecture-of-mailinator.html) — early discussion of stampede

🗓️ 11102026 0132

# cache_penetration

**Cache penetration** (穿透) is repeated source traffic for nonexistent data. If absence is never cached, every lookup repeats the unsuccessful source query.

## Negative caching

Store an explicit `NOT_FOUND` result with a short TTL. Distinguish it from a missing cache entry.

```text
first lookup: cache miss → source absent → cache NOT_FOUND
next lookup:  cache hit  → return NOT_FOUND
```

After the entity is created, invalidate that negative entry or wait for its expiry.

Do not interpret a timeout as proof of absence. Cache authoritative absence separately from transient failures.

## Choose a defense

| Defense | Helps with | Boundary |
| --- | --- | --- |
| Negative caching | Repeated queries for the same absent key. | Unique random keys still miss. |
| [[bloom_filter]] | Rejecting keys absent from the represented set. | Must include newly valid keys. |
| Input validation | Impossible identifiers. | Valid-looking absent keys still pass. |
| Rate limiting | Excessive lookup volume. | Does not establish whether data exists. |

Negative entries also need capacity limits. Large numbers of unique absent keys can displace useful data.

Contrast with [[cache_stampede]], where many readers need the same valid result.

## References

- [AWS: Caching challenges and strategies](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/)
- [Redis: Bloom filter](https://redis.io/docs/latest/develop/data-types/probabilistic/bloom-filter/)

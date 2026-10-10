🗓️ 11102026 0132

# write_through

**Write-through** updates the source and cache during the write operation. Success waits for both required updates.

A cache writer can coordinate this, or the application can. [[read_through]] is a separate choice about reads.

## Write path

A common application-managed sequence:

```text
source.commit(key, value)
cache.set(key, value)
acknowledge success
```

The cache is populated before success is returned. An implementation must also define what happens when only one update succeeds.

## Trade-offs

- Successful writes populate future reads.
- Write latency includes both systems.
- Unread values still consume cache capacity.

## Consistency requires coordination

Suppose the source commit succeeds but the cache update fails. Reporting failure does not undo the committed write. Define retry, invalidation, and recovery behavior.

Concurrent writers or older cache fills can overwrite newer entries. Source writes bypassing the cache also leave it stale. The pattern alone does not guarantee strong [[cache_consistency]].

Use [[write_back]] when source persistence is deferred.

## References

- [AWS: Caching strategies](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html)
- [Ehcache: Write-through and write-behind caching](https://www.ehcache.org/documentation/2.8/apis/write-through-caching.html)

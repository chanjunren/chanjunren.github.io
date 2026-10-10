🗓️ 11102026 0132

# write_back

**Write-back**, also called **write-behind**, accepts a write before persisting it to the backing source. Pending writes must survive until they are flushed.

Unlike [[cache_aside]], the cache or its queue may hold the only current copy.

## Write path

```text
write → accept into cache or queue → acknowledge
                                  → flush to source later
```

Reads from the source can lag reads from the cache.

Batching combines writes into fewer operations. Coalescing keeps the latest pending value per key when intermediate updates can be discarded.

## Durability and ordering

An in-memory pending queue can lose acknowledged writes on a crash. A durable queue improves recovery; replication alone does not define the acknowledgment guarantee.

Eviction or expiration must not discard the only unflushed value. Preserve it in a queue or flush before removal.

Retries and concurrent flushes need ordering or version checks. Otherwise an older queued update can overwrite a newer one.

## When it fits

Useful when write latency or batching justifies deferred persistence. Define the permitted loss and lag before using it.

If success must wait for source persistence, use [[write_through]].

## References

- [Ehcache: Write-through and write-behind caching](https://www.ehcache.org/documentation/2.8/apis/write-through-caching.html)

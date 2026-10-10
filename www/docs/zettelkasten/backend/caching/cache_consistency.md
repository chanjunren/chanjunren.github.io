🗓️ 11102026 0132

# cache_consistency

**Cache consistency** describes how cached results relate to source updates. A cache adds another copy; keeping it fresh requires an explicit protocol.

Choose the required [[consistency_models]] before choosing a caching pattern.

## Why invalidation can still leave stale data

This possible interleaving follows the [[cache_aside]] read and write paths:

```text
A: cache miss; reads source version 1; pauses
B: commits source version 2; deletes cached entry
A: resumes; caches version 1
C: cache hit; reads version 1
```

Updating the cache instead of deleting it permits the same overwrite. Deletion alone does not order in-flight readers.

Deleting before committing creates another window: readers can reload the old source value before the write completes.

## What each mechanism provides

| Mechanism | Benefit | Remaining boundary |
| --- | --- | --- |
| TTL | Limits reuse of each cached entry. | Stale replicas can refill stale entries. |
| Invalidation after commit | Removes the previously cached value. | In-flight readers can repopulate it. |
| Delayed second deletion | Clears stale fills completed before that deletion. | Timing is heuristic; later fills still race. |
| Invalidation through events | Separates delivery from the request path. | Delivery lag and stale fills remain. |
| Conditional versioned updates | Rejects older fills against a retained newer version. | All writers must use the protocol. |

A delayed second deletion is not a consistency guarantee. An [[outbox_pattern]] can make invalidation events durable; it does not make delivery instantaneous.

## Define the read contract

**Read-your-writes** means a reader observes its own completed update. It is narrower than requiring every reader to see the latest committed value.

[[write_through]] waits for both updates, but still needs concurrency ordering and partial-failure handling. Its name alone does not promise strong consistency.

For decisions requiring current authoritative data, read the appropriate source directly. Specify its isolation and replica behavior too.

## References

- [Microsoft: Cache-Aside pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)
- [Microsoft: Caching guidance](https://learn.microsoft.com/en-us/azure/architecture/best-practices/caching)

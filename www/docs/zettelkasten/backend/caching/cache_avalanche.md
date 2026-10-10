🗓️ 11102026 0132

# cache_avalanche

A **cache avalanche** (雪崩) is a broad surge of misses that overloads the source. Many entries may expire together, or a cache outage may redirect normal hits to the source.

## Why failures spread

For example, a bulk warm-up gives many entries the same one-hour TTL. An hour later, normal requests reload them together.

The source slows under the surge. Requests remain in flight longer, and retries can add more work.

## Match protection to the cause

| Cause | Protection | Boundary |
| --- | --- | --- |
| Aligned expirations | Add bounded random variation to TTLs. | Does not help a cache outage. |
| Cold startup | Warm hot entries; ramp traffic gradually. | Warm-up itself consumes source capacity. |
| Shared-cache outage | Retain usable local entries where appropriate. | Local caches can also be cold or stale. |
| Source overload | Bound fallback concurrency; shed excess load. | Some requests must fail or degrade. |

A **circuit breaker** temporarily stops calls to a failing dependency. Serving stale data is an option only where its age is acceptable.

Use [[retry_backoff_jitter]] to spread retries. Single-flight from [[cache_stampede]] helps per key, but cannot cap source work across many different keys.

## References

- [AWS: Caching challenges and strategies](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/)

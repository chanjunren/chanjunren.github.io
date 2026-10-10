🗓️ 11102026 0132

# read_through

**Read-through** gives the cache a loader that fetches missing values. The application requests a value through one API.

It changes who loads a miss. It does not determine how writes reach the source.

## Read path

```text
application → cache.get(key)
                hit  → return cached value
                miss → loader.fetch(key) → cache → return value
```

For example, Caffeine's `LoadingCache` attaches a loader to `get(key)`.

With [[cache_aside]], the application performs these steps explicitly.

## Trade-offs

- Simplifies application reads.
- Couples loading to the cache API.
- Source failures still affect cache misses.
- Writes still need a freshness strategy.

Pair it with [[write_through]], [[write_back]], or source writes with invalidation.

Check whether the implementation coalesces concurrent loads. Read-through alone does not prevent [[cache_stampede]].

## References

- [Caffeine: Population](https://github.com/ben-manes/caffeine/wiki/Population)

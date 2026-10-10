🗓️ 29042026 1930

# cache_failures

These cache failure modes can all increase source load. Distinguish whether requests target absent data, one missing hot entry, or many missing entries.

## Compare mechanisms

| Mode | Trigger | First defense |
| --- | --- | --- |
| [[cache_penetration]] (穿透) | Requests for nonexistent data. | Negative caching or membership filtering. |
| Breakdown (击穿) | One hot entry expires or disappears. | Coalesce loads for that key. |
| [[cache_avalanche]] (雪崩) | Many misses or a cache outage. | Spread expiration; limit fallback load. |

Breakdown is the hot-key case of [[cache_stampede]]. A stampede can also start with a cold entry.

## Inspect before deciding

Check miss rates, key distribution, source results, and expiry timing.

- Repeated absent results suggest penetration.
- Concurrent loads for one key suggest a stampede.
- Broad misses suggest an avalanche.

These are clues, not proof. A slow source or traffic spike can produce similar symptoms; compare cache behavior with source latency and errors.

Start with [[cache_basics]] if entry lifecycle terms are unfamiliar.

## References

- [AWS: Caching challenges and strategies](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/)
- [Vattani et al.: Optimal Probabilistic Cache Stampede Prevention](https://cseweb.ucsd.edu/~avattani/papers/cache_stampede.pdf)

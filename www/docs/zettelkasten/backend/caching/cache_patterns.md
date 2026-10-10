🗓️ 29042026 1915

# cache_patterns

Read-through describes the read path. Write-through and write-back describe write acknowledgment and persistence. They are separate choices and can be combined.

## Compare responsibilities

| Pattern | Who handles a miss? | Write behavior |
| --- | --- | --- |
| [[cache_aside]] | Application | Source commit, then cache invalidation. |
| [[read_through]] | Cache loader | A separate write policy is required. |
| [[write_through]] | A separate read policy | Success waits for source and cache updates. |
| [[write_back]] | A separate read policy | Source persistence follows acknowledgment. |

## Choose by need

- Explicit application loading: [[cache_aside]].
- Loader-managed reads: [[read_through]].
- Synchronous source persistence and cache population: [[write_through]].
- Deferred persistence and batching: [[write_back]].

Specify [[cache_consistency]] and failure recovery separately. A pattern name does not establish either guarantee.

## References

- [AWS: Caching strategies](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html)
- [Ehcache: Write-through and write-behind caching](https://www.ehcache.org/documentation/2.8/apis/write-through-caching.html)

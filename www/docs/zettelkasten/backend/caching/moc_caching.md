🗓️ 29042026 2025
📎 #caching #moc

# moc_caching

> Map of Content for the caching concept cluster. Patterns + failure modes + the data structures that underpin both.

## Concept Order

### Core Patterns
1. [[cache_aside]] — the production default; app-driven, robust, well-understood.
2. [[read_through_write_through_write_back]] — alternatives where the cache participates in writes.

### Failure Modes
3. [[cache_penetration_breakdown_avalanche]] — three distinct cache-failure classes and their fixes.
4. [[cache_stampede_thundering_herd]] — single-flight, refresh-ahead, probabilistic early refresh.

### Supporting Data Structures
5. [[bloom_filter]] — probabilistic membership; the gate for cache penetration.

### Coordination
6. [[redis_distributed_lock]] — single-Redis lock, Redlock debate, fencing tokens.

### Existing in Cluster
- [[redis_cluster]] — sharding model, multi-key fragility.
- [[lettuce]] — Java Redis client.

### Planned
- `cache_eviction_policies` — LRU / LFU / ARC / W-TinyLFU.
- `redis_persistence_rdb_aof` — durability options for Redis.
- `redis_data_structures_advanced` — zset, streams, bitmaps, HyperLogLog.
- `redis_pipelining_vs_transactions_vs_lua` — three ways to batch on Redis.
- `multi_tier_cache` — L1 (in-process) + L2 (shared) layered design.
- `cdn_pull_push_models` — caching at the network edge.

## How to Use This MOC

- **First pass**: walk top-to-bottom; failure modes only make sense once the patterns are in your head.
- **Second pass**: pair each failure mode with the pattern most prone to it (e.g. cache-aside ↔ stampede ↔ penetration).
- **Application drill**: pick a real cache scenario (product catalog, user sessions, hot leaderboard) and choose the pattern + mitigations from this list.

## Bridges to Other Domains

- → DB internals: [[mvcc_innodb_read_view]], [[transaction_isolation_levels]] — read consistency under cache invalidation.
- → Distributed systems: [[consistency_models]], [[cap_theorem]] — the consistency story behind every caching decision.
- → Messaging: [[outbox_pattern]] — for cache invalidation via events instead of in-app delete.
- → Reliability: `circuit_breaker_pattern` *(planned)*, `retry_backoff_jitter` *(planned)*.

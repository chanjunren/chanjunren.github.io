🗓️ 29042026 1445
📎 #system_design #moc

# moc_system_design

> Map of Content for the system-design concept cluster. The framework, the math, and the canonical worked-out designs that exercise both.

## Concept Order

### Approach
1. [[system_design_framework]] — the six-step approach (requirements / capacity / API / data model / architecture / deep dive).
2. [[back_of_envelope_estimation]] — the latency numbers, capacity math, and the powers-of-ten that drive every sizing decision.

### Canonical Designs
3. [[design_url_shortener]] — read-heavy lookup; ID generation, caching, hot keys, sharding.
4. [[design_rate_limiter]] — distributed counter; algorithm choice, fail-open/closed, hot-key mitigation.
5. [[design_unique_id_generator_snowflake]] — distributed unique IDs; clock skew, machine ID assignment, bit budget.

### Planned
- `design_news_feed` — write fan-out vs read fan-out; hybrid for celebrities.
- `design_chat_system` — real-time delivery, presence, message ordering, group chats.
- `design_typeahead_autocomplete` — trie-based prefix lookup, ranking, distributed cache.
- `design_notification_system` — multi-channel (push/email/SMS), delivery guarantees, throttling.
- `design_distributed_cache` — consistent hashing, eviction, replication.
- `design_metrics_monitoring_system` — time-series storage, downsampling, query layer.
- `design_video_streaming` — adaptive bitrate, CDN, encoding pipeline.

## How to Use This MOC

- **First pass**: framework + estimation, then the three designs in order. Each design exercises the framework with different bottlenecks.
- **Second pass**: take a fourth problem (one of the planned ones, or any unfamiliar design from a textbook) and walk through all six framework steps before reading the worked solution. Compare your answer.
- **Application drill**: pair-design — explain a system to someone (or write it out). The point of the framework is the steps stay the same; the trade-offs change.

## Common Cross-Domain Decisions

These show up in nearly every design and benefit from the bridges below:

| Cross-cut                | Where to read                                              |
|--------------------------|------------------------------------------------------------|
| Sharding scheme           | [[database_sharding_strategies]], [[consistent_hashing]]   |
| Read-heavy caching        | [[cache_aside]], [[cache_stampede_thundering_herd]]        |
| Hot-key mitigation        | [[redis_cluster]], [[cache_stampede_thundering_herd]]      |
| Unique IDs                | [[design_unique_id_generator_snowflake]]                   |
| Async pipelines           | [[kafka_architecture]], [[outbox_pattern]]                 |
| At-least-once + idempotency | [[idempotent_consumer_pattern]], [[idempotency_keys_api_design]] |
| Cross-service consistency | [[saga_pattern]], [[two_phase_commit]]                     |
| Resilience pattern stack  | [[circuit_breaker_pattern]], [[retry_backoff_jitter]], [[rate_limiting_algorithms]] |

## Bridges to Other Domains

- → DB internals: [[moc_db_internals]] — sharding, indexing, isolation choices.
- → Distributed systems: [[moc_distributed_systems]] — CAP trade-offs underpinning every design.
- → Caching: [[moc_caching]] — patterns and failure modes for the read path.
- → Messaging: [[moc_messaging]] — async pipelines and delivery semantics.
- → API: [[moc_api_resilience]] — protocol-layer protections.

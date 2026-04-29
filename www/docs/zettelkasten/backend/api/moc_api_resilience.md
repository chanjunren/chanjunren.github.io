🗓️ 29042026 1315
📎 #api #reliability #moc

# moc_api_resilience

> Map of Content for the API + resilience-patterns concept cluster. Each zettel addresses a specific failure mode at the request boundary; together they form the standard "make this service survive its dependencies" toolkit.

## Concept Order

### Protocol Foundations
1. [[http_methods_idempotency_safety]] — what GET/PUT/DELETE/POST/PATCH formally promise.
2. [[http_status_codes_semantics]] — what 401/403/409/422/429/503 actually mean and how clients should react.

### Inbound Protection
3. [[rate_limiting_algorithms]] — fixed window / sliding window / token bucket / leaky bucket.

### Outbound Resilience
4. [[circuit_breaker_pattern]] — three-state breaker; companion to retry and timeout.
5. [[retry_backoff_jitter]] — exponential backoff, jitter schemes, retry budgets.

### Replay Safety
6. [[idempotency_keys_api_design]] — making POST safe to retry.

### Existing in Cluster
- [[reverse_proxy]] — the layer where many of these patterns sit (existing).
- [[api_gateway]] — concentrates rate limiting, auth, observability (existing).
- [[load_balancer]] — request distribution + health checking (existing).

### Planned
- `http_caching_headers` — Cache-Control / ETag / Last-Modified / Vary.
- `http2_http3_quic` — multiplexing, head-of-line blocking, QUIC.
- `websockets_sse_long_polling` — when to use which real-time mechanism.
- `bulkhead_pattern` — resource isolation companion to circuit breaker.
- `grpc_protobuf_basics` — RPC alternative.

## How to Use This MOC

- **First pass**: protocol → inbound → outbound → replay safety. Each layer assumes the previous.
- **Second pass**: pair each pattern with a real production failure mode. Circuit breaker without timeout? Won't help. Retry without idempotency keys? Doubles writes.
- **Application drill**: take a service that calls 3 downstreams (DB, cache, third-party API). Specify each protection layer for each call. Tune parameters with realistic numbers.

## The Standard Composition (Outer → Inner)

```
inbound: rate-limit → request validation → ...handler...
outbound (per dependency): bulkhead → timeout → circuit-breaker → retry → call
post-failure: idempotency-key dedup → fallback → response
```

Memorising this stack is more valuable than memorising any single pattern in isolation.

## Bridges to Other Domains

- → DB internals: [[transaction_isolation_levels]], [[mvcc_innodb_read_view]] — what your retries see in the DB.
- → Caching: [[cache_stampede_thundering_herd]], [[cache_aside]] — same jitter principle on cache misses.
- → Messaging: [[idempotent_consumer_pattern]], [[outbox_pattern]], [[delivery_semantics_at_most_at_least_exactly]] — the message-bus mirror of these patterns.
- → Distributed systems: [[cap_theorem]] — the consistency-availability trade-off behind every fail-open vs fail-closed decision.

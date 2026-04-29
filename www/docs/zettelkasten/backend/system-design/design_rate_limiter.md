🗓️ 29042026 1415
📎 #system_design #design #reliability

# design_rate_limiter

> System-design walk-through of a distributed rate limiter sitting in front of an API. Combines [[rate_limiting_algorithms]] (which algorithm) with the architectural decisions (where it lives, what state it needs, how it survives Redis going down).

## 1. Requirements

### Functional
- Limit requests per (user, endpoint, time window).
- Different tiers (free vs paid) have different limits.
- Block excess requests with HTTP 429 + `Retry-After`.
- Soft and hard limits supported (warn vs block).
- Limits configurable per route at runtime.

### Non-functional
- **Low latency** — adds < 5 ms per request to p99.
- **High availability** — limiter outage must not break the API. Decide fail-open or fail-closed per route.
- **Accurate** — within ~5% of the configured limit at steady state.
- **Distributed** — works across N app instances behind a load balancer.

## 2. Capacity

Assume:
- 1M req/s peak across the API fleet.
- 10M unique users.
- 100 distinct rate-limited routes.
- 60-second window typical.

Per-key state:
- One counter (8 bytes) + one timestamp (8 bytes) ≈ 16 bytes.
- 10M users × 100 routes = 1B distinct keys.
- 1B × 16 bytes = 16 GB state at full saturation.

In practice, most users are inactive most of the time → working set is much smaller. Plan for ~1 GB hot.

## 3. API

The rate limiter is **middleware**, not a user-facing API. Two interfaces:

### Inbound (every request)

```
limiter.check(user_id, route, limit, window)
  → ALLOW
  → DENY (with retry_after_seconds)
```

### Configuration (admin)

```
POST /admin/limits
  body: { "route": "POST /charges", "tier": "free", "limit": 100, "window_seconds": 60 }
```

When a request is denied, the API returns:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 30
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1714410600
```

See [[http_status_codes_semantics]] and [[rate_limiting_algorithms]].

## 4. Data Model

The rate limiter is mostly stateful in Redis, with a config layer in the DB.

### Redis state per (user, route)

For a sliding window counter (the typical default):

```
Key: rl:{user_id}:{route}:{window_id}
Value: integer count
TTL: window_seconds + small buffer
```

For a token bucket:

```
Key: rl:{user_id}:{route}
Value: serialised (tokens, last_refill_ts)
TTL: long (e.g. 1h)
```

### DB config

```sql
CREATE TABLE rate_limit_rule (
  route          VARCHAR(128),
  tier           VARCHAR(32),
  algorithm      VARCHAR(16),    -- 'sliding_window' | 'token_bucket'
  limit_count    INT,
  window_seconds INT,
  PRIMARY KEY (route, tier)
);
```

Loaded by app instances with a 1-minute refresh cache.

## 5. Architecture

```
[Client] → [API Gateway / LB]
              │
              ▼
        [App instance]
              │
       (limiter middleware)
              │
              ▼
       [Redis cluster]
        ↑          ↑
        │          │
   [Local LRU]  [Config in DB, cached]
```

### Where the limiter lives

Three reasonable spots:

| Location               | Pros                                          | Cons                                           |
|------------------------|-----------------------------------------------|------------------------------------------------|
| Per-app middleware     | Co-located with handler; lowest latency       | Each app fetches state from Redis on every req |
| API Gateway / Envoy filter | Single chokepoint; consistent                | Gateway becomes hot path; harder to customise |
| Dedicated limiter service | Centralised logic; easy to swap algorithms   | Extra hop adds latency                         |

Default: middleware in the app, talking to a shared Redis. Gateway-level for cross-cutting limits (per-IP, before auth).

### Algorithm choice

For most APIs: **sliding window counter** in Redis. Implementation pattern (see [[rate_limiting_algorithms]] for the algorithm details):

```lua
-- Atomic Lua script in Redis
-- KEYS[1] = current window key
-- KEYS[2] = previous window key
-- ARGV[1] = limit, ARGV[2] = elapsed_in_curr, ARGV[3] = window_seconds

local prev = tonumber(redis.call('GET', KEYS[2]) or 0)
local curr = tonumber(redis.call('GET', KEYS[1]) or 0)
local weight = (ARGV[3] - ARGV[2]) / ARGV[3]
local estimated = math.floor(prev * weight + curr)

if estimated >= tonumber(ARGV[1]) then
  return 0  -- DENY
end

redis.call('INCR', KEYS[1])
redis.call('EXPIRE', KEYS[1], ARGV[3] * 2)
return 1  -- ALLOW
```

One Redis RTT per request (~500 μs intra-DC, see [[back_of_envelope_estimation]]). Acceptable.

For burst-heavy APIs (where 100 req in 1s is fine but 1000 req in 60s isn't): **token bucket** with `(rate=100/min, capacity=200)`.

## 6. Deep Dive

### 6.1 Surviving Redis Failure

If Redis goes down, every request hits the limiter and gets... what?

Two policies:

| Policy        | Behaviour on Redis failure       | When appropriate                                         |
|---------------|-----------------------------------|----------------------------------------------------------|
| **Fail open** | Allow all requests (no limiting)  | API tolerates over-traffic; capacity protects downstream |
| **Fail closed** | Block all requests (return 429) | Strict tier enforcement (paid feature gating)            |

Default: **fail open** for general APIs, **fail closed** for billing-relevant routes (free tier abuse).

Mitigation regardless: per-instance fallback limiter using local in-memory counters. Less accurate (each instance counts independently), but limits the blast radius of a Redis outage. Switch to local mode automatically when Redis check fails consecutively.

### 6.2 Hot Keys

A celebrity user's `user_id` becomes a hot Redis key. Mitigations:

- **Hash bucketing**: route to multiple Redis keys via `(user_id, hash(request_id) % N)`, sum the counts. Sub-bucket per user. Trade: less accurate per-window.
- **Local L1**: short-lived in-process counter per app instance; flush to Redis every N seconds. Approximation.
- **Per-shard Redis**: hash the user_id to one of K Redis shards. Spreads load across cluster. See [[redis_cluster]].

For very high QPS users, run a dedicated rate limiter (e.g. a counting service with sharded counters), not generic Redis.

### 6.3 Multi-Tier Limits

Real APIs need overlapping limits:

```
- Per-IP:        1000 req/min   (anti-DDoS)
- Per-user:      100 req/min    (tier baseline)
- Per-endpoint:  20 req/min     (expensive endpoint protection)
- Global:        1M req/s        (system-wide cap)
```

Each request runs through all four. Denial at any layer → 429. Implement as a chain of Lua scripts or a single multi-key script.

Order matters for performance: cheapest check first (in-process global), most expensive last (per-user Redis).

### 6.4 Cluster Synchronisation

In a Redis cluster (sharded), each `(user_id, route)` key lives on one shard. That shard becomes the source of truth for that user. No global synchronisation needed for accuracy — just consistent hashing of the key.

For multi-region deployments, regional limiters are independent. Cross-region "global limit" is approximated (each region has 1/N of the limit). Strict global limit requires a single source of truth — usually not worth the cross-region latency.

### 6.5 Sliding-Window Window Boundary

The naive sliding-window implementation uses two adjacent windows. At the boundary moment, the previous window's data is still in Redis (TTL not expired) but logically irrelevant. Set TTL to `2 × window_seconds` to keep the previous window available for the weighted-sum trick.

### 6.6 Configuration Updates

Limits change. Hot-reloading them shouldn't require app restarts.

- App caches config in-process (1-minute refresh).
- Config writes go to DB.
- Optional: pub-sub channel pushes config changes to apps for instant updates (otherwise wait for next refresh).

When a limit *decreases*, in-flight users may have already exceeded the new limit by the time the config rolls out. Acceptable; they'll be denied on next request.

## Trade-Offs Summary

| Decision               | Choice                | Trade-off                                       |
|------------------------|-----------------------|-------------------------------------------------|
| Algorithm              | Sliding window counter| Slight inaccuracy at boundaries; cheap         |
| Storage                | Redis cluster         | Hot keys problem; Redis dependency              |
| Failure mode           | Fail open (default)   | Brief over-permission during outages            |
| Granularity            | Per (user, route)     | More keys; finer control                        |
| Local fallback         | Per-instance counter  | Less accurate during Redis outages              |
| Config delivery        | DB + cache + pubsub   | Eventual consistency on config changes          |

## Common Pitfalls

- **Counter without TTL** — Redis fills forever.
- **Non-atomic check-then-set** — two app instances both see "under limit", both allow. Always use atomic Lua or `INCR + EXPIRE` correctly.
- **Single shared Redis without HA** — limiter outage = decision time on fail-open vs closed. Plan for it.
- **Per-IP limit only** — defeats by NAT (whole office shares one IP); doesn't help authenticated users.
- **Per-user limit only** — anonymous traffic skips. Use multi-tier.
- **Limit too tight** — legitimate users hit 429 frequently; SDKs retry storms further.
- **Logging every 429** — generates more traffic than the requests being limited. Sample.
- **Forgetting `Retry-After`** — clients then guess; usually too aggressive.
- **Forgetting circuit-breaker integration** — when downstream is unhealthy, drop the limit further. See [[circuit_breaker_pattern]].
- **Not load-testing the limiter itself** — at 1M req/s, Redis Lua scripts contend; profile under realistic load.

## Related

- [[rate_limiting_algorithms]] — algorithm details.
- [[http_status_codes_semantics]] — 429 conventions.
- [[redis_cluster]], [[redis_distributed_lock]] — Lua + atomic patterns reused.
- [[circuit_breaker_pattern]] — companion outbound pattern.
- [[system_design_framework]] — the steps this follows.
- [[back_of_envelope_estimation]] — sizing the storage and QPS budget.

---

## References

- Stripe Engineering: ["Scaling our API rate limiter"](https://stripe.com/blog/rate-limiters)
- Cloudflare: ["How we built rate limiting capable of scaling"](https://blog.cloudflare.com/counting-things-a-lot-of-different-things/)
- Alex Xu, Vol. 1 ch. 4 (ByteByteGo).

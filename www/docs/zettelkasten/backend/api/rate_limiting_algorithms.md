🗓️ 29042026 1215
📎 #api #reliability #patterns

# rate_limiting_algorithms

> The four algorithms that show up in every rate limiter, the trade-offs that decide which one fits, and the distributed-implementation pitfalls that make naive code wrong under load.

## The Four Algorithms

### 1. Fixed Window Counter

A counter per (key, window). Reset at window boundary.

```
window = current_minute()
count[user, window]++
if count[user, window] > limit: deny
```

**Pros**: O(1) memory per key, trivial to implement.

**Cons**: **boundary burst** — a user can fire `limit` requests at second 59 of one window, then another `limit` at second 0 of the next. Effectively 2× the intended rate across the boundary.

### 2. Sliding Window Log

Keep a sorted list of request timestamps per key. On each request, drop entries older than the window, then check if size < limit.

```
log[user] = list of timestamps
drop entries older than (now - window)
if len(log[user]) >= limit: deny
else: append now
```

**Pros**: exact. No boundary burst.

**Cons**: O(n) memory per key for n requests in the window. Expensive at scale.

### 3. Sliding Window Counter (hybrid)

Approximate the sliding log using two adjacent fixed windows weighted by the fraction of overlap.

```
prev_count, curr_count = ...
elapsed_in_curr = now - curr_window_start
weight = (window - elapsed_in_curr) / window     # fraction of prev window still in scope
estimated = prev_count * weight + curr_count
if estimated > limit: deny
```

**Pros**: O(1) memory per key, smooths the boundary burst, simple to implement on Redis with two keys.

**Cons**: assumes uniform request distribution within the previous window — slightly inaccurate if traffic is bursty. Usually accurate enough.

This is the **default algorithm in production** for most APIs.

### 4. Token Bucket

A virtual bucket holds up to `capacity` tokens, refilled at `rate` tokens/sec. Each request takes 1 token. If empty: deny.

```
bucket[user] = { tokens, last_refill }
elapsed = now - last_refill
bucket.tokens = min(capacity, bucket.tokens + elapsed * rate)
bucket.last_refill = now
if bucket.tokens >= 1: bucket.tokens--, allow
else: deny
```

**Pros**:
- Allows bursts up to `capacity`. Steady-state rate `rate`/sec.
- Two-knob API (rate + burst capacity) maps naturally to user expectations.
- O(1) memory per key.

**Cons**: implementation must be atomic across processes (use Redis Lua or atomic ops). Multiple actors refilling concurrently corrupts the bucket.

### 5. Leaky Bucket

Conceptually a queue draining at fixed rate `rate`/sec, capacity `capacity`. Requests join the queue; if full, denied.

```
on request:
  drain queue at rate
  if queue.size < capacity: queue.add(request)
  else: deny
```

**Pros**: smoothes traffic — output is always at most `rate` regardless of input bursts. Useful when downstream needs steady load (database, third-party API).

**Cons**: no burst tolerance (unlike token bucket). Strict shaping; slower clients punished.

Token bucket and leaky bucket can be used interchangeably for many cases — token bucket allows bursts, leaky bucket smooths.

## Choosing

| Need                                           | Use                              |
|------------------------------------------------|----------------------------------|
| Simple per-user request cap                    | Sliding window counter           |
| API tier with burst headroom (e.g. 100 req/min, burst 200) | Token bucket             |
| Smooth output to a downstream that hates bursts | Leaky bucket                    |
| Strict accounting needed (financial, audit)    | Sliding window log (if affordable) |
| Internal "this should be roughly X req/sec"    | Fixed window — simplest, fine    |

## Distributed Implementation

Single-process counter is trivial. Distributed (across N app instances, with shared rate limit) is where it gets interesting.

### Centralised counter (Redis)

All instances increment a single Redis counter:

```lua
-- Atomic Lua script
local current = redis.call('INCR', KEYS[1])
if current == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])  -- window TTL
end
return current
```

Adds one Redis RTT per request. Simple, accurate, but a Redis dependency on the request path.

### Token bucket on Redis

```lua
local bucket = cjson.decode(redis.call('GET', KEYS[1]) or '{"tokens":'..ARGV[1]..',"ts":'..ARGV[3]..'}')
local elapsed = ARGV[3] - bucket.ts
bucket.tokens = math.min(ARGV[1], bucket.tokens + elapsed * ARGV[2])
bucket.ts = ARGV[3]
local allow = bucket.tokens >= 1 and 1 or 0
if allow == 1 then bucket.tokens = bucket.tokens - 1 end
redis.call('SET', KEYS[1], cjson.encode(bucket), 'EX', 3600)
return allow
```

ARGV: capacity, rate, now. Returns 1 if allowed, 0 if denied. Atomic via Lua.

### Local + sync (sloppy)

Each instance counts locally; periodically syncs to a shared store. Cheap (no per-request RTT) but inaccurate — instance can over-issue between syncs. Acceptable for "approximately N req/min globally" where leaks of 10–20% don't matter.

### Per-shard counters

Hash by key, route to one instance owning that key. Counters live in-memory. Loses redundancy; gains zero RTT. Used internally by some CDNs and gateways (Cloudflare, Envoy).

## Identity — What's the Key

| Key                | Pros / Cons                                                       |
|--------------------|-------------------------------------------------------------------|
| IP address         | Easy to extract; defeated by NAT (whole office shares one IP) and proxies. |
| User ID            | Accurate per-user; requires authentication.                       |
| API key            | Standard for B2B APIs.                                            |
| User-Agent fingerprint | Bot detection adjunct; not reliable alone.                    |
| Combination        | E.g. `(api_key, endpoint)` for tier-based limits per route.       |

## What to Send Back

429 with these headers (industry convention):

```
HTTP/1.1 429 Too Many Requests
Retry-After: 30
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1714410600
```

`Retry-After` can be either seconds or an HTTP-date. Prefer seconds.

## Common Pitfalls

- **Fixed window's boundary burst** — the most common surprise. Sliding window counter is barely more code and avoids it.
- **Non-atomic Redis ops** — `GET` then `SET` instead of Lua script lets two instances both pass a request that should be denied. Always atomic (Lua, or `INCR`+`EXPIRE` race-aware).
- **Counters with no TTL** — Redis fills up forever. Set TTL to slightly more than the window.
- **Limiting per-IP behind a load balancer** — without `X-Forwarded-For` parsed correctly, you limit the LB's IP and get one global counter for all users.
- **Failing closed on Redis failure** — every request fails when Redis blips. Often you want to fail open (allow when uncertain) and rely on capacity for protection. Decide explicitly per endpoint.
- **One global limiter for everything** — different endpoints have different costs. Use per-route limits.
- **Logging every 429** — generates more traffic than the requests themselves. Sample.
- **Telling users to retry without backoff** — leads to retry storms. Pair 429 with `Retry-After` and document exponential backoff in the SDK.

## Related

- [[http_status_codes_semantics]] — 429 specifically.
- [[retry_backoff_jitter]] — what clients should do after 429.
- [[circuit_breaker_pattern]] — server-side complement (your service can also be the rate-limited downstream).
- [[redis_distributed_lock]] — Lua + atomic-op patterns reused.
- [[redis_cluster]] — counter sharding implications.
- `design_rate_limiter` *(planned)* — the system-design walk-through.

---

## References

- Cloudflare: ["How we built rate limiting capable of scaling"](https://blog.cloudflare.com/counting-things-a-lot-of-different-things/)
- Stripe Engineering: ["Scaling our API rate limiter"](https://stripe.com/blog/rate-limiters)
- Alex Xu, Vol. 1 ch. 4 (ByteByteGo)

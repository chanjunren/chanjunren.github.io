🗓️ 06072026 1100
📎 #java #concurrency #api

# guava_rate_limiter

> Google Guava's `RateLimiter` — a single-JVM, in-memory token bucket that smooths request rate and optionally warms up gradually. Not distributed; every instance guards only the process it lives in.

## Position In The Stack

```
Service method
     ↓
RateLimiter.acquire()   ← this zettel — blocks the calling thread
     ↓
Downstream call (DB, third-party API, expensive computation)
```

Contrast with the Redis-backed [[rate_limiting_algorithms]] token bucket — that one coordinates across processes over the network; Guava's lives entirely in one JVM's heap and costs no I/O.

## Two Flavors

### SmoothBursty — `RateLimiter.create(permitsPerSecond)`

- Classic token bucket. Refills at `permitsPerSecond`, permits accumulate up to ~1 second's worth of unused capacity (`maxBurstSeconds`), so idle time "saves up" burst headroom.
- Use for: protecting a resource that can absorb short bursts fine, just not a sustained overrate.

### SmoothWarmingUp — `RateLimiter.create(permitsPerSecond, warmupPeriod, unit)`

- Starts "cold": grants permits at a slower rate immediately after creation (or after being idle for `warmupPeriod`), then ramps up to the steady-state rate over `warmupPeriod`.
- Models a downstream resource that has an actual cold-start cost — a connection pool spinning up, a cache with cold entries, a JIT-compiled hot path that hasn't warmed up.
- Left idle for the full `warmupPeriod`, it goes cold again and re-ramps on the next burst of traffic.

## Core Mechanics

- Time-based, not counter-based: computes "next free ticket time" (`nextFreeTicketMicros`) from a monotonic clock (`System.nanoTime()`-backed stopwatch), immune to wall-clock adjustments.
- Thread-safe via internal locking — safe to share one `RateLimiter` instance across threads (that's the point; it's meant to be a shared gate, not one-per-thread).
- **Cost is charged forward, not now.** `acquire(n)` doesn't block the caller for `n` permits before granting — it grants immediately if permits are idle-accumulated, then reserves that the *next* caller pays the wait. A cheap request arriving right after an expensive one absorbs the expensive one's throttle debt. This trips people up: `acquire()` timing measures how long *this* call waited because of *past* calls, not a cost estimate for the current one.

## API Shape

```java
RateLimiter limiter = RateLimiter.create(5.0); // 5 permits/sec, SmoothBursty

double waited = limiter.acquire();       // blocks until a permit is free, returns seconds slept
boolean got   = limiter.tryAcquire();    // non-blocking, returns immediately
boolean got2  = limiter.tryAcquire(200, TimeUnit.MILLISECONDS); // bounded wait

limiter.acquire(3);                      // request 3 permits — throttles subsequent calls, not this one
limiter.setRate(10.0);                   // change rate at runtime, takes effect on next acquire
```

- `acquire()` / `acquire(n)` — blocking, returns time spent sleeping (useful for metrics, not for control flow).
- `tryAcquire()` / `tryAcquire(timeout)` — non-blocking or bounded-wait variant, returns whether a permit was granted. Use this when the caller has a fallback (queue, reject, degrade) instead of an unbounded thread block.
- `setRate(double)` — mutable at runtime; existing waiters are affected on their next check.

## Limitations

- **Not distributed.** N app instances each running their own `RateLimiter.create(100)` gives you `100 * N` permits/sec cluster-wide, not 100. For a cluster-wide cap, this needs to be paired with a shared external limiter (Redis Lua script, see [[rate_limiting_algorithms]]) or divided per-instance (`100 / N`) as a rough approximation.
- **No burst capacity control knob** beyond the implicit ~1 second of saved-up permits in SmoothBursty — you can't configure a separate burst size independent of the rate the way you can in a hand-rolled token bucket.
- **Blocking API by default.** `acquire()` parks the calling thread; in a thread-per-request server this ties up a worker thread for the wait duration. Prefer `tryAcquire` + explicit backpressure in latency-sensitive paths, or route through a bounded queue.
- **Deprecated warmup overload**: the three-arg `create(rate, warmupPeriod, unit)` plus an old four-arg variant with a `coldFactor` param were deprecated/removed across Guava versions — check the version pinned in the project before copying signatures from older blog posts.

## When To Reach For It

- In-process guard on an expensive local operation (rate-limiting calls to a flaky/expensive third-party API from a single service instance).
- Smoothing outbound calls from a batch job or scheduled task so it doesn't hammer a downstream all at once.
- Not the tool for: per-user API rate limiting across a fleet of instances — that needs a shared store.

## Related

- [[rate_limiting_algorithms]] — the general algorithm survey and the distributed/Redis version of token bucket
- [[circuit_breaker_pattern]] — complementary: rate limiter controls outbound rate, breaker reacts to downstream failure

---

## References

- [Guava `RateLimiter` source (SmoothRateLimiter)](https://github.com/google/guava/blob/master/guava/src/com/google/common/util/concurrent/SmoothRateLimiter.java)
- [Guava `RateLimiter` javadoc](https://guava.dev/releases/snapshot/api/docs/com/google/common/util/concurrent/RateLimiter.html)
- [Baeldung — Quick Guide to the Guava RateLimiter](https://www.baeldung.com/guava-rate-limiter)

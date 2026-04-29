🗓️ 29042026 1245
📎 #reliability #patterns #api

# retry_backoff_jitter

> The three knobs of any retry strategy. Retry says "do it again", backoff says "wait between tries", jitter says "wait a different amount than every other client". Without jitter, well-behaved clients turn into a thundering herd at every blip.

## When to Retry

```ad-abstract
**Retry on**: transient errors — network timeouts, 5xx server errors, connection resets, 429 (after Retry-After), specific recoverable exceptions.
**Do not retry on**: 4xx client errors (except 408, 425, 429), validation failures, authentication failures, 501 Not Implemented, business-logic rejections.
```

The split mirrors HTTP status classes from [[http_status_codes_semantics]]. Retrying a 400 produces another 400, infinitely. Retrying a 503 has a real chance of succeeding.

## Backoff Strategies

### Fixed Delay

Wait a constant time between retries.

```
sleep = K   (e.g. 1 second)
```

Simple, predictable, terrible at scale. Every client retries at the same offset → synchronised pile-on.

### Linear Backoff

Wait increases by a fixed amount each attempt.

```
sleep = K * attempt   (1s, 2s, 3s, 4s, ...)
```

Better than fixed; still synchronised across clients.

### Exponential Backoff

Wait doubles each attempt.

```
sleep = base * (2 ^ attempt)   (1s, 2s, 4s, 8s, 16s, ...)
```

Good in theory: errors clear; load on downstream drops geometrically. Bad in practice without jitter — many clients still retry at exactly the same moments, just at exponentially-spaced moments.

## Why Jitter

Without jitter, exponential backoff still creates **synchronised retry waves**. 1000 clients fail at second 0; all retry at second 1, second 3, second 7. The downstream gets predictable spikes.

With jitter, retries spread across the window:

```
clients without jitter         clients with jitter
   ████████████████              █  █  ██  █  ████  ██  █
   second 1 spike                spread across the second
```

The downstream sees a smooth curve rather than spike-shaped traffic. Recovery is faster because the system isn't repeatedly tipped over.

## Three Jitter Schemes (AWS terminology)

### Full Jitter

```
sleep = random_between(0, base * 2^attempt)
```

The most common recommendation. Each client picks uniformly within the exponential window. Spreads load extremely well.

### Equal Jitter

```
sleep = base * 2^attempt / 2 + random_between(0, base * 2^attempt / 2)
```

Half deterministic backoff + half random. Less spread but ensures a minimum delay (avoids any client retrying immediately).

### Decorrelated Jitter

```
sleep = min(cap, random_between(base, prev_sleep * 3))
```

Removes correlation between successive sleep values for the same client. Slightly better recovery characteristics in some workloads. Used by AWS SDK by default.

**AWS recommendation, validated empirically: full jitter** for most cases.

## Caps and Limits

Three limits any retry should have:

```ad-abstract
**Max retries** — give up after N attempts. Otherwise, a permanently-broken downstream produces unbounded retries.
**Max delay** — cap sleep at some reasonable value (e.g. 60s) so exponential growth doesn't push individual retries to multi-hour delays.
**Total budget** — overall time spent. After T seconds, fail rather than retry. Useful when the caller has its own SLA.
```

Sample implementation skeleton:

```java
int attempt = 0;
while (attempt < MAX_RETRIES) {
  try {
    return call();
  } catch (RetryableException e) {
    long base = 100L; // ms
    long cap = 60_000L; // ms
    long expo = Math.min(cap, base * (1L << attempt));
    long sleep = ThreadLocalRandom.current().nextLong(0, expo + 1); // full jitter
    Thread.sleep(sleep);
    attempt++;
  }
}
throw new MaxRetriesExceeded();
```

## Retry Budgets

Per-instance retries are easy. Fleet-wide they need limits — otherwise a downstream blip has 1000 clients each retrying 5 times = 5000 extra calls right when the system is fragile.

**Retry budget**: only allow retries up to a fraction of original traffic (e.g. 20%). Implemented as a token bucket: each successful call adds a token, each retry consumes one. When the bucket is empty, no retries — fail fast.

This caps the **retry amplification factor** under sustained failure.

## Idempotency Is Required

Retries on non-idempotent operations cause duplicate side effects. POST without idempotency keys + retries = double charges, double orders. The retry layer must verify the operation is safe to retry:

- GET / PUT / DELETE → safe by [[http_methods_idempotency_safety]].
- POST / PATCH → require [[idempotency_keys_api_design]] for safe retry.

SDKs that retry blindly without checking method (or idempotency key presence) cause real bugs.

## Retry vs Circuit Breaker

Different jobs:

- **Retry** handles individual transient failures.
- **[[circuit_breaker_pattern]]** handles sustained failures by cutting traffic entirely.

The standard composition: **retry inside breaker**. While the breaker is closed, retry handles blips. When the breaker opens, retry stops (the breaker fails fast). When the breaker half-opens, the next probe is just one call — no retry on top.

## Common Pitfalls

- **Linear or fixed backoff at scale** — synchronises retries across clients into spikes. Always exponential.
- **Exponential without jitter** — better than linear, still synchronised. Always add jitter.
- **No max retries** — a broken downstream eats forever. Cap.
- **No max delay** — `60s * 2^10 = ~17 hours` is technically valid; not what you want. Cap.
- **Retrying 4xx** — wastes resources, never succeeds, can cause secondary bugs (rate limits, account lockouts).
- **Retrying non-idempotent without keys** — duplicate side effects.
- **Retry inside retry** — the SDK retries, your wrapper retries, the LB retries. 5×5×5 = 125 attempts for one logical request. Audit the stack.
- **Retry storm after circuit-half-open** — a half-open breaker plus aggressive retry inside the call hammers the recovering downstream. Disable retries when the breaker is in probing mode.
- **Sleeping on the calling thread** in a request-handling system — your worker thread is now blocked. Use async retry (scheduled task, queue) or accept the latency cost honestly.
- **Returning success after retries that mask repeated 5xx** — observability blind spot. Log retry attempts and surface as a metric.

## Related

- [[circuit_breaker_pattern]] — pairs with retry; usually wraps it.
- [[http_methods_idempotency_safety]] — what's safe to retry.
- [[idempotency_keys_api_design]] — how to make non-idempotent operations retry-safe.
- [[http_status_codes_semantics]] — which codes are retryable.
- [[rate_limiting_algorithms]] — server side; explains 429 + Retry-After.
- [[cache_stampede_thundering_herd]] — different domain, same jitter principle.

---

## References

- AWS Architecture Blog: ["Exponential Backoff and Jitter"](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/) — the canonical reference.
- Google SRE Book ch. 22: "Addressing Cascading Failures".
- "Release It!" (Nygard) — failure modes that motivated these patterns.

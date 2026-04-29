🗓️ 29042026 1230
📎 #reliability #patterns #api

# circuit_breaker_pattern

> The pattern that stops a failing downstream from taking the whole system with it. When error or slow-call rates exceed a threshold, the breaker "opens" — calls fail fast instead of piling up — and tries to recover only after a cool-down. Borrowed shamelessly from electrical circuit breakers, with the same safety intuition.

## The Three States

```ad-abstract
**Closed** — calls pass through normally. The breaker watches success/failure ratios.
**Open** — calls short-circuit immediately with a "circuit open" error. The downstream gets time to recover; the upstream stops wasting resources on doomed calls.
**Half-Open** — after a cool-down, a small number of probe calls are allowed. If they succeed, return to Closed; if they fail, back to Open.
```

```
       failure rate >= threshold
   ┌──────────────────────────────┐
   ▼                              │
[Closed]                       [Open]
   ▲                              │
   │  probe success               │ cool-down elapsed
   │     ▲                        ▼
   │     └──────────[Half-Open]◄──┘
   │                  │
   └──────────────────┘
       probe failure
```

## Why It Matters

Without a breaker, a slow downstream (say, a database under load) causes upstream threads to pile up waiting for responses. Threads exhaust → upstream becomes unresponsive → its callers pile up → cascading failure across the whole stack.

The breaker:
- **Sheds load** off the downstream so it can recover.
- **Fails fast** so upstream resources (threads, connections) aren't wasted.
- **Detects recovery** automatically with probes.

## What Counts as a Failure

The breaker isn't only watching exceptions. Common signals to trip on:

- **Exception rate** — N% of calls threw in the last window.
- **Slow call rate** — N% of calls exceeded a duration threshold (e.g. `>5s` when SLA is `<1s`). Slow calls are often a worse signal than errors — the system is dying, not failing cleanly.
- **HTTP 5xx rate** — for HTTP clients.
- **Timeout rate** — distinct from "exception".

Resilience4j (the Java go-to) lets you configure all of these. Hystrix (legacy, Netflix) was the first widely-used implementation.

## Sliding Windows

Same trade-offs as [[rate_limiting_algorithms]]:

- **Count-based window** — last N calls. Quick to react; small N is twitchy.
- **Time-based window** — last T seconds. Smoother; bigger memory cost.

Resilience4j defaults to count-based 100 calls. Tune to your traffic shape.

## Tuning the Knobs

| Knob                       | Typical starting value | Effect                                                     |
|----------------------------|------------------------|------------------------------------------------------------|
| Failure rate threshold     | 50%                    | Trip when half of calls in the window failed.              |
| Slow-call rate threshold   | 100% (effectively off) or 50% if downstream is latency-sensitive | Trip on slow successes too. |
| Slow-call duration         | 2× SLA p99             | What counts as "slow".                                     |
| Sliding window size        | 100 calls / 60s        | Trade-off responsiveness vs jitter.                         |
| Minimum number of calls    | 10                     | Don't trip until enough samples — avoids flapping at low traffic. |
| Wait duration in Open      | 30s                    | Cool-down before half-open.                                |
| Permitted calls in Half-Open | 5–10                  | Probe size before closing or reopening.                     |

## Combining With Other Patterns

A breaker rarely lives alone:

| Companion           | What it adds                                                    |
|---------------------|------------------------------------------------------------------|
| **Timeout**         | Prevents threads from waiting indefinitely. Without timeout, breaker can't measure slow-call rate. |
| **Bulkhead**        | Isolates resources (threads, connections) per downstream. Limits blast radius if breaker is slow to trip. |
| **Retry with [[retry_backoff_jitter]]** | Retry only on transient errors; never retry past an open breaker. |
| **Fallback**        | Cached value, default response, or graceful degradation when breaker is open. |
| **[[rate_limiting_algorithms]]** | Caps inbound traffic; complements outbound circuit. |

The standard outer-to-inner stack: **rate limit → bulkhead → timeout → circuit breaker → retry → call**.

## Where the Breaker Lives

| Location                | Notes                                                            |
|-------------------------|------------------------------------------------------------------|
| **Per-downstream client** | Most common. Each external dependency has its own breaker.    |
| **Per-method / per-endpoint** | Finer-grained. One slow endpoint shouldn't trip a healthy adjacent one. |
| **At the service mesh layer** (Istio, Envoy) | Configured externally; consistent across services. Less in-process control. |

## Common Pitfalls

- **No timeout** — breaker can't measure slow calls if there's no timeout to compare against. Calls hang forever and the breaker never reacts.
- **Too sensitive** — 50% failure threshold over 10 calls means 5 errors in a tiny window flips the breaker. With 60-second windows during quiet hours, brief noise opens the circuit and rejects healthy traffic. Tune the minimum-calls threshold.
- **Too lenient** — 90% failure threshold means the breaker only trips when the downstream is essentially dead. Defeats the point.
- **Half-open probe too large** — probes 100 calls; if 50 fail you've burned 50 doomed calls again. Keep probe small.
- **Forgetting fallback** — open circuit returns errors; clients see the same outage. The point is graceful degradation: cached value, stale data, partial response, default.
- **Per-instance breakers in a fleet** — each app instance has its own state. One instance's breaker may be open while another's is closed. Decide whether that's a feature (independence) or a bug (inconsistent UX); use a shared store if needed.
- **Treating breaker as substitute for capacity** — breaker protects against *upstream* damage. The downstream still needs to handle its load. Breakers don't fix overload.
- **Cascading flap** — a borderline-healthy downstream causes the breaker to open, callers fall back, downstream recovers, breaker half-opens, traffic returns, downstream tips over again. Add jitter and slow ramp-up.

## Related

- [[retry_backoff_jitter]] — pair with breakers to avoid retry storms after recovery.
- [[rate_limiting_algorithms]] — inbound complement to the outbound breaker.
- [[http_status_codes_semantics]] — what 5xx triggers the breaker on.
- [[idempotency_keys_api_design]] — idempotency makes retries-after-recovery safe.
- `bulkhead_pattern` *(planned)* — resource isolation companion.

---

## References

- Nygard, "Release It!" (2nd ed.) — origin of the named pattern in software.
- Resilience4j docs: [CircuitBreaker](https://resilience4j.readme.io/docs/circuitbreaker)
- Microsoft Azure Architecture Center: [Circuit Breaker pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)

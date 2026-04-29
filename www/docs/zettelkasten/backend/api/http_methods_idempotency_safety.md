🗓️ 29042026 1145
📎 #api #http

# http_methods_idempotency_safety

> The two formal properties that decide whether an HTTP method is safe to retry, cache, or replay. Misclassifying a method is the root cause of subtle bugs (double charges, lost updates) that survive code review.

## The Two Properties

```ad-abstract
**Safe** — the method is read-only by intent; calling it should produce no observable side effect on the server.
**Idempotent** — calling the method N>1 times produces the same server-side state as calling it once.
```

Safety is a stricter promise than idempotency. Every safe method is idempotent; not every idempotent method is safe.

## Method Matrix

| Method  | Safe | Idempotent | Cacheable        | Notes                                            |
|---------|------|------------|------------------|--------------------------------------------------|
| GET     | ✓    | ✓          | ✓                | Pure read.                                       |
| HEAD    | ✓    | ✓          | ✓                | Like GET, no body.                               |
| OPTIONS | ✓    | ✓          | (rare)           | Capability discovery, CORS preflight.            |
| TRACE   | ✓    | ✓          | ✗                | Diagnostic; usually disabled.                    |
| PUT     | ✗    | ✓          | ✗                | Full replace; same payload twice = same result.  |
| DELETE  | ✗    | ✓          | ✗                | Repeated deletes leave the same state (gone).    |
| POST    | ✗    | ✗ (default)| (only with explicit headers) | The wildcard. Treat as creating something new each call. |
| PATCH   | ✗    | ✗ (default)| ✗                | Partial update; depends on the patch representation. |

## Idempotency vs Same-Response

**State idempotency, not response idempotency.** A second `DELETE /users/42` returns 404 (the user is already gone), not 204. The *server state* is the same — that's what counts. Common confusion: people conflate "same response" with "idempotent" and incorrectly conclude DELETE isn't idempotent.

PUT writes the same content twice → server state identical → idempotent. Even if the second PUT returns a different status (e.g. 200 instead of 201), the resource is the same.

## Why POST Isn't Idempotent

`POST /orders` typically *creates* an order. Calling twice creates two orders. Two charges, two shipments. Bad.

To make POST safe to retry, the application layer adds an idempotency key:

```http
POST /charges HTTP/1.1
Idempotency-Key: 7f8e9c10-...
```

The server stores the result keyed by the idempotency key; replays return the cached result. See [[idempotency_keys_api_design]].

## Why PATCH Isn't Idempotent (in general)

```
PATCH /counter  body: { "increment": 1 }
```

Each call shifts state by +1. Not idempotent.

Versus:

```
PATCH /counter  body: { "value": 5 }
```

Final state is the same regardless of repetition. Idempotent.

PATCH idempotency is a property of the patch payload, not the method. RFC 5789 explicitly notes this. Default to "treat PATCH as non-idempotent unless your patch grammar guarantees it".

## Practical Implications

| Need                                | What method/protection                        |
|-------------------------------------|------------------------------------------------|
| Read a resource                     | GET                                           |
| Create with server-assigned ID      | POST + idempotency key                        |
| Create with client-supplied ID      | PUT (idempotent natively)                     |
| Replace a resource                  | PUT                                           |
| Partial update                      | PATCH + idempotency key                       |
| Delete                              | DELETE                                        |
| Trigger an action ("charge", "send")| POST + idempotency key (always)               |
| Bulk read with parameters           | GET with query string (URL-cacheable) or POST (if too long; lose caching) |

## Caching, Retries, Reverse Proxies

- **Idempotent methods** can be retried safely by clients, proxies, and SDKs without coordination.
- **Safe methods** can additionally be cached (subject to `Cache-Control`).
- **Non-idempotent methods** must not be auto-retried by infrastructure. Client SDKs (and load balancers) must distinguish.
- **HTTP/2 connection close**: a non-idempotent in-flight request gets surfaced as a hard error rather than auto-retry, by spec.

## Common Pitfalls

- **POST that "kind of feels like a read"** — search endpoints with complex bodies. Tempting to POST, but loses caching and retry-safety. Prefer GET with long query strings or a dedicated query language.
- **DELETE that returns 404 the second time** — that's correct! Don't treat it as an error in the client retry logic.
- **PATCH with addition operations** — `+= 1`, `append`, etc. Not idempotent. Use idempotency keys or restructure to PUT.
- **Idempotent POST without idempotency key** — saying "our POST is idempotent because the body is the same" is not enough; the *server* must dedupe. Without a key, the server has no stable identifier for "same logical request".
- **Retrying POST in load balancers** — proxies that retry on 5xx will double-create unless idempotency is enforced server-side. Most reverse proxies are conservative here for a reason.
- **GET with side effects** — analytics endpoints fire on GET pings. Technically violates safety. Browsers prefetch GETs aggressively (link rel=prefetch); a GET that has side effects can fire silently. Use POST/Beacon for analytics events.

## Related

- [[idempotency_keys_api_design]] — how to make POST safe to retry.
- [[retry_backoff_jitter]] — when retries are appropriate.
- [[http_status_codes_semantics]] — what each method's response codes mean.
- [[idempotent_consumer_pattern]] — the message-bus equivalent of the idempotency-key idea.
- `http_caching_headers` *(planned)* — Cache-Control, ETag, conditional GET.

---

## References

- RFC 9110 §9: [HTTP Semantics — Methods](https://www.rfc-editor.org/rfc/rfc9110#name-methods)
- RFC 5789: [HTTP PATCH](https://www.rfc-editor.org/rfc/rfc5789)
- Stripe API: [Idempotent Requests](https://docs.stripe.com/api/idempotent_requests)

🗓️ 29042026 1200
📎 #api #http

# http_status_codes_semantics

> The five status-code classes and the specific codes that carry distinct meaning. Most of the codes are forgettable; the ones that aren't (401 vs 403, 422 vs 400, 409, 429, 503) come up in real API decisions.

## The Five Classes

```ad-abstract
**1xx Informational** — interim, rarely surfaced to apps (e.g. 100 Continue, 101 Switching Protocols).
**2xx Success** — request completed as intended.
**3xx Redirect** — client must take additional action to complete.
**4xx Client Error** — request itself is faulty; do not retry without changing the request.
**5xx Server Error** — server failed; same request might succeed later.
```

Class semantics matter because **clients, proxies, and SDKs auto-retry differently** based on class. Returning the wrong class causes wrong retry behaviour.

## 2xx — The Useful Ones

| Code | When                                                                |
|------|---------------------------------------------------------------------|
| 200 OK | Generic success with body. Default for GET.                       |
| 201 Created | New resource created. **Include `Location` header** pointing to the new resource. Default for POST creates. |
| 202 Accepted | Async work queued; not yet complete. Body should describe how to track. |
| 204 No Content | Success with no body to return. Default for PUT/DELETE that have nothing to say. |
| 206 Partial Content | Range request response (downloads, video).                     |

## 3xx — Redirects

| Code | When                                                                  |
|------|-----------------------------------------------------------------------|
| 301 Moved Permanently | Resource has a new permanent URL. Browsers cache aggressively. Hard to undo. |
| 302 Found | Temporary redirect. Browsers don't cache (mostly).                       |
| 303 See Other | After POST, redirect client to GET a result resource.                 |
| 304 Not Modified | Conditional GET — client's cached copy is still valid.             |
| 307 Temporary Redirect | Like 302 but preserves method (302 may convert POST→GET historically). |
| 308 Permanent Redirect | Like 301 but preserves method.                                    |

Use 307/308 in API contexts to avoid the historical method-rewriting baggage of 301/302.

## 4xx — Client Errors

| Code | When                                                                           |
|------|--------------------------------------------------------------------------------|
| 400 Bad Request | Syntactically invalid (malformed JSON, missing required field). Fix the request. |
| 401 Unauthorized | **Authentication missing or invalid.** Send credentials. Confusingly named — should be "Unauthenticated". |
| 403 Forbidden | **Authenticated, but not allowed.** Different user/scope/permission needed. |
| 404 Not Found | Resource doesn't exist (or you can't see it for privacy reasons).               |
| 405 Method Not Allowed | Endpoint exists but doesn't accept this method. Must include `Allow` header. |
| 409 Conflict | State conflict (concurrent edit, duplicate creation). Common for optimistic concurrency violations. |
| 410 Gone | Resource permanently removed; do not retry. Distinct from 404 (don't know).      |
| 412 Precondition Failed | `If-Match` / `If-Unmodified-Since` failed.                            |
| 415 Unsupported Media Type | Server can't process the request body's content-type.              |
| 422 Unprocessable Entity | **Syntactically OK but semantically invalid** (validation failure). Distinct from 400. |
| 429 Too Many Requests | Rate-limited. Include `Retry-After` header. See [[rate_limiting_algorithms]]. |

### 401 vs 403 — the most-asked clarification

- **401**: "I don't know who you are." → log in / send a token.
- **403**: "I know who you are, you can't do this." → switch user / request access.

Sending 403 when you mean 401 (or vice versa) breaks SSO redirect flows and SDK auth-refresh logic.

### 422 vs 400

- **400**: bad syntax. Cannot parse. JSON malformed, required field missing.
- **422**: parsed fine, but the contents fail validation (negative age, invalid email format, business rule violation).

Many APIs use 400 for both. RFC 9110 added 422 to fit; using it cleanly improves error handling on the client side.

## 5xx — Server Errors

| Code | When                                                                  |
|------|-----------------------------------------------------------------------|
| 500 Internal Server Error | Unhandled exception, generic failure. The "I don't know what went wrong" response. |
| 501 Not Implemented | Method recognised but not implemented. Distinct from 405.       |
| 502 Bad Gateway | Upstream returned an invalid response (typically the reverse proxy says this). |
| 503 Service Unavailable | Overloaded / under maintenance. Include `Retry-After`.       |
| 504 Gateway Timeout | Upstream timed out. Common for slow downstream services.        |

5xx is the class clients/SDKs auto-retry. Don't return 5xx for "your input was wrong" — that's 4xx, and clients won't retry it.

## What Each Class Means for Retries

| Class | Retry advice                                                                  |
|-------|-------------------------------------------------------------------------------|
| 2xx   | Don't retry. Done.                                                            |
| 3xx   | Follow redirect (or not, per client policy).                                  |
| 4xx   | **Do not retry without changing the request.** Exception: 408 Request Timeout, 425 Too Early, 429 (after backoff). |
| 5xx   | Retry with [[retry_backoff_jitter]]. Exception: 501 Not Implemented (request will never succeed). |

429 is the special case — yes retry, but only after `Retry-After`.

## Common Pitfalls

- **400 for everything 4xx-ish** — collapses meaningful distinctions. Use the specific code so clients can react correctly (auth refresh on 401, retry on 429, etc.).
- **200 with `{"error": ...}` body** — a few APIs do this. Breaks every monitoring tool that filters by status. Use HTTP status codes.
- **500 for validation failures** — clients retry, server keeps failing the same way. Use 4xx.
- **Missing `Retry-After` on 429 / 503** — clients then guess. Worse, they hammer with default delays. Always set it.
- **No `Location` on 201** — clients can't find the resource they just created.
- **Custom 600+ codes** — proxies and gateways drop or rewrite. Stay within standard ranges.
- **Conflating 503 and 504** — 503 means "I refuse" (overloaded); 504 means "upstream didn't answer". Different operational signals.
- **`Allow` header missing on 405** — spec requires it. Many implementations forget. Without it, clients can't programmatically discover the right method.

## Related

- [[http_methods_idempotency_safety]] — what methods *should* return.
- [[retry_backoff_jitter]] — what to do with 5xx and 429.
- [[rate_limiting_algorithms]] — what 429 sits in front of.
- [[circuit_breaker_pattern]] — why a chain of 5xx triggers a circuit open.

---

## References

- RFC 9110 §15: [Status Codes](https://www.rfc-editor.org/rfc/rfc9110#name-status-codes)
- IANA: [HTTP Status Code Registry](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml)
- Mozilla MDN: [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

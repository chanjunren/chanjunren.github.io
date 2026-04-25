🗓️ 25042026 1440
📎 #fundamentals #reliability #design

# hot_path

> Code that runs on every (or nearly every) request. A failure here amplifies into a system-wide outage.

## Definition

The "hot path" is the set of functions / services / dependencies traversed by virtually every incoming request. Examples:

- Auth / session validation (every request needs identity)
- Feature flag lookup (every request branches on flags)
- Tenant config lookup
- Logging / observability decoration
- Rate limiter check

Anything **upstream of branching logic** is hot.

## Why It's Dangerous

A bug or dependency failure on the hot path **multiplies** by request volume:

```
Cold path failure: one feature broken
Hot path failure:  every feature broken
```

The incident at 22:35 — Redis MGET wedged inside `JwtCacheUtils`. Because JWT validation is on every request, ~1000 errors/min flowed instantly. If the same Redis bug had hit a non-hot path (e.g. an admin-only endpoint), it would have been a footnote.

## Design Principles

### 1. Fail open, not closed

Hot path dependencies should degrade gracefully:

```java
// BAD — cache fails → request 500s
JwtState state = cache.get(userId);   // throws → propagates
return process(state);

// GOOD — cache fails → fall back to source-of-truth or safe default
JwtState state;
try {
  state = cache.get(userId);
} catch (Exception e) {
  log.warn("[jwt_cache] miss-on-error, falling back, userId={}", userId, e);
  state = jwtService.fetchFromDb(userId);  // or a safe default
}
return process(state);
```

### 2. Minimize external dependencies on the hot path

Every external call (Redis, DB, downstream service) is a potential 500. Hot path should:
- Cache aggressively
- Use circuit breakers
- Have fallback values for the cache itself

### 3. Watch the blast radius

Before adding a dependency to the hot path, ask: **"if this dependency dies for 5 minutes, what fraction of requests fail?"** If the answer is "all", the dependency must be:
- Highly available
- Cheap (ms-level latency)
- Optional (fail-open)

### 4. Test hot path failures explicitly

Chaos test: kill the cache, drop the DB, wedge the Redis connection. Hot path should degrade, not collapse.

## Spotting The Hot Path In A Codebase

- Anything called from a global filter / interceptor / middleware
- Anything in `Authentication*`, `Authorization*`, `Audit*`
- Anything called from a `@PreAuthorize`-style annotation evaluator
- Anything that decorates `MDC` / logging context
- Anything in the request entry point of a framework (`DispatcherServlet`, `Filter`, `HandlerInterceptor`)

## Key Takeaways

- **Hot path failures look like total outages.** Always ask "is this on the hot path?" when adding a dependency.
- **Fail open** for hot-path caches and lookups. A degraded experience beats a 500.
- **Failure on cold path = bug. Failure on hot path = incident.** Treat them with proportionate care.

---

## References

- [Google SRE: Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/)
- [[connection_wedge]] — example of a wedge becoming an outage because it hit the hot path

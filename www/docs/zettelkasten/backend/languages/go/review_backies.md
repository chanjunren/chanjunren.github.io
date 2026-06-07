🗓️ 07062026 1150
📎

# review_backies

**Applied companion to the Go notes.** A review of the `backies` service (a single Go backend serving language-learning apps) through the idioms in [[learning_plan]]. Unlike the other notes this is not one atomic concept — it maps real code to the concepts and flags where the code could improve. Paths are relative to the repo root.

## What it does well

| Concept | Where in backies | Notes |
|---|---|---|
| [[dependency_injection]] | `cmd/api/main.go`, `internal/materia/routes.go` | Clean composition root. `main` wires config → db → services → routes; `RegisterRoutes` cascades deps down. No framework. |
| [[interfaces]] | `internal/materia/services/*.go` | Interfaces (`QuoteReader`, `SourceWriter`) defined in the **consumer**, not the repo package. Accept-interface / return-struct throughout. |
| [[project_structure]] | `internal/<domain>/`, `internal/shared/` | Grouped by domain (`materia`, `grafana`, `lark`) with shared infra split out. `shared/httpx` is correctly named to dodge the `net/http` clash. |
| [[struct_embedding]] | `metrics/middleware.go`, `alerting/middleware.go` | `responseWriter` / `alertResponseWriter` embed `http.ResponseWriter` and override `WriteHeader` to capture status — textbook wrapper. |
| [[channels]] · [[select]] | `alerting/alerter.go` | `LarkAlerter` = buffered `chan` (100) + single `consume()` goroutine; non-blocking `select { default: drop }` on send; `Close()` closes the channel and waits on `done` to drain. |
| [[sync_primitives]] | `health/registry.go`, `alerting/rate_limiter.go` | `RWMutex` with a snapshot-then-release pattern in the health registry; `sync.Map` for the per-key rate limiter. |
| [[panic_recover]] | `alerting/safe_go.go` | `SafeGo` recovers goroutine panics so a background task can't crash the process. |
| [[graceful_shutdown]] | `server/server.go` `Start()` | `signal.Notify` on SIGINT/SIGTERM, `select` on errors-vs-signal, `Shutdown(ctx)` with a 30s deadline, then DB close. Server sets no `WriteTimeout` — request duration is governed solely by the router timeout, so long LLM responses aren't cut mid-write. |
| [[custom_error_types]] · [[error_handling]] | `shared/errors/errors.go` | `AppError` implements `Error`/`Unwrap`; `RespondError` uses `errors.As` to map to a status. 500s send a generic message and log the wrapped cause — no internal leakage. |
| [[context]] · [[defer]] | repos/services/handlers; `main.go` | `ctx` is the first param across I/O; `Init` functions return a cleanup `func()` used as `defer closeAlerting()` / `defer cancel()`. Per-route timeouts (`httpx.DefaultTimeout` 3s, `httpx.LLMTimeout` 180s) applied as sibling groups, since a context deadline can only be shortened, never lengthened. |

## Could improve

| Priority | Issue | Location | Suggestion |
|---|---|---|---|
| High | **No tests anywhere** — every package reports `[no test files]`. | whole repo | Start with table-driven tests on services using interface fakes ([[testing]]). The interface-based DI already makes this easy. |
| Low | **Package-level mutable singletons** (`defaultAlerter`, `defaultQuoteMetrics` + `SetDefault`). | `alerting/alerter.go`, `metrics/quote_metrics.go` | Convenient and consistent with the codebase, but global mutable state is ordering-sensitive and harder to isolate in tests. Acceptable; just know the trade-off. |
| Low | **Silent alert drops** when the buffer is full (`select default`). | `alerting/alerter.go` | By design, but increment a metric on drop so it's observable rather than invisible. |
| Low | **`interface{}` instead of `any`** in response helpers. | `httpx/response.go` | Cosmetic modernize (`go vet`/modernize flags it). |

```ad-warning
The earlier `WriteTimeout`-vs-router-`Timeout` mismatch (which truncated long responses at 15s) has been fixed — the server now sets no `WriteTimeout`. The biggest remaining gap is the **total absence of tests** on a codebase that's otherwise production-shaped.
```

## References

- [[learning_plan]]
- Repo: `backies` (`cmd/api`, `internal/`)

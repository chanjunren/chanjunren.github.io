🗓️ 07062026 1110
📎

# graceful_shutdown

**Core Concept**: On a stop signal, stop accepting new work, let in-flight work finish within a deadline, then release resources — instead of dying mid-request. Essential for zero-downtime deploys.

## Why it matters

Orchestrators (Kubernetes, systemd) stop a process by sending `SIGTERM`, then `SIGKILL` after a grace period. If you ignore `SIGTERM`, in-flight requests are cut off and connections drop. Graceful shutdown drains cleanly within that window.

## The three moving parts

1. **Catch the signal** — `signal.Notify` delivers OS signals to a channel.
2. **Wait** — block on either the signal or a fatal server error, using [[select]].
3. **Drain with a deadline** — `Shutdown(ctx)` stops new connections and waits for active ones, bounded by a [[context]] timeout.

```go
stop := make(chan os.Signal, 1)
signal.Notify(stop, os.Interrupt, syscall.SIGTERM)  // buffered: never miss it
```

The signal channel is **buffered (size 1)** so the signal isn't lost if it arrives before you're blocked on the receive.

## Run the server in a goroutine, then select

`ListenAndServe` blocks forever, so run it in a [[goroutines]] and report its error on a channel. The main flow then waits on *either* that error *or* the stop signal.

```go
serverErr := make(chan error, 1)
go func() { serverErr <- srv.ListenAndServe() }()

select {
case err := <-serverErr:
    return err                       // server died on its own
case <-stop:
    // got SIGTERM — begin graceful shutdown
}
```

## Drain with a bounded context

`srv.Shutdown(ctx)` stops accepting connections and waits for active requests to complete — but only until `ctx` expires. Give it a sensible deadline (a bit under the orchestrator's grace period).

```go
ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
defer cancel()

if err := srv.Shutdown(ctx); err != nil {
    return fmt.Errorf("graceful shutdown: %w", err)   // deadline hit -> forced
}
```

## Clean up the rest in LIFO order

After the HTTP server drains, close the remaining resources — DB pools, message consumers, flush metrics. [[defer]] runs in **last-in-first-out** order, which naturally tears down in reverse of setup (close DB before the logger that records the close).

```ad-warning
Close in reverse dependency order. If you `defer db.Close()` then `defer metrics.Shutdown()`, metrics shuts down first — so a final "db closed" metric is lost. Order your defers (or explicit closes) so dependents go before their dependencies.
```

## Examples

```ad-example
A reusable Start that owns the full lifecycle:
```go
func (s *Server) Start() error {
    serverErr := make(chan error, 1)
    go func() { serverErr <- s.http.ListenAndServe() }()

    stop := make(chan os.Signal, 1)
    signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

    select {
    case err := <-serverErr:
        return fmt.Errorf("server error: %w", err)
    case <-stop:
        slog.Info("shutdown signal received, draining")
    }

    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    if err := s.http.Shutdown(ctx); err != nil {
        return fmt.Errorf("drain: %w", err)
    }
    return s.db.Close()
}
```
```

## References

- [http.Server.Shutdown](https://pkg.go.dev/net/http#Server.Shutdown)
- [[learning_plan]]

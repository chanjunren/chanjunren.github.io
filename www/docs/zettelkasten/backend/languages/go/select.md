🗓️ 07062026 1040
📎

# select

**Core Concept**: `select` waits on multiple channel operations at once and proceeds with the first one that's ready. It's the control structure that makes [[channels]] composable.

## The basic shape

`select` looks like a `switch`, but each case is a channel send or receive. It blocks until one case can proceed; if several are ready, it picks one at random (preventing starvation).

```go
select {
case v := <-ch1:
    use(v)
case ch2 <- x:
    sent()
}
```

Without `select` a goroutine can only wait on one channel. With it, a goroutine can juggle several — results, cancellation, timeouts — in one place.

## default: make it non-blocking

A `default` case runs immediately if no other case is ready. This turns a blocking operation into a try-once, which is how you implement "send if possible, otherwise drop".

```go
select {
case ch <- event:
    // delivered
default:
    // buffer full — drop it, don't block the caller
}
```

This pattern keeps a hot path from blocking on a slow consumer — useful for best-effort telemetry or alerting where dropping under load is acceptable.

## Timeouts with time.After

`time.After(d)` returns a channel that fires once after `d`. Put it in a `select` to bound how long you wait.

```go
select {
case res := <-work:
    return res, nil
case <-time.After(2 * time.Second):
    return nil, errors.New("timed out")
}
```

For request-scoped deadlines, prefer `ctx.Done()` over `time.After` — it composes with the whole call tree. See [[context]].

## The done-channel / cancellation pattern

The canonical way to stop a goroutine: give it a channel (or a context) it watches in a `select` loop. When the channel closes, the loop returns and the goroutine exits — no leak.

```go
func worker(jobs <-chan Job, done <-chan struct{}) {
    for {
        select {
        case j := <-jobs:
            j.Run()
        case <-done:        // closed -> this case fires immediately
            return
        }
    }
}
```

```ad-warning
A `select` with no ready case and no `default` blocks until one becomes ready — possibly forever. Always include either a `default`, a timeout, or a `done`/`ctx.Done()` case when a permanent block would be a bug.
```

## Disabling a case with nil

Receiving from or sending to a nil channel blocks forever, so setting a case's channel variable to `nil` effectively removes that branch from the `select`. This is how you dynamically turn cases on and off inside a loop.

## Examples

```ad-example
Waiting on either a server error or a shutdown signal (the heart of [[graceful_shutdown]]):
```go
serverErr := make(chan error, 1)
go func() { serverErr <- srv.ListenAndServe() }()

stop := make(chan os.Signal, 1)
signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

select {
case err := <-serverErr:
    return fmt.Errorf("server failed: %w", err)
case <-stop:
    return srv.Shutdown(context.Background())  // graceful
}
```
```

## References

- [Go Tour: Select](https://go.dev/tour/concurrency/5)
- [Effective Go: Concurrency](https://go.dev/doc/effective_go#concurrency)

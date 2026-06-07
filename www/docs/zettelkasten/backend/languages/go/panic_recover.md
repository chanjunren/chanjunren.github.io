🗓️ 07062026 1100
📎

# panic_recover

**Core Concept**: `panic` aborts the normal flow and unwinds the stack; `recover` (inside a [[defer]]) stops that unwind and regains control. They are for **bugs and catastrophes**, not ordinary failures — those are values, per [[error_handling]].

## panic is not an exception

It's tempting to treat `panic`/`recover` like Java's `throw`/`catch`. Don't. Idiomatic Go returns errors for anything a caller might reasonably handle. Reserve `panic` for:

- programmer bugs that should never happen (impossible switch case, broken invariant)
- unrecoverable startup failures (can't load config, can't bind port)
- truly exceptional runtime faults (nil dereference, index out of range — the runtime panics for you)

If you find yourself recovering to implement normal control flow, the API should return an `error` instead.

## How recover works

`recover` only does something when called **directly inside a deferred function** during a panic. It returns the panic value and halts the unwinding; the function then returns normally.

```go
func safeRun() (err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered: %v", r)
        }
    }()
    riskyThing()      // may panic
    return nil
}
```

Note the **named return value** `err` — the deferred closure assigns it so the caller sees an error instead of a crash.

## Panics cross goroutine boundaries — badly

A panic only unwinds **its own** goroutine's stack. An unrecovered panic in *any* goroutine crashes the **entire process**. So a deferred `recover` in `main` or an HTTP handler does **not** protect a goroutine you launched with `go`.

```ad-danger
Every goroutine you start must recover its own panics, or one stray panic takes down the whole service. Wrap background goroutines in a helper that defers a recover.
```

## When to recover

Recover at **boundaries**, not everywhere:

- **Server middleware** — turn a handler panic into a 500 instead of killing the server (the stdlib and chi provide a `Recoverer` middleware for exactly this).
- **Goroutine launchers** — a `SafeGo`-style wrapper that recovers, logs, and optionally alerts, so a background task can't crash the process.
- **Worker loops** — recover per iteration so one bad item doesn't stop the worker.

Everywhere else, let panics propagate — they signal a bug you want to find, not hide.

## re-panic and cleanup

A deferred function can inspect the panic and choose to clean up and **re-panic** (just call `panic(r)` again) if it can't actually handle it. Don't swallow panics you don't understand.

## Examples

```ad-example
A wrapper that makes background goroutines panic-safe:
```go
func SafeGo(fn func()) {
    go func() {
        defer func() {
            if r := recover(); r != nil {
                slog.Error("goroutine panicked", "panic", r)
                // optionally: alert, increment a metric
            }
        }()
        fn()
    }()
}

// usage — a panic in here is logged, not fatal:
SafeGo(func() { recomputeStats() })
```
```

## References

- [Go Blog: Defer, Panic, and Recover](https://go.dev/blog/defer-panic-and-recover)
- [[goroutines]]

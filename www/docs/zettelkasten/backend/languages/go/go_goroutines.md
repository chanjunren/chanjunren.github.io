🗓️ 02112024 2312
📎

# go_goroutines

**Core Concept**: Goroutines are lightweight, independently executing functions managed by the Go runtime.

## Why It Matters

Enable concurrent programming with minimal overhead. Thousands of goroutines can run simultaneously. Core feature of Go.

## When to Use

✅ **Use when:**
- I/O-bound operations (network, file)
- Independent tasks can run concurrently
- Need to handle multiple requests simultaneously
- Background processing

❌ **Don't use when:**
- Sequential operations required
- Shared state without synchronization
- Uncertain about race conditions

## vs Java Threads

| Java Threads | Go Goroutines |
|--------------|---------------|
| ~1MB stack | ~2KB stack (grows as needed) |
| OS-managed | Go runtime-managed |
| Heavy creation cost | Cheap creation |
| Thread pools needed | Create freely |

```ad-danger
Always ensure goroutines can exit. Use [[go_context]] for cancellation to prevent goroutine leaks.
\`\`\`

## Trade-offs

**Pros**: Lightweight, easy creation, efficient scheduling  
**Cons**: Requires synchronization, race conditions possible, debugging harder

Goroutines work with [[go_context]] for cancellation and channels for communication.

## Quick Reference

```go
// Start goroutine with go keyword
go doWork()

// Anonymous function goroutine
go func() {
    fmt.Println("Running concurrently")
}()

// With parameters (evaluated immediately)
go process(data)

// Proper cancellation with context
func worker(ctx context.Context) {
    for {
        select {
        case <-ctx.Done():
            return  // Exit when cancelled
        default:
            // do work
        }
    }
}

ctx, cancel := context.WithCancel(context.Background())
go worker(ctx)
// Later: cancel() to stop goroutine
```

## Common Patterns

**Wait for completion:**
```go
var wg sync.WaitGroup
wg.Add(1)
go func() {
    defer wg.Done()
    doWork()
}()
wg.Wait()
```

**Fan-out (multiple workers):**
```go
for i := 0; i < numWorkers; i++ {
    go worker(i, jobs, results)
}
```

## References

- [Go Tour: Goroutines](https://go.dev/tour/concurrency/1)
- [Effective Go: Goroutines](https://go.dev/doc/effective_go#goroutines)


🗓️ 02112024 2302
📎

# go_context

**Core Concept**: Context carries request-scoped values, cancellation signals, and deadlines across API boundaries.

## Why It Matters

Enables graceful cancellation of operations. Prevents goroutine leaks. Required for production services.

## When to Use

✅ **Pass context when:**
- Making HTTP requests
- Querying databases
- Calling other services
- Long-running operations

❌ **Don't:**
- Store in structs
- Use for optional parameters

## vs Java ThreadLocal

**Java:** ThreadLocal (thread-bound, implicit)  
**Go:** context.Context (request-bound, explicit passing)

Context must be passed explicitly as first parameter, preventing hidden dependencies.

```ad-warning
Always call `cancel()` to prevent leaks, even if operation succeeds.
\`\`\`

## Trade-offs

**Pros**: Cancellation, deadlines, tracing  
**Cons**: Verbose (first param everywhere), easy to ignore

Context propagation is essential for [[go_goroutines]] to enable clean cancellation.

## Quick Reference

```go
// Always first parameter
func DoWork(ctx context.Context, data string) error {
    select {
    case <-ctx.Done():
        return ctx.Err()  // Cancelled
    default:
        // continue work
    }
}

// Creating contexts
ctx := context.Background()          // Root
ctx := context.TODO()                // Placeholder
ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
defer cancel()  // Always defer

ctx, cancel := context.WithCancel(ctx)
ctx = context.WithValue(ctx, key, value)
```

| Function | Use Case |
|----------|----------|
| `Background()` | Root, main, tests |
| `TODO()` | Placeholder |
| `WithTimeout()` | Time-bound operations |
| `WithCancel()` | Manual cancellation |
| `WithValue()` | Request-scoped data |

## References

- [Go Blog: Context](https://go.dev/blog/context)


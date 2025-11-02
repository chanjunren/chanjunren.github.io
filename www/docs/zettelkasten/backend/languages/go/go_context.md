🗓️ 02112024 2240
📎

# go_context

**Core Concept**: Context carries request-scoped values, cancellation signals, and deadlines across API boundaries.

## Why It Matters

Enables graceful cancellation of operations. Prevents goroutine leaks. Required for production services.

## Quick Reference

```go
// Always first parameter
func DoWork(ctx context.Context, data string) error {
    // Check for cancellation
    select {
    case <-ctx.Done():
        return ctx.Err()
    default:
        // continue work
    }
}

// Creating contexts
ctx := context.Background()          // Root context
ctx := context.TODO()                // Placeholder
ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
defer cancel()  // Always call cancel

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

**Java:** `ThreadLocal` (thread-bound)  
**Go:** `context.Context` (request-bound, explicit passing)

Context must be passed explicitly, preventing hidden dependencies.

## Common Pitfalls

```ad-warning
Always call `cancel()` to prevent leaks:
```go
ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
defer cancel()  // MUST call, even if operation succeeds
```
\`\`\`

## Trade-offs

**Pros**: Cancellation, deadlines, tracing  
**Cons**: Verbose (first param everywhere), easy to ignore

Context propagation is essential for [[go_goroutines]] to enable clean cancellation.

## References

- [Go Blog: Context](https://go.dev/blog/context)


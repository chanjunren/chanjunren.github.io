🗓️ 02112024 2256
📎

# go_defer

**Core Concept**: Defer executes a function when the surrounding function returns, regardless of how it returns.

## Why It Matters

Guarantees cleanup (files, connections, locks) without try-finally blocks. Prevents resource leaks.

## When to Use

✅ **Use for:**
- Cleanup of resources
- Unlocking mutexes
- Closing files/connections

❌ **Don't use for:**
- Long-running operations
- Loops (defers accumulate)

## vs Java try-with-resources

**Java:** try-with-resources auto-closes  
**Go:** defer + Close() - explicit but guaranteed

```ad-warning
Defer in loop accumulates until function ends. Wrap in func() for per-iteration cleanup.
\`\`\`

## Trade-offs

**Pros**: Guaranteed cleanup, clear intent  
**Cons**: Delayed execution, loop gotcha

Defer is commonly used with [[go_error_handling]] for cleanup before returns.

## Quick Reference

```go
// Basic usage
file, err := os.Open("data.txt")
if err != nil {
    return err
}
defer file.Close()  // Executes when function returns

// Multiple defers (LIFO order)
defer fmt.Println("First")
defer fmt.Println("Second")
defer fmt.Println("Third")
// Prints: Third, Second, First

// Loop pattern
for _, f := range files {
    func() {
        f, _ := os.Open(f)
        defer f.Close()  // Closes each iteration
    }()
}
```

| Pattern | Use Case |
|---------|----------|
| `defer file.Close()` | Close files |
| `defer conn.Close()` | Close connections |
| `defer mu.Unlock()` | Release locks |
| `defer resp.Body.Close()` | HTTP responses |

## References

- [Go Tour: Defer](https://go.dev/tour/flowcontrol/12)


🗓️ 02112024 2234
📎

# go_defer

**Core Concept**: Defer executes a function when the surrounding function returns, regardless of how it returns.

## Why It Matters

Guarantees cleanup (files, connections, locks) without try-finally blocks. Prevents resource leaks.

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
```

| Pattern | Use Case |
|---------|----------|
| `defer file.Close()` | Close files |
| `defer conn.Close()` | Close connections |
| `defer mu.Unlock()` | Release locks |
| `defer resp.Body.Close()` | HTTP responses |

## When to Use

✅ **Use for:**
- Cleanup of resources
- Unlocking mutexes
- Closing files/connections

❌ **Don't use for:**
- Long-running operations
- Loops (defers accumulate)

## vs Java try-with-resources

**Java:**
```java
try (Connection c = getConn()) {
    // use c
}  // auto-closed
```

**Go:**
```go
c, _ := getConn()
defer c.Close()
// use c
// closed when function returns
```

## Common Pitfalls

```ad-warning
Defer in loop accumulates, doesn't execute until function ends:
```go
// ❌ BAD
for _, f := range files {
    f, _ := os.Open(f)
    defer f.Close()  // All close at end
}

// ✅ GOOD
for _, f := range files {
    func() {
        f, _ := os.Open(f)
        defer f.Close()  // Closes each iteration
    }()
}
```
\`\`\`

## Trade-offs

**Pros**: Guaranteed cleanup, clear intent  
**Cons**: Delayed execution, loop gotcha

Defer is commonly used with [[go_error_handling]] for cleanup before returns.

## References

- [Go Tour: Defer](https://go.dev/tour/flowcontrol/12)


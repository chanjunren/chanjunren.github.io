🗓️ 02112024 2254
📎

# go_error_handling

**Core Concept**: Errors are values returned explicitly, not exceptions thrown implicitly.

## Why It Matters

Forces explicit handling at each call site. No hidden control flow. Foundation of Go's reliability.

## When to Use

✅ **Return error when:**
- Operation can fail
- Caller decides handling

❌ **Don't return error when:**
- Programming errors (use panic)
- Can handle internally

## vs Java Exceptions

**Java:** try/catch (hidden control flow)  
**Go:** Explicit if err != nil at each call

Go errors are values - can inspect, wrap, pass around.

```ad-warning
Wrapping without `%w` loses error chain. Use `fmt.Errorf("context: %w", err)` not `%v`.
\`\`\`

## Trade-offs

**Pros**: Explicit, clear flow, composable  
**Cons**: Verbose, repetitive checks

Error wrapping builds on [[go_interfaces]] (error interface).

## Quick Reference

```go
// Basic pattern
result, err := operation()
if err != nil {
    return fmt.Errorf("operation failed: %w", err)
}

// Wrap errors
return fmt.Errorf("context: %w", err)

// Check specific error
if errors.Is(err, sql.ErrNoRows) { }

// Sentinel errors
var ErrNotFound = errors.New("not found")
```

| Pattern | Use | Example |
|---------|-----|---------|
| `errors.New` | Static error | `errors.New("failed")` |
| `fmt.Errorf` | Dynamic message | `fmt.Errorf("id: %d", id)` |
| `%w` | Wrap error | `fmt.Errorf("save: %w", err)` |
| `errors.Is` | Check type | `errors.Is(err, ErrNotFound)` |

## Examples

```ad-example
**Error wrapping with context:**
```go
func SaveUser(user *User) error {
    if err := validate(user); err != nil {
        return fmt.Errorf("validation failed: %w", err)
    }
    
    if err := db.Insert(user); err != nil {
        return fmt.Errorf("failed to save user %s: %w", user.Name, err)
    }
    
    return nil
}

// Caller can check root cause
err := SaveUser(user)
if errors.Is(err, sql.ErrNoRows) {
    // Handle specific database error
}
```

**Sentinel errors for control flow:**
```go
var (
    ErrNotFound    = errors.New("user not found")
    ErrInvalidData = errors.New("invalid user data")
)

func FindUser(id int) (*User, error) {
    if id < 0 {
        return nil, ErrInvalidData
    }
    
    user := db.Query(id)
    if user == nil {
        return nil, ErrNotFound
    }
    
    return user, nil
}

// Caller checks specific errors
user, err := FindUser(5)
if errors.Is(err, ErrNotFound) {
    return nil, status.Error(codes.NotFound, "user not found")
}
if errors.Is(err, ErrInvalidData) {
    return nil, status.Error(codes.InvalidArgument, "bad request")
}
```
\`\`\`

## References

- [Go Blog: Error Handling](https://go.dev/blog/error-handling-and-go)


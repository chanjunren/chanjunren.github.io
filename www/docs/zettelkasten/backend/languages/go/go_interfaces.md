🗓️ 02112024 2236
📎

# go_interfaces

**Core Concept**: Interfaces define behavior contracts; types implement them implicitly (duck typing).

## Why It Matters

Enables polymorphism without inheritance. Foundation for dependency injection and testing.

## Quick Reference

```go
// Define interface
type Reader interface {
    Read(p []byte) (n int, err error)
}

// Implement implicitly (no "implements" keyword)
type FileReader struct{}

func (f FileReader) Read(p []byte) (int, error) {
    // implementation
}
// FileReader is now a Reader

// Use interface as parameter
func process(r Reader) {
    r.Read(buf)
}
```

| Concept | Java | Go |
|---------|------|-----|
| Declaration | `class X implements I` | Implicit |
| Empty interface | `Object` | `interface{}` |
| Type check | `instanceof` | Type assertion |

## When to Use

✅ **Use when:**
- Defining contracts
- Dependency injection
- Multiple implementations

❌ **Don't use when:**
- Only one implementation
- Premature abstraction

## Key Principle

**Accept interfaces, return structs**

```go
// ✅ GOOD
func New(repo UserRepository) *Service {
    return &Service{repo: repo}
}

// ❌ BAD
func New(repo *PostgresRepo) *Service {
    return &Service{repo: repo}
}
```

This contrasts with [[go_type_assertions]] where you convert interfaces back to concrete types.

## Common Patterns

**Small interfaces (1-3 methods):**
```go
type Reader interface {
    Read([]byte) (int, error)
}

type Writer interface {
    Write([]byte) (int, error)
}
```

## Trade-offs

**Pros**: Loose coupling, testability, flexibility  
**Cons**: Runtime overhead, less explicit

## References

- [Effective Go: Interfaces](https://go.dev/doc/effective_go#interfaces)


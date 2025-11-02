🗓️ 02112024 2252
📎

# go_pointers

**Core Concept**: Pointers hold memory addresses, enabling modification of values without copying.

## Why It Matters

Control whether functions modify original values. Required for understanding Go's method receivers and memory model.

## When to Use

✅ **Use when:**
- Need to modify original value
- Large structs (avoid copy overhead)
- Optional values (nil)

❌ **Don't use when:**
- Small types (int, bool, string)
- Can use value semantics

## vs Java References

Unlike Java references, Go is pass-by-value even for pointers. Explicit nil checking required. No pointer arithmetic.

```ad-danger
Nil pointer dereference causes panic. Always check: `if p != nil { *p = 5 }`
\`\`\`

## Trade-offs

**Pros**: Direct mutation, memory efficiency  
**Cons**: Complexity, nil panics, shared mutable state

To understand why pointers are passed by value, see [[go_pass_by_value]].

## Quick Reference

```go
// Declare pointer
var p *int

// Get address
x := 42
p = &x

// Dereference (access/modify value)
*p = 100  // x is now 100

// Pass to function
func modify(p *int) { *p = 50 }
modify(&x)
```

| Operation | Syntax | Purpose |
|-----------|--------|---------|
| Get address | `&x` | Create pointer |
| Dereference | `*p` | Access value |
| Pointer type | `*Type` | Type definition |
| Zero value | `nil` | Uninitialized |

## Examples

```ad-example
**Modifying struct fields:**
```go
type User struct {
    Name  string
    Score int
}

// Value receiver - no mutation
func (u User) IncreaseScoreWrong(points int) {
    u.Score += points  // Only modifies copy
}

// Pointer receiver - mutates original
func (u *User) IncreaseScore(points int) {
    u.Score += points  // Modifies original
}

user := User{Name: "Alice", Score: 10}
user.IncreaseScoreWrong(5)
fmt.Println(user.Score)  // 10 (unchanged)

user.IncreaseScore(5)
fmt.Println(user.Score)  // 15 (changed)
```

**Optional values with nil:**
```go
func findUser(id int) *User {
    if id < 0 {
        return nil  // Not found
    }
    return &User{Name: "Alice"}
}

user := findUser(5)
if user != nil {
    fmt.Println(user.Name)  // Safe access
}
```
\`\`\`

## References

- [Go Tour: Pointers](https://go.dev/tour/moretypes/1)


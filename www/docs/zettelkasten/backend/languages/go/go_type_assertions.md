🗓️ 02112024 2238
📎

# go_type_assertions

**Core Concept**: Type assertions check and convert `interface{}` values to specific types at runtime.

## Why It Matters

Work safely with empty interfaces. Enable optional behavior patterns. Required for reflection-like operations.

## Quick Reference

```go
// Safe "comma-ok" idiom (recommended)
value, ok := interfaceVar.(ConcreteType)
if ok {
    // use value
}

// Type switch
switch v := i.(type) {
case int:
    fmt.Println("int:", v)
case string:
    fmt.Println("string:", v)
}

// Optional behavior pattern
if validator, ok := v.(Validator); ok {
    validator.Validate()
}
```

| Pattern | Safety | Use When |
|---------|--------|----------|
| `v := i.(T)` | Panics | You're certain |
| `v, ok := i.(T)` | Returns false | Production code |
| `switch i.(type)` | Safe | Multiple types |

## When to Use

✅ **Use when:**
- Working with `interface{}`
- Optional interfaces
- Type unknown at compile time

❌ **Avoid when:**
- You control the type
- Can use proper interfaces

## Real Example

```go
func DecodeAndValidate(r *http.Request, v interface{}) error {
    json.NewDecoder(r.Body).Decode(v)
    
    // Check if v has Validate() method
    if validator, ok := v.(Validator); ok {
        return validator.Validate()
    }
    return nil
}
```

**What's happening:** 
1. `v` is `interface{}` (any type)
2. `v.(Validator)` asks: "Does v have Validate()?"
3. If `ok == true`: call method
4. If `ok == false`: skip

## Common Pitfalls

```ad-danger
Unsafe assertion panics on wrong type:
```go
var i interface{} = 42
s := i.(string)  // PANIC
```
Always use comma-ok: `s, ok := i.(string)`
\`\`\`

## Trade-offs

**Pros**: Flexible, optional behavior  
**Cons**: Runtime overhead, less type safety

Type assertions build on [[go_interfaces]] to enable runtime polymorphism.

## References

- [Go Tour: Type Assertions](https://go.dev/tour/methods/15)


🗓️ 02112024 2310
📎

# go_pass_by_value

**Core Concept**: Go always passes arguments by value - copies are made of all parameters, including pointers.

## Why It Matters

Explains why modifying parameters doesn't affect original values unless using pointers. Critical for understanding [[go_pointers]].

## When to Use

This is not a pattern to "use" - it's how Go always works. You choose whether to pass values or pointers based on whether you need mutation.

## Key Distinction

**Pass value:**
```go
func increment(x int) {
    x = x + 1  // Modifies copy, not original
}

a := 5
increment(a)
fmt.Println(a)  // Still 5
```

**Pass pointer (pointer value is copied, but points to same address):**
```go
func increment(x *int) {
    *x = *x + 1  // Dereferences and modifies original
}

b := 5
increment(&b)
fmt.Println(b)  // Now 6
```

## vs Java References

| Java | Go |
|------|-----|
| Objects passed by reference | Everything passed by value |
| Primitives passed by value | Pointers passed by value (address copied) |
| No pointer syntax | Explicit `&` and `*` |

## Trade-offs

**Pros**: Predictable, no hidden side effects, explicit mutation  
**Cons**: Large structs can be expensive to copy

This is why [[go_pointers]] are necessary - to pass the address (by value) instead of copying large data.

## Quick Reference

```go
// Value passed - copy made
func modifyValue(s MyStruct) {
    s.Field = "changed"  // Changes copy only
}

// Pointer passed - address copied, data accessible
func modifyPointer(s *MyStruct) {
    s.Field = "changed"  // Changes original
}

// Even the pointer itself is copied!
func reassignPointer(p *int) {
    newVal := 100
    p = &newVal  // Only changes local copy of pointer
}
```

**Key insight**: When you pass a pointer, the address is copied, but both the original and copy point to the same memory location.

## References

- [Go FAQ: Pass by Value](https://go.dev/doc/faq#pass_by_value)
- [Effective Go: Pointers vs Values](https://go.dev/doc/effective_go#pointers_vs_values)


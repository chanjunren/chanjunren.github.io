🗓️ 07062026 1000
📎

# struct_methods

**Core Concept**: A method is a function with a **receiver** — a typed value it's attached to. Go has no classes; behaviour lives in methods bound to types.

## What a method is

A method is declared like a function, but with an extra parameter in parentheses before the name — the receiver. That receiver binds the function to a type.

```go
type Counter struct {
    count int
}

func (c Counter) Value() int {  // (c Counter) is the receiver
    return c.count
}
```

The receiver works like `this` in Java, except it's explicit and you name it yourself (convention: a short letter, not `self`/`this`).

Methods can be defined on any named type you own, not just structs — `type Celsius float64` can have methods too.

## Value vs pointer receivers

This is the decision that trips up Java developers. The receiver is passed **by value** (a copy) just like any other argument — see [[pass_by_value]]. So a value receiver gets a copy and **cannot mutate the original**.

```go
func (c Counter) IncBroken() { c.count++ }  // mutates the copy — lost
func (c *Counter) Inc()      { c.count++ }  // mutates the original
```

Use a **pointer receiver** when:
- the method mutates the receiver
- the struct is large (avoid copying it on every call)
- *any* method needs a pointer — then make them all pointer receivers for consistency

Use a **value receiver** when the type is small and immutable in practice (a few fields, no mutation). See [[pointers]] for the underlying mechanics.

```ad-warning
Don't mix receiver kinds on the same type. If one method needs a pointer receiver, give them all pointer receivers — mixed sets are a common source of subtle bugs and confusing method-set rules.
```

## Method sets and interface satisfaction

Which methods a type "has" depends on whether you hold a value or a pointer — this decides whether it satisfies an interface (see [[interfaces]]).

- Methods with **value receivers** belong to both `T` and `*T`.
- Methods with **pointer receivers** belong only to `*T`.

So if `Inc` has a pointer receiver, a plain `Counter` value does **not** satisfy an interface requiring `Inc()` — only `*Counter` does. This is why constructors usually return `*T`.

```go
type Incrementer interface{ Inc() }

var i Incrementer = &Counter{}  // ✅ *Counter satisfies it
var j Incrementer = Counter{}   // ❌ compile error: Inc needs *Counter
```

## Nil receivers are valid

A method can be called on a nil pointer — Go doesn't auto-panic. The method runs with a nil receiver; panicking only happens if it dereferences a field. This lets you write methods that handle the nil case gracefully.

```go
func (c *Counter) ValueOrZero() int {
    if c == nil {
        return 0
    }
    return c.count
}
```

## Examples

```ad-example
Pointer receiver for mutation, returned as a pointer:
```go
type Account struct {
    balance int
}

func NewAccount() *Account {        // return *Account
    return &Account{}
}

func (a *Account) Deposit(amount int) {
    a.balance += amount             // mutates the real account
}

func (a *Account) Balance() int {
    return a.balance
}

acc := NewAccount()
acc.Deposit(100)
fmt.Println(acc.Balance())          // 100
```
```

## References

- [Effective Go: Methods](https://go.dev/doc/effective_go#methods)
- [Go Tour: Methods](https://go.dev/tour/methods/1)

🗓️ 07062026 1020
📎

# dependency_injection

**Core Concept**: Pass a type's dependencies in through a constructor function. No container, no `@Autowired`, no reflection — you wire the graph by hand at one place.

## The whole pattern

A constructor (`NewXxx`) takes dependencies as parameters and returns a ready-to-use struct. Dependencies are declared as **interfaces** so callers can swap implementations; the constructor returns a **concrete struct**. This is the "accept interfaces, return structs" rule from [[interfaces]].

```go
type UserService struct {
    repo UserRepository   // an interface
}

func NewUserService(repo UserRepository) *UserService {
    return &UserService{repo: repo}
}
```

That's it. There's no framework doing this for you — and that's the point. Wiring is ordinary code you can read, step through, and reason about.

## The composition root

Everything gets wired in one place, usually `main`. This is the **composition root**: the only spot that knows concrete types. It builds leaves first (config, db client), then the things that depend on them, then passes those down.

```go
func main() {
    cfg := config.Load()
    db := database.Connect(cfg)

    repo := NewUserRepository(db)        // leaf
    svc := NewUserService(repo)          // depends on repo
    handler := NewUserHandler(svc)       // depends on svc

    http.Handle("/users", handler)
}
```

Dependencies flow **down** the construction chain. Each layer receives what it needs and knows nothing about how those were built.

## Why explicit beats magic

Coming from Spring, the absence of a container feels like a step back. It isn't:

- **You can see the whole graph** in one function — no hidden autowiring, no startup surprises.
- **No reflection or tags** — wiring is compile-checked. A missing dependency is a build error, not a runtime one.
- **Testing needs no framework** — pass a fake that satisfies the interface (see [[struct_methods]] for why method sets matter here).

```go
svc := NewUserService(&fakeRepo{})   // no mocking library required
```

## Keep constructors honest

- Constructors take 3–4 params max. More than that signals the type does too much — group related deps into a small struct, or split the type.
- Return `*T` (a pointer) so pointer-receiver methods are available and callers share one instance. See [[pointers]].
- A constructor that can fail returns `(*T, error)` — wire-time failures (bad config, no DB) surface immediately.

```ad-warning
Don't reach for a DI framework (wire, fx, dig) early. Hand-wiring is idiomatic and clear for most services. Reach for codegen tools only when the graph is genuinely large and the boilerplate hurts.
```

## Examples

```ad-example
Service depending on another service, wired explicitly:
```go
type SourceService struct {
    repo  SourceRepository
    quote QuoteReader        // another service, as an interface
}

func NewSourceService(repo SourceRepository, quote QuoteReader) *SourceService {
    return &SourceService{repo: repo, quote: quote}
}

// in main / composition root:
quoteSvc  := NewQuoteService(quoteRepo)
sourceSvc := NewSourceService(sourceRepo, quoteSvc)  // pass it down
```
```

## References

- [[learning_plan]]
- [Effective Go](https://go.dev/doc/effective_go)

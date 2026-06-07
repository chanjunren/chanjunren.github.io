🗓️ 07062026 1010
📎

# struct_embedding

**Core Concept**: Embedding puts one type inside another **without a field name**, promoting the inner type's fields and methods to the outer type. It's Go's answer to reuse — composition, not inheritance.

## How it differs from inheritance

There is no `extends` in Go. You embed, and the outer type gains the inner type's API by **promotion**, not by being a subtype.

```go
type Logger struct{ prefix string }
func (l Logger) Log(msg string) { fmt.Println(l.prefix, msg) }

type Service struct {
    Logger          // embedded — no field name
    name string
}

s := Service{Logger: Logger{prefix: "[svc]"}}
s.Log("started")    // promoted: calls s.Logger.Log
```

`Service` is **not** a `Logger` (no subtyping), but it can do everything a `Logger` can. This avoids the fragile base-class problem while keeping the reuse.

## Embedding interfaces

You can embed an interface in a struct. The struct then satisfies that interface by delegating to whatever concrete value you assign — and you can **override** select methods while inheriting the rest. This is the key trick behind decorators and wrappers.

```go
type ResponseWriter interface {
    WriteHeader(statusCode int)
    Write([]byte) (int, error)
}

type capturingWriter struct {
    ResponseWriter      // embedded interface
    status int
}

func (w *capturingWriter) WriteHeader(code int) {
    w.status = code             // capture it...
    w.ResponseWriter.WriteHeader(code)  // ...then delegate
}
```

`capturingWriter` automatically has `Write` (promoted from the embedded interface) and overrides `WriteHeader`. You only write the method you care about. This is the standard way to wrap an `http.ResponseWriter` for metrics, logging, or alerting middleware.

## Method promotion and shadowing

- Promoted methods are called as if defined on the outer type.
- If the outer type defines a method with the same name, it **shadows** the embedded one — the inner method is still reachable via the explicit field name (`w.ResponseWriter.WriteHeader`).
- Embed by type name; access the inner value with that type name as the implicit field (`s.Logger`).

```ad-warning
Embedding is not subtyping. A `Service` with an embedded `Logger` cannot be passed where a `Logger` is expected. If you need that, accept an interface ([[interfaces]]) the outer type satisfies, not the concrete embedded type.
```

## When to embed vs hold a named field

- **Embed** when the outer type genuinely *is-extended-by* the inner behaviour and you want its API surfaced (wrappers, mixins, decorators).
- **Use a named field** ([[struct_methods]]) when the dependency is collaborator you call into, not behaviour you expose. Most service-to-service dependencies are named fields, not embeds.

## Examples

```ad-example
Wrapping a writer to record the status code — embed the interface, override one method:
```go
type statusRecorder struct {
    http.ResponseWriter   // promotes Write, Header, etc.
    status int
}

func (r *statusRecorder) WriteHeader(code int) {
    r.status = code
    r.ResponseWriter.WriteHeader(code)
}

func middleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
        rec := &statusRecorder{ResponseWriter: w, status: 200}
        next.ServeHTTP(rec, req)
        log.Printf("status=%d", rec.status)
    })
}
```
```

## References

- [Effective Go: Embedding](https://go.dev/doc/effective_go#embedding)

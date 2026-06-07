🗓️ 07062026 1120
📎

# custom_error_types

**Core Concept**: Define your own error types to carry structured data (a code, a status, context) and traverse wrapped chains with `errors.Is` / `errors.As`. Builds on the basics in [[error_handling]].

## When a string isn't enough

`fmt.Errorf` is fine until a caller needs to *react differently* to different failures — return 404 vs 409, retry vs give up. Then the error needs structure: a machine-readable code, an HTTP status, maybe details. You get that by making a type that implements the `error` interface.

```go
type AppError struct {
    Code       string  // machine-readable, e.g. "NOT_FOUND"
    Message    string  // human-facing
    StatusCode int     // transport mapping
    Err        error   // the wrapped cause
}

func (e *AppError) Error() string { return e.Message }
func (e *AppError) Unwrap() error { return e.Err }   // enables chain traversal
```

`Error() string` makes it an `error`. `Unwrap() error` plugs it into the wrapping chain so `errors.Is`/`As` can see through it.

## The %w chain

`fmt.Errorf("...: %w", err)` wraps an error, preserving the original underneath. Each layer adds context without discarding the cause — you get a chain like `handler: service: repo: sql: no rows`.

```go
return fmt.Errorf("load user %d: %w", id, err)
```

Use `%w` (wrap, keeps the chain) not `%v` (formats to string, breaks the chain). See the warning in [[error_handling]].

## errors.Is vs errors.As

Two ways to inspect a chain — they answer different questions:

- **`errors.Is(err, target)`** — "is this specific sentinel error anywhere in the chain?" Compares by identity. Use with package-level sentinels.
  ```go
  var ErrNotFound = errors.New("not found")
  if errors.Is(err, ErrNotFound) { ... }
  ```
- **`errors.As(err, &target)`** — "is there an error *of this type* in the chain?" Extracts it so you can read its fields. Use with custom types. This relies on type assertions ([[type_assertions]]) walking the chain.
  ```go
  var appErr *AppError
  if errors.As(err, &appErr) {
      status = appErr.StatusCode
  }
  ```

## Constructors keep call sites clean

Provide small constructors per category so handlers don't hand-build structs:

```go
func NotFound(entity string) *AppError {
    return &AppError{Code: "NOT_FOUND", Message: entity + " not found", StatusCode: 404}
}
func Internal(msg string, err error) *AppError {
    return &AppError{Code: "INTERNAL", Message: msg, StatusCode: 500, Err: err}
}
```

## Mapping a domain error to a response

One central function turns any error into a transport response: `errors.As` to find your type, fall back to a generic 500 otherwise. Handlers just call it — they never set status codes by hand.

```ad-warning
Don't leak internal error text to clients on 500s. Send a generic message and **log** the wrapped cause. Reserve detailed, client-safe messages for 4xx where the caller can act on them.
```

## Examples

```ad-example
Central error responder using errors.As to pick the status:
```go
func RespondError(w http.ResponseWriter, err error) {
    var appErr *AppError
    if !errors.As(err, &appErr) {
        appErr = Internal("unexpected error", err)   // unknown -> 500
    }
    if appErr.StatusCode >= 500 {
        slog.Error("internal", "code", appErr.Code, "error", appErr.Err)  // log cause
    }
    w.WriteHeader(appErr.StatusCode)
    json.NewEncoder(w).Encode(map[string]string{
        "code": appErr.Code, "error": appErr.Message,   // safe, generic
    })
}
```
```

## References

- [Go Blog: Working with Errors](https://go.dev/blog/go1.13-errors)
- [errors package](https://pkg.go.dev/errors)

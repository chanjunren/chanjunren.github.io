🗓️ 26102024 1505

# go_error_handling

**Core Concept**: Go treats errors as values to be explicitly checked, not exceptions to be caught - errors are returned alongside results.

## Basic Pattern

```go
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

// Usage
result, err := divide(10, 2)
if err != nil {
    log.Fatal(err)
}
fmt.Println(result)
```

**Key point**: Check `err != nil` immediately after function call.

## Creating Errors

```go
// Simple error
errors.New("something went wrong")

// Formatted error
fmt.Errorf("failed to process %s: %v", name, err)

// Custom error type
type ValidationError struct {
    Field string
    Value string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("invalid %s: %s", e.Field, e.Value)
}
```

## Error Wrapping (Go 1.13+)

```go
// Wrap error with context
if err != nil {
    return fmt.Errorf("failed to save user: %w", err)
}

// Unwrap
originalErr := errors.Unwrap(wrappedErr)

// Check if error is specific type
if errors.Is(err, sql.ErrNoRows) {
    // handle not found
}

// Check for error type
var validationErr *ValidationError
if errors.As(err, &validationErr) {
    // handle validation error
}
```

```ad-tip
Use `%w` to wrap errors, preserving the error chain for debugging.
```

## Common Patterns

### Guard clause
```go
func process() error {
    if err := step1(); err != nil {
        return err
    }
    
    if err := step2(); err != nil {
        return err
    }
    
    return nil
}
```

### Defer cleanup with error
```go
func readFile(path string) error {
    f, err := os.Open(path)
    if err != nil {
        return err
    }
    defer f.Close()
    
    // work with file
    return nil
}
```

### Multiple returns
```go
func getUser(id int) (*User, error) {
    // success case
    return &User{}, nil
    
    // error case
    return nil, errors.New("not found")
}
```

### Panic vs Error

```go
// Use errors for expected failures
func loadConfig() (*Config, error) {
    // return error if file not found
}

// Use panic for programmer errors (rare!)
func mustLoadConfig() *Config {
    cfg, err := loadConfig()
    if err != nil {
        panic(err)  // should never happen in production
    }
    return cfg
}
```

```ad-warning
**Don't panic**: Use errors for recoverable issues. Panic only for bugs or unrecoverable situations.
```

## Error Handling Strategies

### Return early
```go
func validate(input string) error {
    if input == "" {
        return errors.New("empty input")
    }
    if len(input) > 100 {
        return errors.New("input too long")
    }
    return nil
}
```

### Aggregate errors
```go
var errs []error

for _, item := range items {
    if err := process(item); err != nil {
        errs = append(errs, err)
    }
}

if len(errs) > 0 {
    return fmt.Errorf("failed to process %d items", len(errs))
}
```

### Sentinel errors
```go
var (
    ErrNotFound = errors.New("not found")
    ErrInvalid  = errors.New("invalid input")
)

func getUser(id int) (*User, error) {
    return nil, ErrNotFound
}

// Check with errors.Is
if errors.Is(err, ErrNotFound) {
    // handle not found
}
```

## HTTP Error Handling

```go
func handler(w http.ResponseWriter, r *http.Request) {
    data, err := fetchData()
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    json.NewEncoder(w).Encode(data)
}
```

## Best Practices

1. **Check errors immediately** - Don't ignore them
2. **Add context** - Wrap errors with `fmt.Errorf("%w")`
3. **Handle at appropriate level** - Don't handle too early
4. **Return errors up** - Let caller decide how to handle
5. **Don't panic** - Use errors for expected failures

```ad-example
**YiYu pattern:**
```go
func (h *Handler) GetQuote(w http.ResponseWriter, r *http.Request) {
    quote, err := h.service.GetQuote()
    if err != nil {
        log.Printf("failed to get quote: %v", err)
        http.Error(w, "Internal error", 500)
        return
    }
    json.NewEncoder(w).Encode(quote)
}
```

## No Try-Catch

```go
// No try-catch in Go
// Instead, explicit checks

result, err := operation()
if err != nil {
    // handle error
    return err
}
// continue with result
```

## Related Concepts

- [[golang_basics]] - Go fundamentals
- [[go_interfaces]] - Error interface
- [[go_testing]] - Testing error cases

### References

- [Error Handling Blog](https://go.dev/blog/error-handling-and-go)
- [Working with Errors](https://go.dev/blog/go1.13-errors)


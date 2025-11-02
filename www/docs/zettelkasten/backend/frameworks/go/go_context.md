🗓️ 26102024 1525

# go_context

**Core Concept**: Context carries deadlines, cancellation signals, and request-scoped values across API boundaries and goroutines.

## Basic Usage

```go
import "context"

// Create contexts
ctx := context.Background()           // Root context
ctx := context.TODO()                 // Placeholder when unsure

// With timeout
ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
defer cancel()  // Always call cancel

// With deadline
ctx, cancel := context.WithDeadline(ctx, time.Now().Add(5*time.Second))
defer cancel()

// With cancellation
ctx, cancel := context.WithCancel(ctx)
defer cancel()
```

## Cancellation Pattern

```go
func doWork(ctx context.Context) error {
    for {
        select {
        case <-ctx.Done():
            return ctx.Err()  // context.Canceled or context.DeadlineExceeded
        default:
            // do work
        }
    }
}

func main() {
    ctx, cancel := context.WithCancel(context.Background())
    
    go doWork(ctx)
    
    time.Sleep(2 * time.Second)
    cancel()  // Signal to stop
}
```

## HTTP Request Context

```go
func handler(w http.ResponseWriter, r *http.Request) {
    // Request has built-in context
    ctx := r.Context()
    
    // Call with context
    data, err := fetchData(ctx)
    if err != nil {
        if err == context.Canceled {
            // Client disconnected
            return
        }
        http.Error(w, err.Error(), 500)
        return
    }
    
    json.NewEncoder(w).Encode(data)
}

func fetchData(ctx context.Context) (Data, error) {
    // Check if cancelled
    select {
    case <-ctx.Done():
        return Data{}, ctx.Err()
    default:
    }
    
    // Make HTTP request with context
    req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
    resp, err := client.Do(req)
    // ...
}
```

## Database Queries

```go
func getUser(ctx context.Context, id int) (*User, error) {
    var user User
    
    // Query with context - cancels if context cancelled
    err := db.QueryRowContext(ctx, "SELECT * FROM users WHERE id = ?", id).Scan(&user)
    
    return &user, err
}
```

## Timeout Pattern

```go
func processWithTimeout(data string) error {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    
    return process(ctx, data)
}

func process(ctx context.Context, data string) error {
    done := make(chan error)
    
    go func() {
        done <- heavyWork(data)
    }()
    
    select {
    case err := <-done:
        return err
    case <-ctx.Done():
        return ctx.Err()
    }
}
```

## Context Values

```go
type key int

const userIDKey key = 0

// Store value
func WithUserID(ctx context.Context, userID int) context.Context {
    return context.WithValue(ctx, userIDKey, userID)
}

// Retrieve value
func GetUserID(ctx context.Context) (int, bool) {
    userID, ok := ctx.Value(userIDKey).(int)
    return userID, ok
}

// Usage
func middleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        userID := extractUserID(r)
        ctx := WithUserID(r.Context(), userID)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

```ad-warning
**Context values for request-scoped data only** - Don't use for passing optional parameters to functions. Use for things like request ID, user ID, auth tokens.
```

## Propagation

```go
func handler(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    
    // Pass context down the call chain
    result := serviceLayer(ctx)
    // ...
}

func serviceLayer(ctx context.Context) Result {
    // Check cancellation
    if ctx.Err() != nil {
        return Result{}
    }
    
    // Pass to next layer
    return dataLayer(ctx)
}

func dataLayer(ctx context.Context) Result {
    // Use context in DB call
    db.QueryContext(ctx, query)
    // ...
}
```

## Best Practices

1. **Pass context as first parameter** - `func Do(ctx context.Context, ...)`
2. **Don't store context in structs** - Pass it explicitly
3. **Always call cancel** - Use `defer cancel()` immediately
4. **Context values for request-scoped data** - Not for optional parameters
5. **Check ctx.Done() in loops** - Respond to cancellation

```ad-example
**YiYu pattern:**
```go
func (s *LLMService) GenerateQuote(ctx context.Context, category Category) (string, error) {
    resp, err := s.client.CreateChatCompletionWithContext(
        ctx,  // Pass context to OpenAI
        openai.ChatCompletionRequest{
            Model: openai.GPT4oMini,
            // ...
        },
    )
    if err != nil {
        return "", err
    }
    return resp.Choices[0].Message.Content, nil
}
```

## Common Mistakes

```go
// ❌ Bad - storing context
type Service struct {
    ctx context.Context  // Don't do this
}

// ✅ Good - passing context
func (s *Service) Do(ctx context.Context) error {
    // Use ctx parameter
}

// ❌ Bad - not calling cancel
ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
// Missing defer cancel() - resource leak

// ✅ Good - always cancel
ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
defer cancel()
```

## Checking Errors

```go
err := doWork(ctx)

if errors.Is(err, context.Canceled) {
    // Operation was cancelled
}

if errors.Is(err, context.DeadlineExceeded) {
    // Operation timed out
}
```

## References

- [Go Context Package](https://pkg.go.dev/context)
- [Context Blog Post](https://go.dev/blog/context)


🗓️ 26102024 1510

# go_testing

**Core Concept**: Go has built-in testing with `go test` - tests are just functions named `TestXxx` in `_test.go` files.

## Basic Test

```go
// math.go
func Add(a, b int) int {
    return a + b
}

// math_test.go
package math

import "testing"

func TestAdd(t *testing.T) {
    result := Add(2, 3)
    expected := 5
    
    if result != expected {
        t.Errorf("Add(2, 3) = %d; want %d", result, expected)
    }
}
```

Run with: `go test`

## Table-Driven Tests

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive", 2, 3, 5},
        {"negative", -1, -2, -3},
        {"zero", 0, 0, 0},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("got %d, want %d", result, tt.expected)
            }
        })
    }
}
```

```ad-tip
Table-driven tests are idiomatic Go - easy to add cases and see coverage.
```

## Testing Errors

```go
func TestDivide(t *testing.T) {
    _, err := Divide(10, 0)
    if err == nil {
        t.Error("expected error for divide by zero")
    }
    
    result, err := Divide(10, 2)
    if err != nil {
        t.Errorf("unexpected error: %v", err)
    }
    if result != 5 {
        t.Errorf("got %d, want 5", result)
    }
}
```

## Mocking with Interfaces

```go
// Interface for dependency
type UserStore interface {
    GetUser(id int) (*User, error)
}

// Real implementation
type DBStore struct{}

func (db *DBStore) GetUser(id int) (*User, error) {
    // database call
}

// Mock for testing
type MockStore struct {
    GetUserFunc func(int) (*User, error)
}

func (m *MockStore) GetUser(id int) (*User, error) {
    return m.GetUserFunc(id)
}

// Test
func TestService(t *testing.T) {
    mock := &MockStore{
        GetUserFunc: func(id int) (*User, error) {
            return &User{ID: id, Name: "Test"}, nil
        },
    }
    
    service := NewService(mock)
    user, err := service.GetUser(1)
    // assertions...
}
```

## Test Helpers

```go
func assertEqual(t *testing.T, got, want interface{}) {
    t.Helper()  // Mark as helper
    if got != want {
        t.Errorf("got %v, want %v", got, want)
    }
}

func TestSomething(t *testing.T) {
    assertEqual(t, Add(1, 2), 3)
}
```

## Setup and Teardown

```go
func TestMain(m *testing.M) {
    // Setup
    setup()
    
    // Run tests
    code := m.Run()
    
    // Teardown
    teardown()
    
    os.Exit(code)
}

func TestWithSetup(t *testing.T) {
    // Per-test setup
    db := setupTestDB(t)
    defer db.Close()
    
    // test code
}
```

## Benchmarks

```go
func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Add(2, 3)
    }
}
```

Run with: `go test -bench=.`

## Coverage

```bash
go test -cover
go test -coverprofile=coverage.out
go tool cover -html=coverage.out
```

## Common Patterns

### Subtests
```go
func TestUser(t *testing.T) {
    t.Run("validation", func(t *testing.T) {
        // validation tests
    })
    
    t.Run("creation", func(t *testing.T) {
        // creation tests
    })
}
```

### Parallel tests
```go
func TestSomething(t *testing.T) {
    t.Parallel()  // Run in parallel with other parallel tests
    
    // test code
}
```

### Skip tests
```go
func TestOptional(t *testing.T) {
    if testing.Short() {
        t.Skip("skipping in short mode")
    }
    // long-running test
}
```

Run short tests: `go test -short`

## HTTP Testing

```go
func TestHandler(t *testing.T) {
    req := httptest.NewRequest("GET", "/api/quote", nil)
    w := httptest.NewRecorder()
    
    handler := &QuoteHandler{}
    handler.GetQuote(w, req)
    
    if w.Code != http.StatusOK {
        t.Errorf("got status %d, want 200", w.Code)
    }
    
    var quote Quote
    json.NewDecoder(w.Body).Decode(&quote)
    // assertions on quote
}
```

## Best Practices

1. **Name tests clearly** - `TestUserValidation`, not `TestUser1`
2. **Use table-driven tests** - Easy to add cases
3. **Test behavior, not implementation** - Test public API
4. **Use interfaces for mocking** - Makes testing easier
5. **Keep tests simple** - Tests should be obvious

```ad-example
**YiYu test example:**
```go
func TestGenerateQuote(t *testing.T) {
    mockLLM := &MockLLMService{
        GenerateFunc: func(cat Category) (string, error) {
            return "知足常乐", nil
        },
    }
    
    handler := NewQuoteHandler(nil, mockLLM)
    
    req := httptest.NewRequest("POST", "/api/quote/generate", nil)
    w := httptest.NewRecorder()
    
    handler.GenerateQuote(w, req)
    
    if w.Code != http.StatusCreated {
        t.Errorf("got status %d, want 201", w.Code)
    }
}
```

## Commands

```bash
go test                    # Run tests
go test -v                 # Verbose
go test -run TestAdd       # Run specific test
go test -cover             # Coverage
go test -race              # Race detection
go test ./...              # All packages
go test -short             # Skip long tests
go test -bench=.           # Benchmarks
```

## Related Concepts

- [[golang_basics]] - Go fundamentals
- [[go_interfaces]] - Mocking with interfaces
- [[go_error_handling]] - Testing errors

### References

- [Go Testing Package](https://pkg.go.dev/testing)
- [Table Driven Tests](https://go.dev/wiki/TableDrivenTests)


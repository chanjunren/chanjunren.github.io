🗓️ 26102024 1430

# golang_basics

**Core Concept**: Go is a statically-typed, compiled language designed for simplicity and concurrency, using structs instead of classes and composition instead of inheritance.

## Core Features

- Compiled to single binary
- Statically typed with type inference
- Garbage collected
- Built-in concurrency (goroutines)
- Simple syntax, fast compilation

## Basic Syntax

### Variables
```go
var name string = "John"
name := "John"  // short declaration (inside functions)
age := 25       // type inferred
```

### Functions
```go
func add(a, b int) int {
    return a + b
}

// Multiple returns
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("divide by zero")
    }
    return a / b, nil
}
```

### Structs (not classes)
```go
type User struct {
    Name string  // exported (capitalized = public)
    age  int     // unexported (lowercase = private)
}

// Constructor by convention
func NewUser(name string, age int) *User {
    return &User{Name: name, age: age}
}
```

### Methods (attached to types)
```go
func (u *User) IsAdult() bool {
    return u.age >= 18
}

// Pointer receiver (*User) allows mutation
// Value receiver (User) receives a copy
```

### Interfaces (implicit)
```go
type Writer interface {
    Write(data []byte) error
}

// Any type with Write() method implements Writer
// No "implements" keyword needed
```

## Error Handling

```go
// Errors are values, not exceptions
result, err := mightFail()
if err != nil {
    return err  // or handle it
}
// use result
```

**No try/catch**. Check errors explicitly.

## Key Concepts

### Pointers
```go
x := 42
p := &x      // p is pointer to x
*p = 21      // dereference and modify
fmt.Println(x)  // prints 21
```

### Slices (dynamic arrays)
```go
nums := []int{1, 2, 3}
nums = append(nums, 4)
for i, n := range nums {
    fmt.Println(i, n)
}
```

### Maps
```go
m := make(map[string]int)
m["age"] = 25
value, exists := m["age"]
```

### Goroutines (lightweight threads)
```go
go doWork()  // runs concurrently

// With channels
ch := make(chan string)
go func() {
    ch <- "result"  // send
}()
msg := <-ch  // receive
```

See [[go_concurrency_model]] for details.

### Defer
```go
func readFile() error {
    file, err := os.Open("file.txt")
    if err != nil {
        return err
    }
    defer file.Close()  // runs when function exits
    
    // do work with file
}
```

## Project Structure

```
project/
├── cmd/api/          # main.go (entry point)
├── internal/         # private code (can't be imported externally)
│   ├── handlers/
│   ├── services/
│   ├── models/
│   └── database/
├── go.mod            # dependencies
└── go.sum            # checksums
```

## Package Management

```bash
go mod init github.com/user/project  # initialize
go get package                       # add dependency
go mod tidy                          # clean up
go mod download                      # fetch deps
```

`go.mod` example:
```go
module github.com/user/project

require (
    github.com/go-chi/chi/v5 v5.0.11
)
```

## Common Patterns

### Constructor pattern
```go
type Service struct {
    db Database
}

func NewService(db Database) *Service {
    return &Service{db: db}
}
```

### Error wrapping
```go
if err != nil {
    return fmt.Errorf("failed to save: %w", err)
}
```

### Options pattern
```go
type Option func(*Config)

func WithTimeout(t time.Duration) Option {
    return func(c *Config) {
        c.Timeout = t
    }
}

func NewClient(opts ...Option) *Client {
    c := &Client{}
    for _, opt := range opts {
        opt(&c.config)
    }
    return c
}
```

## Important Rules

1. **Capitalization = visibility**: `Name` (public), `name` (private)
2. **No inheritance**: Use composition and interfaces
3. **Errors are values**: Handle explicitly, no exceptions
4. **Pointers for mutation**: Value receivers copy, pointer receivers mutate
5. **Defer stacks**: Multiple defers execute in LIFO order

```ad-tip
Go prefers explicit code over clever abstractions. "Clear is better than clever."
```

## Quick Reference

```go
// Control flow
if x > 0 {
    // ...
}

for i := 0; i < 10; i++ {
    // ...
}

for key, value := range map {
    // ...
}

switch x {
case 1:
    // ...
default:
    // ...
}

// Type assertion
value, ok := interface{}.(Type)

// Type switch
switch v := i.(type) {
case int:
    // v is int
case string:
    // v is string
}
```

## References

- [Tour of Go](https://go.dev/tour/) - Interactive tutorial
- [Effective Go](https://go.dev/doc/effective_go) - Best practices
- [Go by Example](https://gobyexample.com/) - Code examples

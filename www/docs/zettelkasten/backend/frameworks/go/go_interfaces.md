🗓️ 26102024 1500

# go_interfaces

**Core Concept**: Go interfaces are implicit contracts - any type that implements the required methods automatically satisfies the interface, no declaration needed.

## Basic Interface

```go
type Writer interface {
    Write(data []byte) (int, error)
}

// Any type with this method implements Writer
type FileWriter struct{}

func (f *FileWriter) Write(data []byte) (int, error) {
    // implementation
    return len(data), nil
}

// No "implements" keyword - it just works!
var w Writer = &FileWriter{}
```

## Empty Interface

```go
interface{}  // or `any` in Go 1.18+

// Accepts any type
func Print(v interface{}) {
    fmt.Println(v)
}

Print(42)
Print("hello")
Print([]int{1, 2, 3})
```

## Type Assertions

```go
var i interface{} = "hello"

// Type assertion
s := i.(string)
fmt.Println(s)  // "hello"

// Safe type assertion
s, ok := i.(string)
if ok {
    fmt.Println(s)
}

// Type switch
switch v := i.(type) {
case string:
    fmt.Println("string:", v)
case int:
    fmt.Println("int:", v)
default:
    fmt.Println("unknown")
}
```

## Common Interface Patterns

### Small interfaces
```go
// Prefer small, focused interfaces
type Reader interface {
    Read([]byte) (int, error)
}

type Writer interface {
    Write([]byte) (int, error)
}

// Compose them
type ReadWriter interface {
    Reader
    Writer
}
```

### Interface embedding
```go
type ReadWriteCloser interface {
    Reader
    Writer
    Closer
}
```

## Why Implicit?

**Benefits:**
- Define interfaces where you use them (not where types are defined)
- Decouple packages
- Easy to test (mock interfaces)
- Types can satisfy multiple interfaces without knowing

**Example:**
```go
// Package A defines interface
package api

type Notifier interface {
    Notify(msg string) error
}

// Package B implements it without knowing
package email

type EmailService struct{}

func (e *EmailService) Notify(msg string) error {
    // send email
}

// It just works!
var n Notifier = &EmailService{}
```

## Common Pitfall

```go
// Wrong - pointer vs value receiver
type Counter interface {
    Increment()
}

type Count int

func (c *Count) Increment() {  // pointer receiver
    *c++
}

var c Count = 5
// var counter Counter = c  // ERROR: Count doesn't implement (need *Count)
var counter Counter = &c    // OK
```

```ad-warning
Interface satisfaction depends on receiver type. If method has pointer receiver, only pointer satisfies interface.
```

## Standard Library Interfaces

Common ones you'll use:

```go
// io package
type Reader interface {
    Read([]byte) (int, error)
}

type Writer interface {
    Write([]byte) (int, error)
}

type Closer interface {
    Close() error
}

// fmt package
type Stringer interface {
    String() string
}

// sort package
type Interface interface {
    Len() int
    Less(i, j int) bool
    Swap(i, j int)
}

// error
type error interface {
    Error() string
}
```

## Best Practices

1. **Accept interfaces, return structs**
```go
// Good
func Process(r io.Reader) (*Result, error)

// Avoid
func Process(r *os.File) (*Result, error)
```

2. **Keep interfaces small** - One or two methods ideal

3. **Define interfaces at usage point** - Not with the implementation

4. **Name with -er suffix** - Reader, Writer, Closer

## Related Concepts

- [[golang_basics]] - Go fundamentals
- [[go_testing]] - Mocking with interfaces

### References

- [Effective Go - Interfaces](https://go.dev/doc/effective_go#interfaces)
- [Interface Values](https://go.dev/blog/laws-of-reflection)


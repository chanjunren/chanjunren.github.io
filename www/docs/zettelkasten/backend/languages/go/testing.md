🗓️ 07062026 1140
📎

# testing

**Core Concept**: Go ships testing in the standard library. Tests are plain functions in `_test.go` files; the idiomatic style is **table-driven** with subtests, and mocking is done with interfaces — no framework required.

## The basics

A test is a function `TestXxx(t *testing.T)` in a file ending `_test.go`, in the same package as the code. Run everything with `go test ./...`.

```go
// adder_test.go
func TestAdd(t *testing.T) {
    got := Add(2, 3)
    if got != 5 {
        t.Errorf("Add(2,3) = %d, want 5", got)
    }
}
```

There are no assertion macros — you compare and call `t.Errorf` (record failure, keep going) or `t.Fatalf` (record and stop this test). This is deliberate: tests are just Go code.

## Table-driven tests

The dominant Go pattern: list cases in a slice of structs, loop, and run each as a **subtest** with `t.Run`. Adding a case is one line; failures name the exact case.

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name string
        a, b int
        want int
    }{
        {"positives", 2, 3, 5},
        {"with zero", 0, 7, 7},
        {"negatives", -1, -2, -3},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            if got := Add(tt.a, tt.b); got != tt.want {
                t.Errorf("got %d, want %d", got, tt.want)
            }
        })
    }
}
```

Subtests run independently, show up by name (`TestAdd/with_zero`), and can be run selectively with `go test -run TestAdd/with_zero`.

## Mocking with interfaces

Because dependencies are interfaces ([[interfaces]], [[dependency_injection]]), a test fake is just a struct implementing the interface — no mocking library needed.

```go
type fakeRepo struct {
    user *User
    err  error
}
func (f *fakeRepo) FindByID(ctx context.Context, id int) (*User, error) {
    return f.user, f.err
}

func TestService(t *testing.T) {
    svc := NewUserService(&fakeRepo{user: &User{Name: "Ada"}})
    got, _ := svc.Get(context.Background(), 1)
    if got.Name != "Ada" {
        t.Errorf("got %q", got.Name)
    }
}
```

For richer fakes, record calls or make behaviour a function field the test sets per case.

## Fast vs slow tests

`testing.Short()` lets one suite hold both quick unit tests and slow integration tests. Guard the slow ones and skip them under `go test -short`.

```go
func TestIntegration(t *testing.T) {
    if testing.Short() {
        t.Skip("skipping integration test in -short mode")
    }
    // hits a real DB...
}
```

## Useful flags

- `go test ./...` — run all packages.
- `go test -run <regexp>` — run matching tests/subtests.
- `go test -race` — enable the race detector (run periodically; catches data races in [[sync_primitives]]/[[channels]] code).
- `go test -cover` — coverage summary.
- `t.Cleanup(fn)` — register teardown that runs when the test ends (cleaner than trailing [[defer]] in some setups).

```ad-warning
A package with **no** `_test.go` files reports `[no test files]`, not failure — silent zero coverage. Treat that as a gap to fill on critical paths, not a passing signal.
```

## Examples

```ad-example
Table-driven test of an error path, asserting a typed error via errors.As ([[custom_error_types]]):
```go
func TestGetUser_NotFound(t *testing.T) {
    svc := NewUserService(&fakeRepo{err: ErrNoRows})

    _, err := svc.Get(context.Background(), 99)

    var appErr *AppError
    if !errors.As(err, &appErr) || appErr.StatusCode != 404 {
        t.Fatalf("want 404 AppError, got %v", err)
    }
}
```
```

## References

- [testing package](https://pkg.go.dev/testing)
- [Go Blog: Subtests](https://go.dev/blog/subtests)

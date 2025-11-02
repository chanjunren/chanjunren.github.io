🗓️ 02112024 2242
📎

# go_dependency_injection

**Core Concept**: Pass dependencies via constructor functions, not global state or annotations.

## Why It Matters

Makes dependencies explicit. Enables testing with mocks. No framework magic.

## Quick Reference

```go
// Define interface (in consumer package)
type UserRepository interface {
    FindByID(ctx context.Context, id int) (*User, error)
}

// Service depends on interface
type UserService struct {
    repo UserRepository  // Interface, not concrete type
}

// Constructor injects dependency
func NewUserService(repo UserRepository) *UserService {
    return &UserService{repo: repo}
}

// Wire manually in main
func main() {
    repo := postgres.NewRepository(db)
    service := NewUserService(repo)
    handler := NewHandler(service)
}
```

## vs Spring @Autowired

| Spring | Go |
|--------|-----|
| `@Autowired` | Constructor parameters |
| IoC container | Manual wiring in main |
| Implicit | Explicit |
| Runtime | Compile-time |

## When to Use

✅ **Always inject:**
- Database connections
- HTTP clients
- Services
- Configuration

❌ **Don't inject:**
- Simple types (int, string)
- Constants

## Pattern

**Accept interfaces, return structs:**
```go
// ✅ GOOD - accepts interface
func NewService(repo UserRepository) *Service

// ❌ BAD - accepts concrete type
func NewService(repo *PostgresRepo) *Service
```

This builds on [[go_interfaces]] for loose coupling.

## Trade-offs

**Pros**: Explicit, testable, no magic  
**Cons**: Manual wiring, more verbose

## References

- [Uber Go Style Guide: DI](https://github.com/uber-go/guide/blob/master/style.md)


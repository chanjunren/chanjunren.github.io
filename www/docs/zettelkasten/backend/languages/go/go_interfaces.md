🗓️ 02112024 2258
📎

# go_interfaces

**Core Concept**: Interfaces define behavior contracts; types implement them implicitly (duck typing).

## Why It Matters

Enables polymorphism without inheritance. Foundation for dependency injection and testing.

## When to Use

✅ **Use when:**
- Defining contracts
- Dependency injection
- Multiple implementations

❌ **Don't use when:**
- Only one implementation
- Premature abstraction

## Key Principle

**Accept interfaces, return structs** - Functions take interfaces as parameters but return concrete types.

This contrasts with [[go_type_assertions]] where you convert interfaces back to concrete types.

## Trade-offs

**Pros**: Loose coupling, testability, flexibility  
**Cons**: Runtime overhead, less explicit

## Quick Reference

```go
// Define interface
type Reader interface {
    Read(p []byte) (n int, err error)
}

// Implement implicitly (no "implements" keyword)
type FileReader struct{}

func (f FileReader) Read(p []byte) (int, error) {
    // implementation
}
// FileReader is now a Reader

// Use interface as parameter
func process(r Reader) {
    r.Read(buf)
}

// Accept interfaces, return structs
func NewService(repo UserRepository) *Service {  // ✅
    return &Service{repo: repo}
}
```

| Concept | Java | Go |
|---------|------|-----|
| Declaration | `class X implements I` | Implicit |
| Empty interface | `Object` | `interface{}` |
| Type check | `instanceof` | Type assertion |

## Examples

```ad-example
**Dependency injection without @Autowired:**
```go
// Define interface
type UserRepository interface {
    FindByID(id int) (*User, error)
    Save(user *User) error
}

// Service accepts interface
type UserService struct {
    repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
    return &UserService{repo: repo}
}

// Implementation 1: Database
type DBUserRepository struct {
    db *sql.DB
}

func (r *DBUserRepository) FindByID(id int) (*User, error) {
    // SQL query
}

// Implementation 2: Mock for testing
type MockUserRepository struct {
    users map[int]*User
}

func (r *MockUserRepository) FindByID(id int) (*User, error) {
    return r.users[id], nil
}

// Both automatically satisfy UserRepository interface
// No "implements" keyword needed
```

**Small interfaces principle:**
```go
// Good: Small, focused interfaces
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// Compose when needed
type ReadWriter interface {
    Reader
    Writer
}
```
\`\`\`

## References

- [Effective Go: Interfaces](https://go.dev/doc/effective_go#interfaces)


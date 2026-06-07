🗓️ 02112024 2250
📎

# learning_plan

**Core Concept**: Structured path for Java Spring Boot developers learning Go, focusing on mental model shifts.

## Why It Matters

Go requires different thinking than Java. Learning in order prevents confusion and builds solid foundations.

## Learning Path

### Phase 1: Mental Model Shifts (Week 1)
**Goal**: Understand how Go differs from Java fundamentally

1. [[error_handling]] - No exceptions, errors are values
2. [[pointers]] - Explicit memory addresses, not Java references  
3. [[interfaces]] - Implicit implementation (duck typing)
4. [[defer]] - Resource cleanup without try-finally

**Practice**: Rewrite simple Java methods in Go

### Phase 2: Core Patterns (Week 2)
**Goal**: Learn Go idioms and common patterns

5. [[type_assertions]] - Working with interface{}
6. [[context]] - Request lifecycle management
7. [[dependency_injection]] - Constructor injection, no @Autowired
8. [[struct_methods]] - Receivers; value vs pointer
9. [[struct_embedding]] - Composition over inheritance

**Practice**: Build a simple HTTP API with clean architecture

### Phase 3: Concurrency (Week 3+)
**Goal**: Master Go's concurrency primitives

- [[goroutines]] - Lightweight threads
- [[channels]] - Communication between goroutines
- [[select]] - Multiplexing channels
- [[sync_primitives]] - Mutexes, RWMutex, WaitGroup
- [[panic_recover]] - Containing panics at goroutine boundaries

**Practice**: Build concurrent data processor

### Phase 4: Production Readiness (Week 4+)
**Goal**: Write production-grade Go code

- [[testing]] - Table-driven tests
- [[custom_error_types]] - Typed errors, %w chains, errors.As
- [[graceful_shutdown]] - Clean service termination
- [[project_structure]] - Organizing real applications

**Practice**: Production-ready microservice

Applied review of a real codebase: [[review_backies]]

## Key Mental Shifts

| Java Concept | Go Equivalent | Note |
|--------------|---------------|------|
| try/catch | if err != nil | Explicit |
| @Autowired | Constructor params | Manual |
| implements | Implicit | Duck typing |
| synchronized | Mutexes/Channels | Explicit |
| ThreadLocal | context.Context | Passed explicitly |

## Study Tips

- **Read standard library code** - Best Go examples
- **Run `go fmt`** - Learn idiomatic style
- **Write tests first** - Forces good design
- **Keep functions small** - 20-30 lines max

## Trade-offs

**Java strengths**: Rich frameworks, strong tooling, massive ecosystem  
**Go strengths**: Simplicity, fast compilation, built-in concurrency, single binary deployment

This learning plan focuses on concepts that build on [[interfaces]] and [[error_handling]] as foundational patterns.

## References

- [Tour of Go](https://go.dev/tour/)
- [Effective Go](https://go.dev/doc/effective_go)
- [Go by Example](https://gobyexample.com/)


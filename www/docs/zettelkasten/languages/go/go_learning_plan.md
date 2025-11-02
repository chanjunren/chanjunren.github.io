🗓️ 02112024 2250
📎

# go_learning_plan

**Core Concept**: Structured path for Java Spring Boot developers learning Go, focusing on mental model shifts.

## Why It Matters

Go requires different thinking than Java. Learning in order prevents confusion and builds solid foundations.

## Learning Path

### Phase 1: Mental Model Shifts (Week 1)
**Goal**: Understand how Go differs from Java fundamentally

1. [[go_error_handling]] - No exceptions, errors are values
2. [[go_pointers]] - Explicit memory addresses, not Java references  
3. [[go_interfaces]] - Implicit implementation (duck typing)
4. [[go_defer]] - Resource cleanup without try-finally

**Practice**: Rewrite simple Java methods in Go

### Phase 2: Core Patterns (Week 2)
**Goal**: Learn Go idioms and common patterns

5. [[go_type_assertions]] - Working with interface{}
6. [[go_context]] - Request lifecycle management
7. [[go_dependency_injection]] - Constructor injection, no @Autowired

**Next to learn**: Struct methods, goroutines, channels

**Practice**: Build a simple HTTP API with clean architecture

### Phase 3: Concurrency (Week 3+)
**Goal**: Master Go's concurrency primitives

- Goroutines - Lightweight threads
- Channels - Communication between goroutines
- Select - Multiplexing channels
- Sync primitives - Mutexes and WaitGroups

**Practice**: Build concurrent data processor

### Phase 4: Production Readiness (Week 4+)
**Goal**: Write production-grade Go code

- Testing - Table-driven tests
- Error wrapping - Error chains with %w
- Graceful shutdown - Clean service termination
- Project structure - Organizing real applications

**Practice**: Production-ready microservice

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

This learning plan focuses on concepts that build on [[go_interfaces]] and [[go_error_handling]] as foundational patterns.

## References

- [Tour of Go](https://go.dev/tour/)
- [Effective Go](https://go.dev/doc/effective_go)
- [Go by Example](https://gobyexample.com/)


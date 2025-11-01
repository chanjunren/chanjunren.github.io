🗓️ 30102024 1445

# go_learning_plan

**Core Concept**: Learn Go progressively by building YiYu backend, focusing on practical patterns needed for REST APIs with external services and databases.

## Learning Sequence

### 1. Language Basics
- Variables and basic types
- Functions and multiple returns
- Structs and methods
- Pointers vs values
- Error handling pattern

**Apply**: Write Quote model structs

**Resources**: [[golang_basics]]

### 2. Project Structure
- Package system and imports
- Public vs private (capitalization)
- Project layout conventions
- Internal packages
- Module initialization

**Apply**: Set up YiYu directory structure

**Resources**: [[go_modules]]

### 3. HTTP and JSON
- HTTP handlers and routing
- Request/response patterns
- JSON marshaling/unmarshaling
- Middleware concept
- Status codes and headers

**Apply**: Create basic quote endpoints with go-chi

### 4. Environment and Configuration
- Environment variables
- Configuration structs
- Validation patterns
- Dotenv files
- Config loading on startup

**Apply**: Set up config for API keys

### 5. HTTP Client and External APIs
- Making HTTP requests
- Setting headers and auth
- Handling responses
- Timeouts and retries
- Error handling for network calls

**Apply**: Integrate OpenAI quote generation

**Resources**: [[go_context]]

### 6. Database Integration
- REST API client pattern
- Query parameters
- Request body construction
- Response parsing
- Error handling

**Apply**: Implement Supabase client methods

### 7. Context Package
- Context purpose
- Timeout patterns
- Cancellation propagation
- Context in HTTP handlers
- Context with database calls

**Apply**: Add timeouts to all external calls

**Resources**: [[go_context]]

### 8. Testing
- Test file conventions
- Table-driven tests
- Mocking interfaces
- HTTP testing helpers
- Test coverage

**Apply**: Test quote generation logic

**Resources**: [[go_testing]]

### 9. Goroutines and Channels
- What goroutines are
- When to use them
- Channel basics
- Synchronization patterns
- Common pitfalls

**Apply**: Add concurrent operations if needed

**Resources**: [[go_concurrency_model]]

### 10. Sync Primitives
- Mutex basics
- When to use sync vs channels
- WaitGroup for coordination
- Race conditions
- Atomic operations

**Apply**: Protect shared state

**Resources**: [[go_sync_primitives]]

### 11. Error Handling Patterns
- Error wrapping
- Custom error types
- Sentinel errors
- Error handling in HTTP
- Logging errors

**Apply**: Improve error messages in API

**Resources**: [[go_error_handling]]

### 12. Deployment
- Building binaries
- Docker containers
- Environment in production
- Health checks
- Graceful shutdown

**Apply**: Deploy YiYu to Fly.io

## Priority Levels

### Essential (Do First)
- Language basics
- Project structure
- HTTP and JSON
- Environment config
- External APIs
- Database integration

### Important (Do Second)
- Context and timeouts
- Testing
- Error handling patterns
- Deployment basics

### Advanced (Do Later)
- Goroutines and channels
- Sync primitives
- Performance optimization
- Advanced testing patterns

## Common Pitfalls from Other Languages

### From Java/Spring
- No classes or inheritance - use composition
- No annotations - explicit wiring
- No thread pools - goroutines are cheap
- No exceptions - check errors explicitly

### From Python
- Statically typed - no duck typing
- Compiled - faster but needs rebuild
- No list comprehensions - use loops
- Explicit error handling - no try/except

### From JavaScript/Node
- No async/await syntax - use goroutines
- No promises - use channels or callbacks
- Synchronous by default - spawn goroutines explicitly
- No package.json scripts - use Makefile or shell

## When You're Stuck

1. Read the error message carefully
2. Check if environment variables are set
3. Verify API keys are valid
4. Test with curl to isolate frontend/backend
5. Use print statements liberally
6. Check Go documentation (excellent!)

## Daily Practice Routine

1. Read concept (15 min)
2. Code along with example (30 min)
3. Apply to YiYu (45 min)
4. Test what you built (15 min)
5. Document what you learned (15 min)

Total: ~2 hours/day

## Success Metrics

- YiYu backend fully functional
- All endpoints tested
- Deployed to production
- Can explain each part of codebase
- Comfortable reading Go code

## After YiYu

### Next Projects
- Add authentication to backies
- Build second app on same backend
- Add caching layer
- Implement WebSocket endpoint
- Add background job processing

### Advanced Topics
- Generics (Go 1.18+)
- Reflection
- Custom interfaces
- Performance optimization
- Distributed systems patterns

## Related Concepts

- [[golang_basics]]
- [[go_modules]]
- [[go_concurrency_model]]
- [[go_testing]]
- [[go_error_handling]]
- [[go_interfaces]]
- [[go_context]]
- [[go_sync_primitives]]

### References

- [Go by Example](https://gobyexample.com/) - Quick reference
- [Effective Go](https://go.dev/doc/effective_go) - Best practices
- [Go Tour](https://go.dev/tour/) - Interactive tutorial
- [Go Standard Library](https://pkg.go.dev/std) - Official docs
- YiYu Implementation Guide: `/backies/docs/yiyu/IMPLEMENTATION_GUIDE.md`


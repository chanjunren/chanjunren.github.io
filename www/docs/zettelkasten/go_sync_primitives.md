🗓️ 26102024 1530

# go_sync_primitives

**Core Concept**: Go provides traditional synchronization primitives (Mutex, WaitGroup, etc.) for cases where channels aren't the best fit - protecting shared state and coordinating goroutines.

## Mutex (Mutual Exclusion)

```go
import "sync"

type Counter struct {
    mu    sync.Mutex
    value int
}

func (c *Counter) Increment() {
    c.mu.Lock()
    c.value++
    c.mu.Unlock()
}

func (c *Counter) Value() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.value
}
```

```ad-tip
Use `defer mu.Unlock()` to ensure unlock happens even if panic occurs.
```

## RWMutex (Reader-Writer Lock)

```go
type Cache struct {
    mu   sync.RWMutex
    data map[string]string
}

func (c *Cache) Get(key string) string {
    c.mu.RLock()         // Multiple readers OK
    defer c.mu.RUnlock()
    return c.data[key]
}

func (c *Cache) Set(key, value string) {
    c.mu.Lock()          // Exclusive writer
    defer c.mu.Unlock()
    c.data[key] = value
}
```

**RWMutex allows:**
- Multiple concurrent readers
- Only one writer (blocks readers)

## WaitGroup

```go
func processItems(items []Item) {
    var wg sync.WaitGroup
    
    for _, item := range items {
        wg.Add(1)  // Increment counter
        
        go func(i Item) {
            defer wg.Done()  // Decrement when done
            process(i)
        }(item)
    }
    
    wg.Wait()  // Block until counter = 0
}
```

**Use case:** Wait for multiple goroutines to complete.

## Once

```go
var (
    instance *Singleton
    once     sync.Once
)

func GetInstance() *Singleton {
    once.Do(func() {
        instance = &Singleton{}  // Runs exactly once
    })
    return instance
}
```

**Use case:** Lazy initialization, run exactly once.

## Atomic Operations

```go
import "sync/atomic"

var counter int64

// Atomic increment
atomic.AddInt64(&counter, 1)

// Atomic load
value := atomic.LoadInt64(&counter)

// Atomic store
atomic.StoreInt64(&counter, 42)

// Compare and swap
swapped := atomic.CompareAndSwapInt64(&counter, oldVal, newVal)
```

**Use case:** Simple operations on primitive types without mutex overhead.

## Cond (Condition Variable)

```go
type Queue struct {
    mu    sync.Mutex
    cond  *sync.Cond
    items []Item
}

func NewQueue() *Queue {
    q := &Queue{}
    q.cond = sync.NewCond(&q.mu)
    return q
}

func (q *Queue) Enqueue(item Item) {
    q.mu.Lock()
    q.items = append(q.items, item)
    q.cond.Signal()  // Wake one waiter
    q.mu.Unlock()
}

func (q *Queue) Dequeue() Item {
    q.mu.Lock()
    defer q.mu.Unlock()
    
    for len(q.items) == 0 {
        q.cond.Wait()  // Wait until signaled
    }
    
    item := q.items[0]
    q.items = q.items[1:]
    return item
}
```

**Use case:** Wait for condition to become true.

## Pool

```go
var bufferPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)  // Create if pool empty
    },
}

func process() {
    buf := bufferPool.Get().(*bytes.Buffer)
    defer bufferPool.Put(buf)
    
    buf.Reset()
    // use buffer
}
```

**Use case:** Reuse objects to reduce GC pressure.

## Map (Concurrent Map)

```go
var cache sync.Map

// Store
cache.Store("key", value)

// Load
value, ok := cache.Load("key")

// LoadOrStore (atomic)
actual, loaded := cache.LoadOrStore("key", value)

// Delete
cache.Delete("key")

// Range (iterate)
cache.Range(func(key, value interface{}) bool {
    fmt.Println(key, value)
    return true  // continue iteration
})
```

**Use case:** Concurrent map access (alternative to Mutex + map).

## When to Use What

| Primitive | Use Case |
|-----------|----------|
| **Mutex** | Protecting shared state |
| **RWMutex** | Many reads, few writes |
| **WaitGroup** | Wait for N goroutines |
| **Once** | One-time initialization |
| **Atomic** | Simple counters/flags |
| **Cond** | Wait for condition |
| **Pool** | Object reuse |
| **sync.Map** | Concurrent map (rare) |
| **Channels** | Everything else! |

```ad-warning
**Prefer channels for communication** - Use sync primitives only for protecting shared memory or coordination.
```

## Common Patterns

### Protected shared state
```go
type SafeCounter struct {
    mu sync.Mutex
    m  map[string]int
}

func (c *SafeCounter) Inc(key string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.m[key]++
}
```

### Parallel workers with limit
```go
func processWithLimit(items []Item, limit int) {
    var wg sync.WaitGroup
    sem := make(chan struct{}, limit)  // Semaphore
    
    for _, item := range items {
        wg.Add(1)
        sem <- struct{}{}  // Acquire
        
        go func(i Item) {
            defer wg.Done()
            defer func() { <-sem }()  // Release
            process(i)
        }(item)
    }
    
    wg.Wait()
}
```

### Singleton pattern
```go
var (
    instance *Database
    once     sync.Once
)

func GetDB() *Database {
    once.Do(func() {
        instance = connectDB()
    })
    return instance
}
```

## Race Detection

```bash
go run -race main.go
go test -race ./...
```

**Always run with `-race` during development!**

## Best Practices

1. **Prefer channels** - Use sync only when needed
2. **Keep critical sections small** - Lock/unlock quickly
3. **Use defer for unlock** - Prevents deadlocks
4. **Don't copy mutexes** - Pass by pointer
5. **RWMutex for read-heavy** - Many reads, few writes
6. **Run race detector** - Catches concurrency bugs

```ad-example
**YiYu might use:**
```go
// Cache with RWMutex
type QuoteCache struct {
    mu     sync.RWMutex
    quotes map[string]*Quote
}

func (c *QuoteCache) Get(id string) *Quote {
    c.mu.RLock()
    defer c.mu.RUnlock()
    return c.quotes[id]
}
```

## Common Mistakes

```go
// ❌ Copying mutex
func badCopy(c Counter) {
    c.Increment()  // Copies mutex!
}

// ✅ Pass by pointer
func goodCopy(c *Counter) {
    c.Increment()
}

// ❌ Not deferring unlock
func badUnlock() {
    mu.Lock()
    if err != nil {
        return  // Forgot to unlock!
    }
    mu.Unlock()
}

// ✅ Defer unlock
func goodUnlock() {
    mu.Lock()
    defer mu.Unlock()
    // can return safely
}
```

## Related Concepts

- [[go_concurrency_model]] - Goroutines and scheduling
- [[goroutines_channels]] - Channel-based communication
- [[golang_basics]] - Go fundamentals

### References

- [sync Package](https://pkg.go.dev/sync)
- [atomic Package](https://pkg.go.dev/sync/atomic)
- [Data Race Detector](https://go.dev/doc/articles/race_detector)


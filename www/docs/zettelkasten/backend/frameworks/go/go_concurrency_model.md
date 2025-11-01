🗓️ 26102024 1445

# go_concurrency_model

**Core Concept**: Go uses goroutines (lightweight green threads) managed by the Go runtime scheduler, not OS thread pools like Java - one goroutine per request is cheap enough to be the default pattern.

## Java/Spring Boot: Thread Pool Model

**How it works:**
```
HTTP Request → Thread Pool (200 threads) → Handler
                ↓ (thread blocked)
              DB Call
                ↓ (thread blocked)
            External API
                ↓
              Response
```

**Characteristics:**
- Limited thread pool (e.g., 200 Tomcat threads)
- Each thread = ~1MB stack + OS overhead
- Thread blocked during I/O → wastes resources
- Reactive/async patterns (WebFlux) to avoid blocking

**Caffeine cache example:**
```java
// Separate thread pool for cache operations
ExecutorService executor = Executors.newFixedThreadPool(10);
cache = Caffeine.newBuilder()
    .executor(executor)
    .build();
```

```ad-warning
**Java limitation**: Can't have 10,000 OS threads. Memory and context switching become bottlenecks.
```

## Go: Goroutine Model

**How it works:**
```
HTTP Request → New Goroutine (2KB) → Handler
                ↓ (goroutine yields, doesn't block OS thread)
              DB Call
                ↓
            External API
                ↓
              Response
```

**Characteristics:**
- Start with 2KB stack (grows as needed)
- Scheduled by Go runtime, not OS
- Multiplexed onto few OS threads (GOMAXPROCS)
- Can run millions concurrently
- Goroutines yield during I/O automatically

### Go Runtime Scheduler

```
Goroutines (millions possible)
     ↓
Go Scheduler (M:N threading)
     ↓
OS Threads (typically = CPU cores)
     ↓
CPU Cores
```

**M:N Threading**: M goroutines mapped to N OS threads

```ad-tip
Think of goroutines like async/await that doesn't need explicit keywords. The runtime handles it automatically.
```

## HTTP Server: Spring vs Go

### Spring Boot (Tomcat)
```java
// application.properties
server.tomcat.threads.max=200     # Thread pool size
server.tomcat.threads.min-spare=10

@GetMapping("/quote")
public Quote getQuote() {
    // This handler runs on one of 200 threads
    // Thread blocks during DB call
    return quoteService.getFromDB();  // thread waits here
}
```

**Limitations:**
- Max 200 concurrent requests
- Request 201 waits in queue
- Need async/reactive for high concurrency

### Go (net/http)
```go
http.HandleFunc("/quote", func(w http.ResponseWriter, r *http.Request) {
    // New goroutine automatically created for each request
    // Goroutine yields during DB call (doesn't block OS thread)
    quote := quoteService.GetFromDB()  // goroutine yields here
    json.NewEncoder(w).Encode(quote)
})

http.ListenAndServe(":8080", nil)
```

**Default behavior:**
- Each HTTP request = new goroutine
- Can handle 10,000+ concurrent requests
- No explicit configuration needed
- Goroutines clean up automatically

```ad-important
**Go's `net/http` spawns one goroutine per request by default**. No thread pool configuration needed.
```

## How Go Runtime Manages Concurrency

### GOMAXPROCS
```go
runtime.GOMAXPROCS(4)  // Use 4 OS threads
// Default = number of CPU cores
```

**What happens:**
1. Go creates N OS threads (N = GOMAXPROCS)
2. Thousands of goroutines scheduled on these threads
3. When goroutine does I/O → yields to scheduler
4. Scheduler runs another goroutine on that thread
5. I/O completes → goroutine becomes runnable again

### Blocking vs Non-blocking

**Java - thread blocks:**
```java
// Thread is blocked and unavailable
String result = httpClient.send(request);  // thread waiting...
```

**Go - goroutine yields:**
```go
// Goroutine yields, OS thread runs other goroutines
resp, err := http.Get(url)  // goroutine paused, thread continues
```

The OS thread doesn't wait - it runs other goroutines!

## Thread Pools in Go?

**Short answer: You usually don't need them.**

**When you DO need worker pools:**
- CPU-bound tasks (not I/O)
- Rate limiting
- Controlled concurrency

```go
// Worker pool pattern (when needed)
jobs := make(chan Job, 100)
results := make(chan Result, 100)

// Start 10 workers
for w := 1; w <= 10; w++ {
    go worker(jobs, results)
}

func worker(jobs <-chan Job, results chan<- Result) {
    for job := range jobs {
        results <- processJob(job)  // CPU-intensive work
    }
}
```

But for I/O-bound work (HTTP, DB), just spawn goroutines directly:

```go
// This is fine! No pool needed
for _, item := range items {
    go func(i Item) {
        result := fetchFromAPI(i)  // I/O operation
        // handle result
    }(item)
}
```

```ad-example
**YiYu example**: When you call OpenAI API, the goroutine yields while waiting. The OS thread is free to handle other requests. No special configuration needed.
```

## Comparison Table

| Aspect                  | Java/Spring (Tomcat) | Go (net/http)         |
|-------------------------|----------------------|-----------------------|
| **Unit of concurrency** | OS Thread            | Goroutine             |
| **Default per request** | 1 thread (from pool) | 1 goroutine (created) |
| **Memory per unit**     | ~1MB                 | ~2KB                  |
| **Max concurrent**      | ~Hundreds            | ~Millions             |
| **Configuration**       | Thread pool sizing   | Usually none needed   |
| **I/O handling**        | Blocks thread        | Yields goroutine      |
| **Context switching**   | OS kernel            | Go runtime            |

## Practical Implications for YiYu

### Spring Boot approach:
```java
@RestController
public class QuoteController {
    
    @GetMapping("/quote/generate")
    public Quote generate() {
        // Runs on Tomcat thread pool thread
        // Thread blocks during OpenAI API call
        return openAIService.generate();  // thread waits
    }
    
    // For high load, need async:
    @GetMapping("/quote/generate-async")
    public CompletableFuture<Quote> generateAsync() {
        return CompletableFuture.supplyAsync(
            () -> openAIService.generate(),
            executorService  // Another thread pool!
        );
    }
}
```

### Go approach:
```go
func (h *QuoteHandler) GenerateQuote(w http.ResponseWriter, r *http.Request) {
    // Already in a goroutine (created by net/http)
    // Just call OpenAI directly - goroutine yields automatically
    quote, err := h.llm.GenerateQuote(category)
    if err != nil {
        http.Error(w, err.Error(), 500)
        return
    }
    json.NewEncoder(w).Encode(quote)
}
```

**No async/await syntax needed. No separate thread pools. It just works.**

## Common Patterns

### Spawning goroutines explicitly:
```go
// Fire and forget
go sendAnalytics(data)

// Wait for result
done := make(chan bool)
go func() {
    doWork()
    done <- true
}()
<-done  // wait
```

### Fan-out pattern (parallel requests):
```go
func fetchMultiple(urls []string) []Result {
    results := make(chan Result, len(urls))
    
    // Spawn goroutine per URL
    for _, url := range urls {
        go func(u string) {
            resp := fetch(u)
            results <- resp
        }(url)
    }
    
    // Collect results
    output := make([]Result, len(urls))
    for i := range urls {
        output[i] = <-results
    }
    return output
}
```

### Timeout pattern:
```go
func fetchWithTimeout(url string, timeout time.Duration) (Result, error) {
    result := make(chan Result, 1)
    
    go func() {
        result <- fetch(url)
    }()
    
    select {
    case r := <-result:
        return r, nil
    case <-time.After(timeout):
        return Result{}, errors.New("timeout")
    }
}
```

## Gotchas from Java Mindset

1. **Don't create thread pools for I/O** - Just spawn goroutines
2. **Goroutines are cheap** - Don't reuse them like threads
3. **No ThreadLocal** - Use context.Context for request-scoped data
4. **Race conditions still exist** - Use mutexes or channels
5. **Goroutines leak if not cleaned up** - Always ensure they exit

```ad-danger
**Memory leak**: Goroutines that never exit leak memory. Always ensure goroutines can complete or be cancelled.
```

## Mental Model Shift

| Java/Spring Thinking                   | Go Thinking                                     |
|----------------------------------------|-------------------------------------------------|
| "Thread pools are limited, be careful" | "Goroutines are cheap, use freely"              |
| "Need async for I/O concurrency"       | "Just spawn goroutine, it yields automatically" |
| "Configure thread pools carefully"     | "GOMAXPROCS = cores, usually fine"              |
| "WebFlux for reactive"                 | "Standard I/O is already non-blocking"          |

**Go philosophy**: Concurrency is built-in and cheap. Use it liberally.

## For YiYu Project

**What you'll write:**
```go
func main() {
    r := chi.NewRouter()
    r.Get("/api/quote/today", handler.GetTodayQuote)
    http.ListenAndServe(":8080", r)
}
```

**What happens automatically:**
1. Request arrives
2. `net/http` spawns goroutine
3. Handler runs in goroutine
4. OpenAI API call → goroutine yields
5. Response ready → goroutine completes
6. Goroutine cleaned up

**No configuration needed for this!**

### References

- [Go Concurrency Patterns](https://go.dev/blog/pipelines)
- [Effective Go - Concurrency](https://go.dev/doc/effective_go#concurrency)
- [Go Scheduler](https://www.ardanlabs.com/blog/2018/08/scheduling-in-go-part1.html)


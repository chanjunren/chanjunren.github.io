🗓️ 26102024 1520

# goroutines_channels

**Core Concept**: Goroutines communicate via channels - typed conduits for sending and receiving values, enabling safe concurrent communication without shared memory.

## Basic Channel

```go
// Create channel
ch := make(chan string)

// Send (blocks until received)
ch <- "message"

// Receive (blocks until sent)
msg := <-ch
```

## Buffered Channels

```go
// Buffered channel (capacity 3)
ch := make(chan int, 3)

ch <- 1  // doesn't block
ch <- 2  // doesn't block
ch <- 3  // doesn't block
ch <- 4  // blocks until someone receives
```

## Channel Patterns

### Producer-Consumer
```go
func producer(ch chan<- int) {  // send-only
    for i := 0; i < 10; i++ {
        ch <- i
    }
    close(ch)  // Signal done
}

func consumer(ch <-chan int) {  // receive-only
    for num := range ch {  // Loop until closed
        fmt.Println(num)
    }
}

func main() {
    ch := make(chan int)
    go producer(ch)
    consumer(ch)
}
```

### Fan-Out (Multiple Workers)
```go
func worker(id int, jobs <-chan int, results chan<- int) {
    for job := range jobs {
        results <- process(job)
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)
    
    // Start 3 workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }
    
    // Send jobs
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)
    
    // Collect results
    for r := 1; r <= 9; r++ {
        <-results
    }
}
```

### Fan-In (Merge Channels)
```go
func fanIn(ch1, ch2 <-chan string) <-chan string {
    out := make(chan string)
    
    go func() {
        for {
            select {
            case msg := <-ch1:
                out <- msg
            case msg := <-ch2:
                out <- msg
            }
        }
    }()
    
    return out
}
```

## Select Statement

```go
select {
case msg := <-ch1:
    fmt.Println("ch1:", msg)
case msg := <-ch2:
    fmt.Println("ch2:", msg)
case <-time.After(1 * time.Second):
    fmt.Println("timeout")
default:
    fmt.Println("no activity")
}
```

**Select chooses first available case randomly if multiple ready.**

## Timeout Pattern

```go
func fetchWithTimeout(url string) (string, error) {
    result := make(chan string, 1)
    
    go func() {
        data := fetch(url)
        result <- data
    }()
    
    select {
    case data := <-result:
        return data, nil
    case <-time.After(5 * time.Second):
        return "", errors.New("timeout")
    }
}
```

## Quit Channel Pattern

```go
func worker(quit <-chan bool) {
    for {
        select {
        case <-quit:
            fmt.Println("stopping")
            return
        default:
            // do work
        }
    }
}

func main() {
    quit := make(chan bool)
    go worker(quit)
    
    time.Sleep(2 * time.Second)
    quit <- true  // Signal to stop
}
```

## Pipeline Pattern

```go
func generator(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n
        }
        close(out)
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            out <- n * n
        }
        close(out)
    }()
    return out
}

func main() {
    // Pipeline: generator → square → print
    for n := range square(generator(1, 2, 3, 4)) {
        fmt.Println(n)
    }
}
```

## Channel Direction

```go
// Send-only
func send(ch chan<- int) {
    ch <- 42
}

// Receive-only
func receive(ch <-chan int) {
    val := <-ch
}

// Bidirectional (can pass to either)
ch := make(chan int)
```

```ad-tip
Use directional channels in function signatures to make intent clear and catch mistakes at compile time.
```

## Closing Channels

```go
ch := make(chan int)

// Sender closes
close(ch)

// Receiver checks
val, ok := <-ch
if !ok {
    fmt.Println("channel closed")
}

// Range automatically stops on close
for val := range ch {
    fmt.Println(val)
}
```

```ad-warning
Only sender should close channels. Closing receive-only channel is compile error. Sending on closed channel panics.
```

## Common Patterns

### Done Channel
```go
func worker(done <-chan struct{}) {
    for {
        select {
        case <-done:
            return
        default:
            // work
        }
    }
}
```

### Wait for N
```go
func waitForN(n int, tasks []func()) {
    done := make(chan bool)
    
    for _, task := range tasks {
        go func(t func()) {
            t()
            done <- true
        }(task)
    }
    
    for i := 0; i < n; i++ {
        <-done
    }
}
```

## Best Practices

1. **Channels communicate ownership** - Pass data, don't share memory
2. **Close from sender side** - Never close from receiver
3. **Don't communicate by sharing memory** - Share memory by communicating
4. **Use buffered channels sparingly** - Unbuffered forces synchronization
5. **Check if closed when needed** - `val, ok := <-ch`

## Deadlock Example

```go
// DEADLOCK - nothing receives
func bad() {
    ch := make(chan int)
    ch <- 42  // blocks forever
}

// FIXED - goroutine receives
func good() {
    ch := make(chan int)
    go func() {
        <-ch
    }()
    ch <- 42
}
```

## Related Concepts

- [[go_concurrency_model]] - How goroutines work
- [[go_context]] - Cancellation and timeouts
- [[go_sync_primitives]] - Mutexes and WaitGroups
- [[golang_basics]] - Go fundamentals

### References

- [Go Concurrency Patterns](https://go.dev/blog/pipelines)
- [Share Memory by Communicating](https://go.dev/blog/codelab-share)


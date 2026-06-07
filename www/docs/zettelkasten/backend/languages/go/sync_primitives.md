🗓️ 07062026 1050
📎

# sync_primitives

**Core Concept**: The `sync` package guards **shared memory** with locks and one-time/coordination helpers. Reach for it when passing data through [[channels]] would be awkward.

## Channels vs mutexes

Both solve concurrency, but for different shapes:

- **Channels** — when you're *passing ownership* of data or *coordinating* goroutines (pipelines, fan-out, signalling). See [[channels]] and [[select]].
- **Mutexes** — when goroutines *share* one piece of state and you just need mutually-exclusive access (a cache, a counter, a registry map).

Rule of thumb: a mutex protecting a struct field is simpler and faster than a channel-guarded goroutine for plain shared state. Don't force everything through channels.

## Mutex and RWMutex

`sync.Mutex` gives exclusive access. `sync.RWMutex` allows many concurrent readers **or** one writer — use it when reads vastly outnumber writes.

```go
type Cache struct {
    mu sync.RWMutex
    m  map[string]string
}

func (c *Cache) Get(k string) (string, bool) {
    c.mu.RLock()            // many readers allowed
    defer c.mu.RUnlock()
    v, ok := c.m[k]
    return v, ok
}

func (c *Cache) Set(k, v string) {
    c.mu.Lock()             // exclusive
    defer c.mu.Unlock()
    c.m[k] = v
}
```

Always pair Lock with Unlock via [[defer]] so an early return or panic can't leave the lock held.

```ad-warning
Never copy a struct that contains a `sync.Mutex` — the copy gets its own lock and protection breaks. This is why such structs are used through pointers ([[pointers]]) and `go vet` flags lock copies.
```

## WaitGroup: wait for N goroutines

`sync.WaitGroup` blocks until a set of goroutines finishes. `Add` before launching, `Done` when each ends (via defer), `Wait` to join.

```go
var wg sync.WaitGroup
for _, url := range urls {
    wg.Add(1)
    go func(u string) {
        defer wg.Done()
        fetch(u)
    }(u)
}
wg.Wait()   // returns once all Done
```

## Once and Map

- **`sync.Once`** runs a function exactly once across all goroutines — lazy singletons, one-time init.
  ```go
  var once sync.Once
  once.Do(setup)   // setup runs on the first call only
  ```
- **`sync.Map`** is a concurrent map tuned for *write-once / read-many* (and disjoint keys). For the common case — a regular map plus an `RWMutex` — prefer that; it's clearer and usually fine. Use `sync.Map` only when profiling shows lock contention.

## Snapshot under a read lock

A frequent pattern: hold a read lock just long enough to copy what you need, release, then do slow work on the copy. This keeps the critical section tiny.

```go
func (r *Registry) Names() []string {
    r.mu.RLock()
    names := make([]string, 0, len(r.items))
    for name := range r.items {
        names = append(names, name)
    }
    r.mu.RUnlock()
    return names    // operate on the snapshot, lock already released
}
```

## Examples

```ad-example
A registry that's written rarely (at startup) and read often (per request) — RWMutex is the right fit:
```go
type Registry struct {
    mu    sync.RWMutex
    funcs map[string]func() error
}

func (r *Registry) Register(name string, fn func() error) {
    r.mu.Lock()
    defer r.mu.Unlock()
    r.funcs[name] = fn
}

func (r *Registry) RunAll() map[string]error {
    r.mu.RLock()
    snapshot := make(map[string]func() error, len(r.funcs))
    for k, v := range r.funcs {
        snapshot[k] = v
    }
    r.mu.RUnlock()              // release before running

    results := make(map[string]error)
    for name, fn := range snapshot {
        results[name] = fn()
    }
    return results
}
```
```

## References

- [sync package](https://pkg.go.dev/sync)
- [Go Blog: sync.Map](https://go.dev/blog/maps)

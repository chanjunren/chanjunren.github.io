🗓️ 13032026 1200

# compare_and_swap

```mermaid
sequenceDiagram
    participant Thread
    participant Memory
    Thread->>Memory: Read current value
    Thread->>Thread: Compute new value
    Thread->>Memory: Compare current value and swap
    alt Equal to expected value
        Memory-->>Thread: Update succeeds
    else Changed by another thread
        Memory-->>Thread: Retry with new value
    end
```

## What Is CAS?
- A CPU-level atomic instruction: "set this value to X **only if** it's currently Y"
- If another thread changed it in between, CAS fails and you retry
- Used by `AtomicInteger`, `ConcurrentHashMap`, and lock-free algorithms
- **No blocking** — threads don't wait, they just retry (called "spinning")

```java
// Pseudocode for what AtomicInteger.incrementAndGet() does:
do {
    current = read(value);         // read current value
    next = current + 1;
} while (!cas(value, current, next)); // retry if someone else changed it
```

## CAS vs Locking

| Approach | How it works | Tradeoff |
|---|---|---|
| **Locking** (`synchronized`) | Block other threads | Safe but threads wait |
| **CAS** (lock-free) | Retry on conflict | No blocking but wastes CPU on retries under high contention |

---
## References
- [[cpu_cache_and_memory_visibility]]
- [[concurrency_data_structures]]

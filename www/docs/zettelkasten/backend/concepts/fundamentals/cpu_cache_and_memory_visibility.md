🗓️ 13032026 1200

# cpu_cache_and_memory_visibility

## CPU Caches and Main Memory
- Each CPU core has its own **cache** (L1/L2) for speed — much faster than reading from main memory (RAM)
- When a thread writes `value = 42`, that write may **sit in the core's cache** and not reach main memory immediately
- Another thread on a different core reads from **its own cache** or main memory — it may see the **old** value

```
Core 1 cache: value = 42  ← Thread A wrote here
         ↕ (not flushed yet)
    Main memory: value = 0
         ↕
Core 2 cache: value = 0   ← Thread B reads this (stale!)
```

## Instruction Reordering
- The compiler and CPU can **reorder instructions** for performance, as long as the result looks correct **to the current thread**
- But other threads may see the reordered result

```java
// Thread A writes:
value = 42;     // (1)
ready = true;   // (2)

// CPU might reorder to: (2) then (1)
// Thread B could see: ready = true, value = 0
```

## Implications
These two problems — **stale caches** and **instruction reordering** — are why concurrent code needs explicit memory ordering guarantees (e.g. `synchronized`, `volatile`, memory fences).

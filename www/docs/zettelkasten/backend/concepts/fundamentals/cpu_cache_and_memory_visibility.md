🗓️ 17102026 2135

# cpu_cache_and_memory_visibility

Concurrent code needs a memory-ordering contract; source-code order alone does not guarantee what another thread observes.

Modern CPUs use caches and may reorder operations, while compilers may transform code as long as single-thread behavior is preserved. The Java Memory Model defines which cross-thread observations are allowed through *happens-before* relationships. It does not require application code to reason about flushing a particular CPU cache line.

For example, a write followed by a volatile write can be made visible to a thread that subsequently reads that same volatile variable. In Java, `synchronized`, `volatile`, and concurrency utilities establish specified ordering relationships; they are not interchangeable, and the right mechanism depends on the invariant being protected.

```java
int value;
volatile boolean ready;

// Writer
value = 42;
ready = true;

// Reader: after observing ready == true, value is guaranteed visible
if (ready) {
    use(value);
}
```

This is a happens-before example, not a recommendation to publish mutable state through arbitrary fields. See [[java_memory_model_happens_before]] for the formal rule and [[compare_and_swap]] for atomic read-modify-write operations.

## References

- [Java Language Specification: Threads and Locks](https://docs.oracle.com/javase/specs/jls/se17/html/jls-17.html)

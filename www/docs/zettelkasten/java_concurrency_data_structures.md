🗓️ 19082025 1420
📎

# java_concurrency_data_structures

## 🧵 ConcurrentHashMap & newKeySet()
- Best for: High-frequency reads, cache lookups, thread-safe Sets
- Performance: O(1) lock-free reads, [[segmented_locking]] for writes
- Memory: ~32 bytes per entry, medium overhead
- Thread Safety: Lock-free reads, concurrent writes
- Use Case: 99%+ read scenarios, membership checks

## 📊 ConcurrentSkipListSet
> [[skip_list]]
- Best for: Sorted concurrent collections, range queries
- Performance: O(log n) for all operations
- Memory: Higher overhead due to multi-level structure
- Thread Safety: Lock-free via CAS operations
- Use Case: Need sorted order + concurrency

## 📝 CopyOnWriteArraySet
- Best for: Small collections with rare updates
- Performance: O(n) reads, O(n) writes (full copy)
- Memory: Low overhead, but copies entire array on write
- Thread Safety: Snapshot isolation
- Use Case: < 50 items, very infrequent updates

## 🔒 Collections.synchronizedSet()
- Best for: Legacy compatibility only
- Performance: Poor - all operations synchronized
- Memory: Low overhead
- Thread Safety: Coarse-grained locking
- Use Case: Avoid in new code

## 🏃 ConcurrentLinkedQueue
- Best for: Producer-consumer scenarios
- Performance: O(1) enqueue/dequeue operations
- Memory: Node-based structure, moderate overhead
- Thread Safety: Lock-free via CAS
- Use Case: High-throughput queuing

## 🚫 ArrayBlockingQueue
- Best for: Bounded queues with backpressure
- Performance: O(1) with blocking capabilities
- Memory: Fixed-size array, predictable memory
- Thread Safety: ReentrantLock with conditions
- Use Case: Rate limiting, bounded buffers

## ⚡ ConcurrentLinkedDeque
- Best for: Double-ended concurrent operations
- Performance: O(1) operations at both ends
- Memory: Node-based, higher than array-based
- Thread Safety: Lock-free
- Use Case: Work-stealing algorithms

## 🎯 Key Decision Factors
- Read/Write Ratio:
	- 99% reads: ConcurrentHashMap types
	- Balanced: Traditional concurrent collections
	- 99% writes: Consider non-blocking queues
- Size Expectations:
	- Small (< 100): CopyOnWrite collections
	- Large (> 1000): ConcurrentHashMap variants
	- Unbounded: ConcurrentLinked collections
- Ordering Requirements:
	- No order: ConcurrentHashMap
	- Natural order: ConcurrentSkipListSet
	- Insertion order: ConcurrentLinkedDeque
- Memory Constraints:
	- Tight memory: Collections.synchronized (avoid)
	- Moderate: ConcurrentHashMap variants
	- Flexible: Any concurrent collection

---
# References

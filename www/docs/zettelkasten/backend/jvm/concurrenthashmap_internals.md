🗓️ 29042026 1645
📎 #java #concurrency #collections

# concurrenthashmap_internals

> The thread-safe map of choice in Java. The implementation changed substantially between JDK 7 and JDK 8 — from segment-based lock striping to per-bucket CAS plus selective synchronisation. Knowing which version's design you're describing matters; many older guides describe JDK 7 internals that no longer apply.

## Why HashMap Isn't Thread-Safe

`HashMap` is unsafe under concurrent modification:

- **Lost updates** — two threads inserting different keys with the same hash both update the same bucket head; one write wins.
- **Resize race (JDK 7)** — concurrent resize could form a circular linked list in the bucket. Subsequent `get()` looped forever — the famous "infinite loop in `HashMap.get`" bug. Every Java engineer has heard this story.
- **Inconsistent observation** — iterators throw `ConcurrentModificationException` (best case) or silently return wrong results (worst case).

`ConcurrentHashMap` (CHM) solves these without serialising every read.

## JDK 7 — Segment-Based Lock Striping

Conceptual structure:

```
ConcurrentHashMap (JDK 7)
  ├── Segment[0]   ── ReentrantLock + HashEntry[]
  ├── Segment[1]   ── ReentrantLock + HashEntry[]
  ├── ...
  └── Segment[15]  ── ReentrantLock + HashEntry[]
```

Default 16 segments. A key's segment chosen by upper hash bits. Each segment is essentially a small `HashMap` guarded by its own `ReentrantLock`.

### Operations

- **`get(key)`** — find segment, no lock for read in the common case (volatile reads + special structure). Lock only on inconsistent state during resize.
- **`put(key, value)`** — find segment, acquire its lock, do the put.
- **`size()`** — sum the size of every segment. Tries lock-free first (read counts twice; if equal, return); falls back to locking all segments.
- **Resize** — happens per-segment, not globally. One segment can resize while others are normal.

### Concurrency level

```java
new ConcurrentHashMap<>(initialCapacity, loadFactor, concurrencyLevel);
```

`concurrencyLevel` (default 16) = number of segments = max concurrent writers. Hard ceiling on write parallelism. Setting it too low caps throughput; too high wastes memory.

## JDK 8+ — Per-Bucket CAS + Synchronisation

The internal structure changed completely. Segments are gone. The map is a single `Node[]` array (the "table"), exactly like `HashMap`.

```
ConcurrentHashMap (JDK 8+)
  └── Node[]    ── each entry: head of bucket (linked list or red-black tree)
```

### Operations

- **`get(key)`** — fully lock-free in the steady state. Just reads `volatile` head, walks linked list (or tree).
- **`put(key, value)`**:
  1. Compute hash, find bucket index.
  2. **If bucket is empty**: CAS to insert the new node as bucket head. No lock taken.
  3. **If bucket is non-empty**: `synchronized` on the bucket's head node. Walk the chain, update or insert.
  4. After insert: if the chain length exceeds 8, **treeify** to a red-black tree.
- **`size()`** — uses a striped counter (similar to `LongAdder`) to avoid contention. Approximate during concurrent updates; consistent at quiescence.
- **Resize** — incremental and **multi-thread cooperative**. Each thread that touches a bucket during resize helps move some entries.

### Why It's Faster

- **Reads are fully lock-free** — readers compete with no one.
- **Writes only contend at the *bucket* level**, not the segment (16-bucket) level. Two writers on different buckets never lock the same thing.
- **Empty buckets** (the common case) are handled with one CAS, no synchronisation at all.

The JDK 7 segment design's worst case (16-thread parallelism cap) became the JDK 8 design's normal case (thousands of buckets = thousands of writers possible).

## Treeify — Red-Black Tree on Collisions

If a bucket's chain length grows past 8 entries (and the table size is ≥ 64), the chain is converted to a red-black tree:

- **Lookup**: O(log n) instead of O(n).
- **Insert/delete**: O(log n).
- Reverts to linked list ("untreeify") when count drops below 6.

Why 8? Probability of a chain reaching length 8 with a good hash is `<1 in 10^8` (Poisson distribution). At 8, the cost of treeification is paid back by faster lookup; below 8, the linear scan is cheaper.

This is mostly a defence against **hash flooding** (adversarial keys all colliding) — without treeify, an attacker could degrade hashmap operations to O(n).

## Bucket Synchronisation Details

The `synchronized(head)` lock during put taken on the bucket's *first* node. Special case: during resize, the head is a `ForwardingNode` sentinel; that node's lock is held by the resizing thread.

This means concurrent puts on different buckets never interfere, even if the buckets are adjacent in memory. The locks are independent objects.

## size() — The Counter Cells Trick

Every put/remove updates a counter. Naively, this becomes a contention point itself. CHM uses **counter cells** (same idea as `LongAdder`):

```
baseCount: 1234
counterCells: [+5, +12, -3, +8, ...]
size = baseCount + sum(cells)
```

Each thread updates its own striped cell via CAS. `size()` sums them. Approximate under concurrent mutation, exact at quiescence.

## API Beyond Get/Put

```java
map.computeIfAbsent(key, k -> expensiveCompute(k));
map.compute(key, (k, v) -> v == null ? 1 : v + 1);
map.merge(key, 1, Integer::sum);
map.putIfAbsent(key, value);
map.replace(key, oldValue, newValue);     // CAS-style
```

These are atomic — the map handles the lock/CAS so the lambda sees a consistent state. Crucial: `computeIfAbsent` is the right way to "get or create" without two threads both creating.

`computeIfAbsent` can deadlock if the lambda touches the same map for the same bucket. Avoid recursive map operations inside the lambda.

## Memory and Performance Costs

- **Volatile reads** in get path — slightly more expensive than HashMap's plain reads, but still single-digit nanoseconds.
- **CAS in put** — compared to HashMap's plain write, costs an extra ~5–10 ns for the CAS.
- **Synchronization fall-back** — under collision, lock acquisition. Modern JVMs make this very fast (lightweight lock).
- **Memory** — slightly more per node (CHM nodes have a `volatile` next + `volatile` value).

In practice: CHM is roughly as fast as HashMap for read-heavy workloads, slightly slower for write-heavy, vastly safer.

## Common Pitfalls

- **Treating CHM like HashMap for compound operations** — `if (!map.containsKey(k)) map.put(k, v)` is racy. Use `putIfAbsent` or `computeIfAbsent`.
- **`computeIfAbsent` with a slow lambda** — the bucket lock is held during the lambda. Other writers to the same bucket block. Keep computation cheap or move to `getOrDefault` + manual put.
- **Recursive map operations in lambda** — `computeIfAbsent` lambda calls another method on the same map for the same key → deadlock or `IllegalStateException` since JDK 9.
- **Iterating during mutation** — CHM's iterators are weakly consistent: they don't throw CME, but may or may not reflect concurrent modifications. Don't rely on iteration order or completeness during writes.
- **Assuming `size()` is exact** — it's approximate under concurrent mutation. For an exact count, drain to a snapshot.
- **`null` keys or values** — CHM forbids both (HashMap allows one null key). Throws NPE. Reason: ambiguity between "key absent" and "key present with null value" in `get`.
- **Reading then writing without atomic op** — even on CHM, `int n = map.get(k); map.put(k, n+1);` is racy. Use `merge` or `compute`.
- **Comparing JDK 7 and JDK 8 advice blindly** — many old guides say "set concurrencyLevel to thread count". JDK 8+ ignores it (kept only for backward-compat).

## Related

- [[volatile_synchronized_atomic_difference]] — the primitive trio CHM combines.
- [[cas_compare_and_swap]] — bucket-empty insert is a CAS.
- [[reentrantlock_vs_synchronized]] — JDK 7 used ReentrantLock per segment; JDK 8 uses synchronized on bucket head.
- [[java_memory_model_happens_before]] — CHM's volatile reads + CAS establish HB.
- [[thread_pool_executor_internals]] — internal `Worker` count and queue may be CHM-backed in some implementations.

---

## References

- Doug Lea: [ConcurrentHashMap source](https://gee.cs.oswego.edu/dl/concurrency-interest/) — the canonical implementation.
- Brian Goetz: ["Building a better HashMap"](https://www.ibm.com/developerworks/library/j-jtp08223/) — older but still good for context.
- "Java Concurrency in Practice" (Goetz) ch. 5.

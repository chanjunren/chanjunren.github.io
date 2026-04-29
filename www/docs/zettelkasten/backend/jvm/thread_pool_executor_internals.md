🗓️ 29042026 1700
📎 #java #concurrency #thread_pool

# thread_pool_executor_internals

> The submission rule, the lifecycle states, and the reject policies of `ThreadPoolExecutor`. Real production bugs (OOMs, dropped tasks, slow shutdowns) come from misunderstanding the order of operations or picking the wrong queue + reject combination.

## The Constructor — All Knobs at Once

```java
new ThreadPoolExecutor(
  corePoolSize,           // base number of threads
  maximumPoolSize,        // ceiling
  keepAliveTime,          // how long extra (above core) threads idle before dying
  TimeUnit,
  workQueue,              // BlockingQueue<Runnable>
  threadFactory,
  rejectedExecutionHandler
);
```

`Executors.newFixedThreadPool(N)`, `newCachedThreadPool()`, etc. are wrappers — but pre-set choices that are sometimes the wrong ones in production. Knowing the underlying constructor exposes the dangers.

## The Submission Rule — Order of Operations

When `execute(task)` is called:

```ad-abstract
1. **If pool size < core**: start a new thread to run the task. (Even if other threads are idle — this is a quirk; cores are filled lazily.)
2. **Else if queue accepts the task**: enqueue it. An idle worker will pick it up later.
3. **Else if pool size < max**: start a new thread above core size to run the task.
4. **Else**: reject via the configured rejection handler.
```

The order is: **core → queue → max → reject**. This is the most-asked single fact about TPE.

### Why This Surprises People

The middle step — **queue first, max second** — has a counter-intuitive consequence: **with an unbounded queue, max-pool-size is never used.** The queue always accepts; you stay at core size forever.

`Executors.newFixedThreadPool(N)` uses an unbounded `LinkedBlockingQueue`. Tasks pile up in the queue when the N threads are busy. **Memory grows without limit.** OOM eventually.

`Executors.newCachedThreadPool()` uses a `SynchronousQueue` (capacity 0; offer fails unless a worker is ready). Step 2 fails immediately, so step 3 always runs → pool grows up to `Integer.MAX_VALUE`. **Threads grow without limit.** OOM via thread stack memory.

Both classic factories have known failure modes. Production code should construct `ThreadPoolExecutor` directly with conscious choices.

## Queue Choice Matters

| Queue                    | Behaviour                                                  |
|--------------------------|------------------------------------------------------------|
| `LinkedBlockingQueue` (unbounded) | Always accepts; max never reached → OOM in queue. |
| `LinkedBlockingQueue(N)`         | Accepts up to N; then max-pool kicks in.        |
| `ArrayBlockingQueue(N)`          | Bounded, array-backed; faster than linked at scale. |
| `SynchronousQueue`               | Capacity 0. Step 2 fails unless a worker is ready → max-pool grows aggressively. |
| `PriorityBlockingQueue`           | Tasks prioritised; usually unbounded.            |
| Custom — `LinkedTransferQueue` etc. | Specialised for hand-off scenarios.            |

The right choice depends on the workload:

- **Short tasks, smooth load**: `LinkedBlockingQueue(reasonable_cap)` + reject policy.
- **Bursty work, want extra threads on bursts**: `SynchronousQueue` + sensible max + reject policy.
- **Batch processing, no overflow ever**: `ArrayBlockingQueue` sized to peak.

## Reject Policies

When step 4 fires (queue full and pool at max):

| Policy                            | Behaviour                                            |
|-----------------------------------|------------------------------------------------------|
| `AbortPolicy` (default)           | Throws `RejectedExecutionException`. Caller decides. |
| `CallerRunsPolicy`                | Runs the task in the calling thread. Backpressure: caller blocks until done. |
| `DiscardPolicy`                   | Silently drops the task. Dangerous; lost work.       |
| `DiscardOldestPolicy`             | Drops the oldest queued task, then submits the new one. Dangerous and weird. |
| Custom (`RejectedExecutionHandler`) | Anything you want — log + retry, route to fallback, etc. |

`CallerRunsPolicy` is the most underrated. It provides natural backpressure: when the pool is full, the caller's thread is conscripted, slowing the producer. No work lost.

`AbortPolicy` is correct when the caller has somewhere to put rejected tasks (a fallback queue, retry, persistent store).

## Pool Lifecycle States

```
RUNNING → SHUTDOWN → STOP → TIDYING → TERMINATED
```

- **RUNNING** — accepts new tasks, processes queue.
- **SHUTDOWN** (`shutdown()`) — rejects new submissions, finishes the queue. Existing tasks complete.
- **STOP** (`shutdownNow()`) — rejects new submissions, **interrupts running tasks**, returns the unprocessed queue.
- **TIDYING** — all tasks done; running cleanup hooks (`terminated()`).
- **TERMINATED** — fully done.

`awaitTermination(timeout)` blocks until TERMINATED or timeout.

### Graceful Shutdown Pattern

```java
pool.shutdown();
try {
  if (!pool.awaitTermination(30, TimeUnit.SECONDS)) {
    pool.shutdownNow();
    pool.awaitTermination(10, TimeUnit.SECONDS);
  }
} catch (InterruptedException e) {
  pool.shutdownNow();
  Thread.currentThread().interrupt();
}
```

This is the canonical pattern. Without it, the JVM may exit before pool tasks finish, or tasks may hang the shutdown forever.

## Sizing — Little's Law

Little's Law: `concurrent_tasks = throughput × latency_per_task`.

Examples:
- 1000 req/s, each takes 50 ms → 50 concurrent tasks → pool size 50.
- 100 req/s, each takes 1s → 100 concurrent tasks → pool size 100.

For CPU-bound work: pool size ≈ number of cores (typically `Runtime.getRuntime().availableProcessors()` ± 1).

For I/O-bound work: pool size ≈ `cores × (1 + waiting_time / compute_time)`. A task that spends 90% waiting (DB query, HTTP call) supports `cores × 10` threads productively before context-switching cost dominates.

In practice: **measure**. Profile under realistic load; size to keep utilisation high without queue depth growing unboundedly.

## Worker Internals (Briefly)

- A `Worker` extends `AbstractQueuedSynchronizer` and wraps a `Thread`.
- `runWorker` loop: pull from queue (blocking), execute task, repeat.
- Workers above core size die after `keepAliveTime` of idle.
- Worker count tracked in the same `AtomicInteger` as run state — packed: high 3 bits = state, low 29 bits = count.

The state-and-count packing is a clever atomic-state trick — it lets state transitions and count updates happen via a single CAS.

## Common Pitfalls

- **`Executors.newFixedThreadPool(N)`** — unbounded queue, OOM in production. Always construct `ThreadPoolExecutor` directly.
- **`Executors.newCachedThreadPool()`** — unbounded threads. OOM via stacks.
- **Unbounded queue + ignored max-pool** — same as above; max never matters. Bound the queue.
- **Setting `corePoolSize = 0`** — pool starts cold; first task goes to step 2 (queue) or step 3 (max). Unexpected latency.
- **Tasks submitting tasks to the same pool, with bounded queue** — deadlock. The submitting task fills the pool, then needs the pool to run its child, which can't because the pool is full. Use separate pools or `CallerRunsPolicy`.
- **Tasks holding locks across submissions** — same shape; resources held while subtask waits. Avoid.
- **`shutdown()` without `awaitTermination`** — tasks may not finish; the JVM may exit; daemon-thread pools die unceremoniously.
- **No `ThreadFactory` in production** — default thread names are `pool-N-thread-M`. When something goes wrong, identifying which pool is hard. Always set a meaningful name.
- **Uncaught exceptions in tasks** — `submit(Callable)` swallows them in the `Future`; `execute(Runnable)` propagates to the thread's `UncaughtExceptionHandler` (if set) and the worker dies (replaced by the pool). Always handle exceptions in tasks or set an UEH.
- **`ScheduledThreadPoolExecutor` with exception in periodic task** — the task is silently cancelled. Subsequent runs never happen. Catch within the task.
- **Same pool for I/O-bound and CPU-bound work** — slow I/O tasks starve fast CPU tasks. Use separate pools per workload class.
- **Forgetting context propagation** — MDC (logging context), security context, transaction context don't auto-propagate to pool threads. Use a `TaskDecorator` or wrap the task.

## Related

- [[concurrenthashmap_internals]] — built on similar atomic-state tricks.
- [[cas_compare_and_swap]] — the state field is a packed CAS-managed int.
- [[reentrantlock_vs_synchronized]] — `Worker` extends AQS; locks are tied in.
- [[jvm_memory_areas]] — every thread = one stack = memory cost.
- `thread_pool_sizing_little_law` *(planned)* — sizing maths in depth.
- `completablefuture_async_chains` *(planned)* — ForkJoinPool common pool, parallelism control.

---

## References

- "Java Concurrency in Practice" (Goetz) ch. 8 — the definitive treatment.
- Doug Lea: [ThreadPoolExecutor source](https://gee.cs.oswego.edu/dl/concurrency-interest/).
- Aleksey Shipilёv: ["Java Memory Model Pragmatics"](https://shipilev.net/blog/2014/jmm-pragmatics/) — for the memory-model intersection.

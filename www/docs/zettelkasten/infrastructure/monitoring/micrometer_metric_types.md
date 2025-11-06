🗓️ 06112025 0030

# micrometer_metric_types

**Core Concept**: Micrometer provides metric types (Counter, Timer, Gauge, DistributionSummary, LongTaskTimer) that map to Prometheus data types and determine how metrics are collected and queried.

## Why It Matters

Choosing the correct Micrometer metric type determines how data is exported to Prometheus and which PromQL functions work correctly. Wrong type = misleading metrics.

## Counter

**What**: Monotonically increasing value (only goes up)

**When to Use**: Count events - requests, errors, tasks completed, messages processed

**Unit**: Dimensionless count

**Java Example**:
```java
Counter counter = Counter.builder("http.requests")
    .tag("endpoint", "/api/users")
    .tag("status", "200")
    .register(meterRegistry);

counter.increment();        // +1
counter.increment(5.0);     // +5
```

**Prometheus Export**: Becomes [[prometheus_data_types]] Counter → query with `rate()`, `increase()`
- Exported as: `http_requests_total`

**Trade-offs**:
- ✅ Accurate for counting events
- ✅ Handles app restarts correctly
- ❌ Cannot decrease or be reset manually

## Timer

**What**: Measures duration of short-lived events + count

**When to Use**: API response times, database query duration, method execution time

**Unit**: Seconds (automatically converted from any time unit)

**Java Example**:
```java
Timer timer = Timer.builder("http.request.duration")
    .tag("endpoint", "/api/users")
    .publishPercentiles(0.5, 0.95, 0.99)  // Optional: client-side percentiles
    .serviceLevelObjectives(              // Optional: custom buckets
        Duration.ofMillis(10),
        Duration.ofMillis(50),
        Duration.ofMillis(100)
    )
    .register(meterRegistry);

// Method 1: Manual timing
Timer.Sample sample = Timer.start(meterRegistry);
// ... do work ...
sample.stop(timer);

// Method 2: Wrapper
timer.record(() -> {
    // ... do work ...
});

// Method 3: Record value directly
timer.record(Duration.ofMillis(123));
```

**Prometheus Export**: Becomes [[prometheus_histograms]] (default) or Summary
- Exported as: `http_request_duration_seconds_*`
- `_count` - total number of events
- `_sum` - total duration in seconds
- `_bucket` - histogram buckets for percentile calculation
- `_max` - maximum observed value

**Configuration Options**:

1. **No SLOs specified** (default):
   - Uses default buckets: `[1ms, 10ms, 50ms, 100ms, 500ms, 1s, 5s, 10s, 30s, 1m]`
   - Exports histogram buckets at these boundaries
   - Calculate percentiles server-side: `histogram_quantile(0.95, rate(metric_bucket[5m]))`

2. **With `.serviceLevelObjectives()`**:
   - Uses your custom bucket boundaries
   - Better accuracy for your specific latency profile
   - Example: `.serviceLevelObjectives(Duration.ofMillis(10), Duration.ofMillis(50))`

3. **With `.publishPercentiles()`**:
   - Adds pre-calculated client-side percentiles as separate metrics
   - Creates `{quantile="0.95"}` labels
   - ❌ Cannot aggregate across instances
   - Use only for single-instance apps

**Query with**: `histogram_quantile()`, `rate()`

**Trade-offs**:
- ✅ Flexible percentile calculation server-side
- ✅ Can aggregate across instances
- ❌ Approximate percentiles only (bucket-based)
- ❌ More cardinality (one series per bucket)

## Gauge

**What**: Current value that can go up or down

**When to Use**: Memory usage, queue size, active threads, cache hit rate, temperature

**Unit**: Depends on what you're measuring (bytes, count, ratio, etc.) - specify with `.baseUnit()`

**Java Example**:
```java
// Method 1: Track a collection/number
List<String> queue = new ArrayList<>();
Gauge.builder("queue.size", queue, List::size)
    .register(meterRegistry);

// Method 2: Track AtomicInteger/AtomicLong
AtomicInteger activeConnections = new AtomicInteger(0);
Gauge.builder("connections.active", activeConnections, AtomicInteger::get)
    .register(meterRegistry);

// Method 3: Cache stats with explicit unit
Gauge.builder("cache.hit.ratio", cache, c -> c.stats().hitRate())
    .baseUnit("ratio")  // Optional: specify unit
    .register(meterRegistry);

// Method 4: Memory with bytes
Gauge.builder("jvm.memory.used", memoryBean, MemoryMXBean::getHeapMemoryUsage)
    .baseUnit("bytes")
    .register(meterRegistry);
```

**Prometheus Export**: Becomes [[prometheus_data_types]] Gauge → query with `avg_over_time()`, `delta()`
- Exported as: `queue_size`, `jvm_memory_used_bytes`, etc.

**Trade-offs**:
- ✅ Shows current state instantly
- ✅ Natural for fluctuating values
- ❌ Needs strong reference to measured object
- ❌ Can miss spikes between scrapes

```ad-warning
Gauges require a strong reference. If the measured object is garbage collected, the gauge stops updating.
```

## DistributionSummary

**What**: Tracks distribution of values (not durations)

**When to Use**: Request payload sizes, response sizes, transaction amounts, batch sizes

**Unit**: Specify with `.baseUnit()` - typically bytes, count, or currency

**Java Example**:
```java
DistributionSummary summary = DistributionSummary.builder("request.size")
    .tag("endpoint", "/api/upload")
    .baseUnit("bytes")
    .publishPercentiles(0.5, 0.95, 0.99)  // Optional
    .serviceLevelObjectives(1024, 4096, 16384)  // Optional: custom buckets
    .register(meterRegistry);

summary.record(1024);      // Record 1KB
summary.record(2048);      // Record 2KB
```

**Prometheus Export**: Becomes [[prometheus_histograms]] or Summary (same as Timer, but for sizes not durations)
- Exported as: `request_size_bytes_*`
- Same bucket/percentile behavior as Timer

**Trade-offs**:
- ✅ Aggregatable percentiles
- ✅ Flexible bucket boundaries
- ❌ More storage (buckets)

**Timer vs DistributionSummary**: Use Timer for durations (seconds), DistributionSummary for sizes/amounts (bytes, count, dollars).

## LongTaskTimer

**What**: Measures duration of tasks still running + already completed

**When to Use**: Batch jobs, background tasks, data migrations, long-running operations

**Unit**: Seconds (for duration metrics)

**Java Example**:
```java
LongTaskTimer timer = LongTaskTimer.builder("batch.job.duration")
    .tag("job", "data-export")
    .register(meterRegistry);

// Start tracking
LongTaskTimer.Sample sample = timer.start();
try {
    // ... long-running work ...
} finally {
    sample.stop();
}
```

**Prometheus Export**: Multiple gauge metrics (not histograms)
- Exported as: `batch_job_duration_seconds_*`
- `_active_count` - number of currently running tasks (dimensionless)
- `_duration_sum` - total duration of active tasks (seconds)
- `_max` - longest currently running task (seconds)

**Query with**: Direct values (no rate needed)

**Trade-offs**:
- ✅ Track in-progress operations
- ✅ Detect stuck jobs
- ❌ Doesn't provide histogram/percentiles
- ❌ Limited historical data

**Timer vs LongTaskTimer**: Timer for completed events, LongTaskTimer for monitoring tasks while they run.

## FunctionCounter / FunctionTimer

**What**: Counter/Timer that polls a function instead of explicit increment/record calls

**When to Use**: Wrap existing metrics from libraries/frameworks you don't control

**Java Example**:
```java
ExecutorService executor = Executors.newFixedThreadPool(10);

// FunctionCounter - poll task count
FunctionCounter.builder("executor.tasks.completed", executor,
    e -> ((ThreadPoolExecutor) e).getCompletedTaskCount())
    .register(meterRegistry);

// FunctionTimer - poll count + total time
FunctionTimer.builder("cache.gets", cache,
    c -> c.stats().loadCount(),           // count
    c -> c.stats().totalLoadTime(),       // total time
    TimeUnit.NANOSECONDS)
    .register(meterRegistry);
```

**Trade-offs**:
- ✅ No code changes to tracked component
- ✅ Poll existing metrics
- ❌ Less accurate (scrape-interval dependent)
- ❌ Cannot capture sub-scrape events

## TimeGauge

**What**: Gauge specifically for time durations

**When to Use**: Application uptime, time since last event

**Unit**: Seconds (converted from specified TimeUnit)

**Java Example**:
```java
AtomicLong startTime = new AtomicLong(System.currentTimeMillis());

TimeGauge.builder("app.uptime", startTime,
    TimeUnit.MILLISECONDS,  // Input unit
    t -> System.currentTimeMillis() - t.get())
    .register(meterRegistry);
```

**Prometheus Export**: Becomes Gauge
- Exported as: `app_uptime_seconds` (converted to seconds)

## Quick Reference

| Type                    | Use Case              | Prometheus Type  | Query Functions                  |
|-------------------------|-----------------------|------------------|----------------------------------|
| **Counter**             | Count events          | Counter          | `rate()`, `increase()`           |
| **Timer**               | Measure durations     | Histogram        | `histogram_quantile()`, `rate()` |
| **Gauge**               | Current state         | Gauge            | `avg_over_time()`, direct value  |
| **DistributionSummary** | Measure sizes         | Histogram        | `histogram_quantile()`           |
| **LongTaskTimer**       | Track running tasks   | Gauge (multiple) | Direct values                    |
| **FunctionCounter**     | Poll external counter | Counter          | `rate()`, `increase()`           |
| **FunctionTimer**       | Poll external timer   | Histogram        | `histogram_quantile()`           |
| **TimeGauge**           | Measure time values   | Gauge            | Direct value                     |

## Decision Tree

```
Measuring duration?
├─ Yes → Short-lived events? 
│        ├─ Yes → Timer
│        └─ No → LongTaskTimer
└─ No → Value increases only?
         ├─ Yes → Counter
         └─ No → Current value?
                  ├─ Time value → TimeGauge
                  ├─ Size/amount → DistributionSummary
                  └─ Other → Gauge
```

## Common Patterns

**HTTP Request Metrics**:
```java
Timer.builder("http.request.duration")
    .tag("method", "GET")
    .tag("endpoint", "/api/users")
    .tag("status", "200")
    .register(registry);

Counter.builder("http.requests.total")
    .tag("method", "GET")
    .tag("endpoint", "/api/users")
    .tag("status", "200")
    .register(registry);
```

**Cache Metrics**:
```java
Gauge.builder("cache.size", cache, Cache::estimatedSize)
    .register(registry);

FunctionCounter.builder("cache.hits", cache, c -> c.stats().hitCount())
    .register(registry);

FunctionCounter.builder("cache.misses", cache, c -> c.stats().missCount())
    .register(registry);
```

**Queue Metrics**:
```java
Gauge.builder("queue.size", queue, Queue::size)
    .register(registry);

Counter.builder("queue.messages.processed")
    .register(registry);

Timer.builder("queue.message.processing.duration")
    .register(registry);
```

---
## References

- [Micrometer Concepts](https://docs.micrometer.io/micrometer/reference/concepts.html)
- [Micrometer Meter Types](https://docs.micrometer.io/micrometer/reference/concepts/meters.html)



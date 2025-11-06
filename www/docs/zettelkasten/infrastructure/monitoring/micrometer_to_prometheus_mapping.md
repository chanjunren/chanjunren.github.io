🗓️ 06112025 0031
📎 #micrometer #prometheus #observability

# micrometer_to_prometheus_mapping

**Core Concept**: Micrometer metrics transform into Prometheus time series with specific naming conventions, label mappings, and multiple related metrics per instrument.

## Why It Matters

Understanding the mapping helps you write correct PromQL queries and debug why metrics appear (or don't appear) in Prometheus. One Micrometer metric often becomes multiple Prometheus time series.

## Naming Convention

Micrometer uses dot notation, Prometheus uses underscores:

```
Micrometer: http.request.duration
Prometheus: http_request_duration_seconds
```

**Rules**:
- `.` → `_`
- CamelCase → `snake_case`
- Base unit appended automatically (`_seconds`, `_bytes`)

## Counter Mapping

**Micrometer**:
```java
Counter.builder("http.requests")
    .tag("method", "GET")
    .tag("status", "200")
    .register(registry);
```

**Prometheus Export**:
```
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200"} 1543.0
```

**Key Changes**:
- Suffix `_total` added automatically
- Tags → Labels `{key="value"}`
- Single time series per Counter

**Query**:
```promql
rate(http_requests_total{method="GET"}[5m])
```

## Timer Mapping

**Micrometer**:
```java
Timer.builder("http.request.duration")
    .tag("endpoint", "/api/users")
    .publishPercentiles(0.95, 0.99)
    .register(registry);
```

**Prometheus Export** (Histogram mode):
```
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{endpoint="/api/users",le="0.001"} 0
http_request_duration_seconds_bucket{endpoint="/api/users",le="0.01"} 45
http_request_duration_seconds_bucket{endpoint="/api/users",le="0.1"} 234
http_request_duration_seconds_bucket{endpoint="/api/users",le="1.0"} 456
http_request_duration_seconds_bucket{endpoint="/api/users",le="+Inf"} 500
http_request_duration_seconds_sum{endpoint="/api/users"} 123.45
http_request_duration_seconds_count{endpoint="/api/users"} 500
http_request_duration_seconds_max{endpoint="/api/users"} 2.3
```

**Key Changes**:
- One Timer → **4 metric types**:
  - `_bucket{le="x"}` - histogram buckets (cumulative)
  - `_sum` - total duration
  - `_count` - total events
  - `_max` - maximum observed value (resets periodically)
- Base unit converted to seconds
- Labels duplicated across all series

**Queries**:
```promql
# Average duration
rate(http_request_duration_seconds_sum[5m]) / 
rate(http_request_duration_seconds_count[5m])

# 95th percentile
histogram_quantile(0.95, 
  rate(http_request_duration_seconds_bucket[5m])
)

# Request rate
rate(http_request_duration_seconds_count[5m])
```

## Gauge Mapping

**Micrometer**:
```java
Gauge.builder("jvm.memory.used", memoryBean, MemoryMXBean::getHeapMemoryUsage)
    .tag("area", "heap")
    .baseUnit("bytes")
    .register(registry);
```

**Prometheus Export**:
```
# TYPE jvm_memory_used_bytes gauge
jvm_memory_used_bytes{area="heap"} 536870912.0
```

**Key Changes**:
- Base unit suffix added (`_bytes`)
- Single time series
- Value polled on each scrape

**Query**:
```promql
jvm_memory_used_bytes{area="heap"}
avg_over_time(jvm_memory_used_bytes[5m])
```

## DistributionSummary Mapping

**Micrometer**:
```java
DistributionSummary.builder("request.payload.size")
    .tag("endpoint", "/api/upload")
    .baseUnit("bytes")
    .register(registry);
```

**Prometheus Export** (same structure as Timer):
```
# TYPE request_payload_size_bytes histogram
request_payload_size_bytes_bucket{endpoint="/api/upload",le="1024.0"} 23
request_payload_size_bytes_bucket{endpoint="/api/upload",le="4096.0"} 67
request_payload_size_bytes_bucket{endpoint="/api/upload",le="+Inf"} 100
request_payload_size_bytes_sum{endpoint="/api/upload"} 234567.0
request_payload_size_bytes_count{endpoint="/api/upload"} 100
request_payload_size_bytes_max{endpoint="/api/upload"} 8192.0
```

**Identical to Timer** except no time unit conversion.

## LongTaskTimer Mapping

**Micrometer**:
```java
LongTaskTimer.builder("batch.job.duration")
    .tag("job", "export")
    .register(registry);
```

**Prometheus Export**:
```
# TYPE batch_job_duration_seconds_active_count gauge
batch_job_duration_seconds_active_count{job="export"} 2.0

# TYPE batch_job_duration_seconds_duration_sum gauge
batch_job_duration_seconds_duration_sum{job="export"} 45.3

# TYPE batch_job_duration_seconds_max gauge
batch_job_duration_seconds_max{job="export"} 30.1
```

**Key Changes**:
- One LongTaskTimer → **3 gauge metrics**:
  - `_active_count` - currently running tasks
  - `_duration_sum` - total duration of active tasks
  - `_max` - longest running task
- All are gauges (not histograms)

**Queries**:
```promql
# Currently running jobs
batch_job_duration_seconds_active_count{job="export"}

# Average duration of active tasks
batch_job_duration_seconds_duration_sum / 
batch_job_duration_seconds_active_count

# Alert on stuck jobs
batch_job_duration_seconds_max > 3600
```

## Tag/Label Mapping

**Micrometer Tags** → **Prometheus Labels**

```java
// Micrometer
Counter.builder("requests")
    .tag("method", "GET")      // → {method="GET"}
    .tag("endpoint", "/users") // → {endpoint="/users"}
    .tag("status", "200")      // → {status="200"}
    .register(registry);
```

**Prometheus**:
```
requests_total{method="GET",endpoint="/users",status="200"} 42
```

**Rules**:
- Tag keys/values must be strings
- Empty values become `""`
- High cardinality tags (user IDs, UUIDs) cause storage explosion

```ad-danger
Avoid high-cardinality labels like user IDs or request IDs. Each unique label combination creates a new time series.
```

## Base Unit Suffixes

Micrometer automatically adds unit suffixes:

| Base Unit | Prometheus Suffix |
|-----------|-------------------|
| `seconds` | `_seconds` |
| `milliseconds` | `_seconds` (converted) |
| `nanoseconds` | `_seconds` (converted) |
| `bytes` | `_bytes` |
| `kilobytes` | `_bytes` (converted) |
| `megabytes` | `_bytes` (converted) |
| (none) | (no suffix) |

**Example**:
```java
// Micrometer: baseUnit("milliseconds")
Timer.builder("response.time")
    .baseUnit("milliseconds")
    
// Prometheus: converted to seconds
response_time_seconds 0.123
```

## Percentile Configuration

**Client-side percentiles** (Summary mode):
```java
Timer.builder("http.duration")
    .publishPercentiles(0.5, 0.95, 0.99)
    .register(registry);
```

**Prometheus Export**:
```
http_duration_seconds{quantile="0.5"} 0.023
http_duration_seconds{quantile="0.95"} 0.145
http_duration_seconds{quantile="0.99"} 0.312
http_duration_seconds_sum 123.45
http_duration_seconds_count 500
```

**Trade-off**: Pre-calculated but cannot aggregate across instances.

**Server-side percentiles** (Histogram mode - default):
```java
Timer.builder("http.duration")
    .serviceLevelObjectives(
        Duration.ofMillis(10),
        Duration.ofMillis(50),
        Duration.ofMillis(100),
        Duration.ofMillis(500)
    )
    .register(registry);
```

**Prometheus Export**:
```
http_duration_seconds_bucket{le="0.01"} 12
http_duration_seconds_bucket{le="0.05"} 45
http_duration_seconds_bucket{le="0.1"} 234
http_duration_seconds_bucket{le="0.5"} 456
http_duration_seconds_bucket{le="+Inf"} 500
```

**Query with** `histogram_quantile()` for flexible percentiles.

## Common Naming Patterns

| Micrometer | Prometheus | Type |
|------------|------------|------|
| `http.requests` | `http_requests_total` | Counter |
| `http.request.duration` | `http_request_duration_seconds_*` | Timer → Histogram |
| `jvm.memory.used` | `jvm_memory_used_bytes` | Gauge |
| `cache.size` | `cache_size` | Gauge |
| `request.size` | `request_size_bytes_*` | DistributionSummary → Histogram |
| `batch.job.duration` | `batch_job_duration_seconds_active_count` etc. | LongTaskTimer → 3 Gauges |

## Cardinality Impact

**Each unique label combination = new time series**

```java
// BAD: High cardinality
Timer.builder("api.duration")
    .tag("userId", userId)        // 1M users
    .tag("requestId", requestId)  // Infinite
    // → Millions of time series → OOM
```

```java
// GOOD: Low cardinality
Timer.builder("api.duration")
    .tag("endpoint", "/api/users")  // ~100 endpoints
    .tag("method", "GET")           // 4-5 methods
    .tag("status", "200")           // ~10 status codes
    // → ~5000 time series → Manageable
```

## Quick Reference

```java
// Counter: metric_total
Counter → metric_name_total{labels}

// Timer: 4 metrics
Timer → metric_name_seconds_bucket{labels,le}
        metric_name_seconds_sum{labels}
        metric_name_seconds_count{labels}
        metric_name_seconds_max{labels}

// Gauge: single metric
Gauge → metric_name_unit{labels}

// DistributionSummary: same as Timer
DistributionSummary → metric_name_unit_bucket{labels,le}
                      metric_name_unit_sum{labels}
                      metric_name_unit_count{labels}
                      metric_name_unit_max{labels}

// LongTaskTimer: 3 gauges
LongTaskTimer → metric_name_seconds_active_count{labels}
                metric_name_seconds_duration_sum{labels}
                metric_name_seconds_max{labels}
```

---
## References

- [Micrometer Prometheus Documentation](https://docs.micrometer.io/micrometer/reference/implementations/prometheus.html)
- [Prometheus Naming Best Practices](https://prometheus.io/docs/practices/naming/)
- [[micrometer_metric_types]] - choosing the right Micrometer type
- [[prometheus_data_types]] - resulting Prometheus metric types
- [[prometheus_histograms]] - understanding bucket exports


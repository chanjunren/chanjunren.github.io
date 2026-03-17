🗓️ 31102024 1524

# prometheus_data_types

**Core Concept**: Prometheus has four metric types (Counter, Gauge, Histogram, Summary) - each suited for different measurement patterns and queried with specific functions.

## Why It Matters

Choosing the wrong metric type leads to incorrect queries and misleading visualizations. Understanding [[prometheus_time_series_basics]] helps you see how these types are stored as time series.

## Counters

**What**: Cumulative count that only increases (resets to 0 on restart)

**When to Use**: Count events - requests, errors, bytes sent, tasks completed

**Go Example**:
```go
totalRequests.Inc()
```

**Exposition**:
```
http_requests_total{status="200"} 1543
http_requests_total{status="500"} 12
```

**Query with**: `rate()`, `increase()`, `irate()` - see [[prometheus_range_function_calculations]] for formulas

```ad-warning
Never use raw counter values in alerts/dashboards - always use `rate()` or `increase()` because counters reset on restart.
```

## Gauges

**What**: Current measurement that can go up or down

**When to Use**: Measure current state - memory usage, queue length, temperature, active connections

**Go Example**:
```go
queueLength.Set(42)     // Set absolute value
queueLength.Inc()       // Increment by 1
queueLength.Dec()       // Decrement by 1
queueLength.Add(23)     // Add amount
queueLength.Sub(10)     // Subtract amount
```

**Exposition**:
```
queue_length 42
memory_usage_bytes 1073741824
```

**Query with**: `avg_over_time()`, `max_over_time()`, `delta()`, `deriv()` - see [[prometheus_range_function_calculations]]

**Common Pattern**:
```promql
# How long ago did something happen?
time() - process_start_time_seconds
```

## Summaries

**What**: Pre-calculated percentiles computed client-side using streaming quantile estimation

**When to Use**: Single instance metrics where you know required percentiles upfront

**Go Example**:
```go
requestDurations := prometheus.NewSummary(prometheus.SummaryOpts{
	Name: "http_request_duration_seconds",
	Help: "A summary of HTTP Request durations in seconds",
	Objectives: map[float64]float64{
		0.5: 0.05,   // p50 with ±0.05 error
		0.9: 0.01,   // p90 with ±0.01 error
		0.99: 0.001, // p99 with ±0.001 error
	}
})

requestDurations.Observe(2.3)
```

**Exposition**:
```
http_request_duration_seconds{quantile="0.5"} 0.052
http_request_duration_seconds{quantile="0.90"} 0.0564
http_request_duration_seconds{quantile="0.99"} 2.372
http_request_duration_seconds_sum 88364.234
http_request_duration_seconds_count 227420
```

**Trade-offs**:
- ✅ Accurate quantiles pre-calculated
- ✅ Low query cost (values already computed)
- ❌ Cannot aggregate across instances (each calculates independently)
- ❌ Cannot change quantiles after deployment

### Streaming Quantile Estimation (CKMS)

Summaries use **continuous updating** of quantile estimates as new data arrives:

- **Rolling buffer**: A portion of history is kept in a buffer, so older data contributes gradually to quantile estimations
- **Continuous updates**: As new observations arrive, the buffer is updated incrementally, adjusting estimated quantiles in near-real-time
- **Efficiency**: Streaming algorithms minimize reprocessing — beneficial during peak loads

Prometheus uses the **CKMS (Continuous Kernel Memory Sampling)** algorithm to manage the buffer, keeping tight control on errors around targeted quantiles while relaxing constraints for other parts of the distribution.

## Histograms

**What**: Samples observations into buckets — useful for tracking latency, durations, sizes

**When to Use**: Latency distributions, request durations, payload sizes — when you need percentiles that can aggregate across instances

Records three things:
- `_count`: total number of observations
- `_sum`: total of all observed values
- `_bucket{le="X"}`: number of observations ≤ X (cumulative)

**Go Example**:
```go
requestDurations := prometheus.NewHistogram(prometheus.HistogramOpts{
	Name: "http_request_duration_seconds",
	Help: "A histogram of the HTTP request duration in seconds",
	Buckets: []float64{0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10},
})

requestDurations.Observe(2.3)
```

**Java Example**:
```java
static final Histogram requestLatency = Histogram.build()
      .name("myapp_request_duration_seconds")
      .help("Request duration in seconds.")
      .buckets(0.1, 0.3, 0.5, 1, 2, 5)
      .register();
```

**Exposition**:
```
http_request_duration_seconds_bucket{le="0.05"} 4599
http_request_duration_seconds_bucket{le="0.1"} 24128
http_request_duration_seconds_bucket{le="0.25"} 45311
http_request_duration_seconds_bucket{le="0.5"} 59983
http_request_duration_seconds_bucket{le="1"} 60345
http_request_duration_seconds_bucket{le="2.5"} 114003
http_request_duration_seconds_bucket{le="5"} 201325
http_request_duration_seconds_bucket{le="+Inf"} 227420
http_request_duration_seconds_sum 88364.234
http_request_duration_seconds_count 227420
```

```ad-tip
Only the upper bound needs to be defined for cumulative histograms. Bucket count is cumulative up to the `le` boundary. The `+Inf` bucket always equals `_count`.
```

```ad-warning
COST vs Resolution — More buckets = better resolution but higher cardinality. Too many buckets can overwhelm TSDB.
```

**Query with**: `histogram_quantile()`, `rate()` — always use `rate()` with `_bucket`, `_count`, `_sum`

```promql
# Percentile approximation (p90)
histogram_quantile(0.9, rate(http_request_duration_seconds_bucket[5m]))

# Aggregated across labels — keep `le` in the by() clause
histogram_quantile(0.9,
  sum by(path, method, le) (
    rate(http_request_duration_seconds_bucket[5m])
  )
)

# Average duration
rate(http_request_duration_seconds_sum[5m]) /
rate(http_request_duration_seconds_count[5m])

# Request rate
rate(http_request_duration_seconds_count[1m])
```

**Trade-offs**:
- ✅ Aggregatable across instances (unlike Summary)
- ✅ Flexible — can compute any percentile at query time
- ❌ Approximate percentiles only (bucket-based interpolation)
- ❌ Higher cardinality (one series per bucket)

### Histogram vs Summary

| | Histogram | Summary |
|---|---|---|
| Percentile calculation | Server-side (PromQL) | Client-side (pre-computed) |
| Aggregation across instances | ✅ Yes | ❌ No |
| Change quantiles at query time | ✅ Yes | ❌ No (fixed at code) |
| Accuracy | Approximate (depends on buckets) | Exact for configured quantiles |
| Cost | Higher cardinality | Lower cardinality |

**Prefer histograms** in most cases. Use summaries only for single-instance apps where exact quantiles matter.

---

## References
- https://www.youtube.com/watch?v=STVMGrYIlfg&list=PLyBW7UHmEXgylLwxdVbrBQJ-fJ_jMvh8h
- https://www.youtube.com/watch?v=fhx0ehppMGM&list=PLyBW7UHmEXgylLwxdVbrBQJ-fJ_jMvh8h&index=4
- https://prometheus.io/docs/practices/histograms/

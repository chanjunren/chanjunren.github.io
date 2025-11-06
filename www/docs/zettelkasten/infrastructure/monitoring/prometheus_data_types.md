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

**What**: Pre-calculated percentiles computed client-side using [[prometheus_summary_streaming]]

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

## Histograms
- Tracking distribution of numeric values
- Counts input values into a set of ranged buckets
- **Cumulative** by default
<img src="data:image/png;base64,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"/>

```ad-tip
Only the upper bound needs to be defined for cumulative histograms 
```

```go
requestDurations := prometheus.NewHistogram(prometheus.HistogramOpts{
	Name: "http_request_duration_seconds",
	Help: "A histogram of the HTTP request duration in seconds",
	Buckets: []float64{0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10}
})
```
> Constructing Histograms

```go
requestDurations.Observe(2.3)
```

```
http_request_duration_seconds_bucket{le="0.05"} 4599
http_request_duration_seconds_bucket{le="0.1"} 24128
http_request_duration_seconds_bucket{le="0.25"} 45311
http_request_duration_seconds_bucket{le="0.5"} 59983
http_request_duration_seconds_bucket{le="1"} 60345
http_request_duration_seconds_bucket{le="2.5"} 114003
http_request_duration_seconds_bucket{le="5"} 201325
http_request_duration_seconds_bucket{le="+Inf"} 227420
http_requests_duration_seconds_sum 88364.234
http_requests_duration_seconds_count 227420
```
> Exposition

```ad-warning
COST vs Resolution

More buckets > Better resolution

Too many buckets > TSDB X_X
```
> Read more at https://prometheus.io/docs/practices/histograms/


### Histogram Quantile
For calculating approximate percentiles from a histogram
```promql
# IMPORTANT to scope the bucket (5m)
histogram_quantile(
	0.9,
	rate(http_request_duration_seconds_bucket[5m])
)

# Aggregated histogram quantiles (TBH don't really understand this)
histogram_quantile(
	0.9,
	sum by(path, method, le) (
		rate(http_request_duration_seconds_bucket[5m])
	)
)
```


---

## References
- https://www.youtube.com/watch?v=fhx0ehppMGM&list=PLyBW7UHmEXgylLwxdVbrBQJ-fJ_jMvh8h&index=4

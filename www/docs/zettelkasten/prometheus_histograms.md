🗓️ 28072025 1359
📎

# prometheus_histograms
A histogram in Prometheus **samples observations into buckets** — useful for tracking **latency, durations, sizes**.

Records:
- count: total # of observations
- sum: total of all values
- bucket: # of observations ≤ a certain value

## 📐 Data Format
Each metric is split into:
```
<metric_name>_bucket{le="0.1"}  → count ≤ 0.1 <metric_name>_bucket{le="0.5"}  → count ≤ 0.5 <metric_name>_bucket{le="+Inf"} → total count <metric_name>_sum              → total sum <metric_name>_count            → total number of events
```

You get a **distribution** across buckets.

## 🧮 Common PromQL Queries

1. Rate of requests per second:
`rate(http_request_duration_seconds_count[1m])`

2. Average duration:
`rate(http_request_duration_seconds_sum[1m]) / rate(http_request_duration_seconds_count[1m])`

3. Percentile approximation (via histogram_quantile):
`histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))`

> Note: This is an approximation!

## Java
```java
static final Histogram requestLatency = Histogram.build()
      .name("myapp_request_duration_seconds")
      .help("Request duration in seconds.")
      .buckets(0.1, 0.3, 0.5, 1, 2, 5) // custom buckets
      .register();
```

## 🧠 Tips
- Always use `rate()` or `irate()` with counters like `_bucket`, `_count`, `_sum`
- Bucket count is **cumulative** up to the `le` boundary
- Use `+Inf` bucket for total event count
- Higher granularity buckets = more precision = more cardinality

---
# References

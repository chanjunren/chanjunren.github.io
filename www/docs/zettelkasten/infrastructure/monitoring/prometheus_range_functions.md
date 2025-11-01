🗓️ 27102025 0000

# prometheus_range_functions

**Core Concept**: Aggregate time series data over time windows to compute rates, averages, and statistics.

## Rate & Counter Functions

| Function     | What It Does                 | When To Use                               |
|--------------|------------------------------|-------------------------------------------|
| `rate()`     | Per-second average rate      | **DEFAULT** - counters (requests, errors) |
| `irate()`    | Instant rate (last 2 points) | Spike detection (use sparingly)           |
| `increase()` | Total increase in range      | "How many X in last Y?"                   |

```ad-tip
`rate()` vs `irate()`: Use `rate()` for most cases. Only use `irate()` for catching spikes < 1 minute.
```

## Aggregation Functions

| Function                              | What It Does     | When To Use             |
|---------------------------------------|------------------|-------------------------|
| `avg_over_time()`                     | Average          | Smooth noisy gauges     |
| `min_over_time()` / `max_over_time()` | Min/Max          | Find peaks/troughs      |
| `sum_over_time()`                     | Sum              | Total accumulated value |
| `count_over_time()`                   | Data point count | Detect gaps             |

## Statistical Functions

| Function                   | What It Does                | When To Use        |
|----------------------------|-----------------------------|--------------------|
| `quantile_over_time(φ, v)` | Percentiles (p50, p95, p99) | Latency analysis   |
| `stddev_over_time()`       | Standard deviation          | Detect instability |

## Change Detection

| Function    | What It Does        | When To Use                     |
|-------------|---------------------|---------------------------------|
| `delta()`   | First - last value  | Gauge changes (can be negative) |
| `changes()` | Times value changed | Flapping detection              |
| `resets()`  | Counter resets      | Service restart detection       |

## Prediction Functions

| Function               | What It Does                | When To Use             |
|------------------------|-----------------------------|-------------------------|
| `deriv()`              | Per-second derivative       | Trend analysis (gauges) |
| `predict_linear(v, t)` | Future value in `t` seconds | Capacity planning       |

## Time Ranges

| Range   | When                       |
|---------|----------------------------|
| `[5m]`  | **Default** - good balance |
| `[1m]`  | Real-time alerts           |
| `[1h]`  | Dashboards                 |
| `[24h]` | Daily patterns             |

```ad-warning
Range must be > scrape interval (if scrape = 30s, use ≥ 1-2m)
```

## Common Patterns

**Rate vs Increase**
- `rate(metric[5m]) * 300` = `increase(metric[5m])`
- Use `rate()` for per-second rates, `increase()` for total counts

**Smoothing vs Responsiveness**
- Longer ranges = smoother but slower to react
- `rate(metric[10m])` - smooth, slow
- `irate(metric[1m])` - responsive, noisy

**Percentiles**
- Histogram: `histogram_quantile(0.95, rate(http_duration_bucket[5m]))` - accurate
- Gauge: `quantile_over_time(0.95, http_duration_seconds[5m])` - approximate

## Key Rules

- `rate()` for counters, `deriv()`/`delta()` for gauges
- `rate()` handles counter resets, `delta()` doesn't
- Range must be > scrape interval

---
## References

- [Prometheus Query Functions Documentation](https://prometheus.io/docs/prometheus/latest/querying/functions/)
- [Robust Perception: Rate vs irate](https://www.robustperception.io/rate-then-sum-never-sum-then-rate)
- [Prometheus Best Practices](https://prometheus.io/docs/practices/naming/)


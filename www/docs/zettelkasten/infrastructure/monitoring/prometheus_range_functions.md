🗓️ 27102025 0000

# prometheus_range_functions

**Core Concept**: Quick reference for range functions - see [[prometheus_range_function_calculations]] for detailed formulas and examples.

## When to Use

Range functions transform arrays of samples from range selectors `[5m]` into single values. Understanding [[prometheus_time_series_basics]] and [[prometheus_range_function_calculations]] is essential for knowing what these actually calculate.

## Rate & Counter Functions

| Function     | What It Does                 | When To Use                               |
|--------------|------------------------------|-------------------------------------------|
| `rate()`     | Per-second average rate      | **DEFAULT** - counters (requests, errors) |
| `irate()`    | Instant rate (last 2 points) | Spike detection (use sparingly)           |
| `increase()` | Total increase in range      | "How many X in last Y?"                   |

```ad-tip
Use `rate()` for most cases. Only use `irate()` for catching spikes < 1 minute.
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
Range must be ≥ 2x scrape interval (if scrape = 30s, use ≥ 1m)
```

## Key Rules

- `rate()` for counters, `deriv()`/`delta()` for gauges
- `rate()` handles counter resets, `delta()` doesn't
- Range must be ≥ 2x scrape interval
- Use [[prometheus_data_types]] to understand which functions work with which metric types

---
## References

- [Prometheus Query Functions](https://prometheus.io/docs/prometheus/latest/querying/functions/)
- [Robust Perception: Rate vs irate](https://www.robustperception.io/rate-then-sum-never-sum-then-rate)
- [[prometheus_range_function_calculations]] - detailed formulas and examples
- [[prometheus_time_series_basics]] - understanding the input data


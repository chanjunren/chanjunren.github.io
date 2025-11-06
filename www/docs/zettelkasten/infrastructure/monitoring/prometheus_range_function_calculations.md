🗓️ 06112025 0001

# prometheus_range_function_calculations

**Core Concept**: Range functions transform arrays of (timestamp, value) samples into single output values using specific mathematical formulas.

## Why It Matters

Knowing the actual calculations helps you understand what visualizations represent, why graphs look smooth or spiky, and which function to use for your metric type.

## Prerequisites

This builds on [[prometheus_time_series_basics]] - you need to understand that range selectors like `[5m]` return arrays of samples.

## How Range Functions Work

**Input**: Array of samples from range selector
**Output**: Single calculated value

```
metric[5m]  →  [(t1, v1), (t2, v2), ..., (tn, vn)]  →  function()  →  single value
```

## Rate Functions (for Counters)

### rate()

**Formula**: `(last_value - first_value) / time_range_seconds`

**Example**:
```
http_requests_total[1m] returns:
  (t=0s,   v=100)
  (t=15s,  v=115)
  (t=30s,  v=132)
  (t=45s,  v=148)
  (t=60s,  v=165)

rate() calculates:
  (165 - 100) / 60 = 65/60 = 1.08 requests/second
```

**Why per-second**: Makes rates comparable across different time windows.

**Counter reset handling**: If counter drops (app restart), treats it as reset:
```
Samples: (t=0s, 100), (t=15s, 115), (t=30s, 10), (t=45s, 25)
                                            ↑ reset detected
Calculation: (115-100) + (25-0) = 40 increase over 45s = 0.89/s
```

### irate()

**Formula**: `(last_value - second_to_last_value) / time_between_them`

**Example**:
```
http_requests_total[1m] returns:
  (t=0s,   v=100)
  (t=15s,  v=115)
  (t=30s,  v=132)
  (t=45s,  v=148)
  (t=60s,  v=165)

irate() only uses last 2 points:
  (165 - 148) / 15 = 17/15 = 1.13 requests/second
```

**Why it's spiky**: Only looks at last 2 points, so sensitive to momentary changes.

### increase()

**Formula**: `rate() * time_range_seconds`

**Example**:
```
http_requests_total[5m] returns samples from 100 to 400

increase() = (400 - 100) = 300 total requests in 5 minutes

Equivalent to: rate(metric[5m]) * 300
```

## Aggregation Functions (for Gauges)

### avg_over_time()

**Formula**: `sum(all_values) / count(samples)`

**Example**:
```
memory_usage_bytes[5m] returns:
  (t=0m,  v=1000)
  (t=1m,  v=1200)
  (t=2m,  v=1100)
  (t=3m,  v=1300)
  (t=4m,  v=1400)
  (t=5m,  v=1000)

avg_over_time() = (1000+1200+1100+1300+1400+1000) / 6 = 1166.67 bytes
```

### min_over_time() / max_over_time()

**Formula**: `min(all_values)` or `max(all_values)`

**Example**:
```
cpu_usage[10m] returns: [20, 45, 60, 55, 40, 30, 25]

min_over_time() = 20
max_over_time() = 60
```

### sum_over_time()

**Formula**: `sum(all_values)`

**Example**:
```
errors[1h] returns: [5, 3, 0, 8, 2, 1]

sum_over_time() = 5+3+0+8+2+1 = 19 total errors
```

## Statistical Functions

### quantile_over_time()

**Formula**: Sorts values, returns value at φ percentile position

**Example**:
```
latency_seconds[5m] returns: [0.1, 0.15, 0.2, 0.25, 0.3, 0.5, 0.8, 1.0, 1.2, 2.0]
Sorted: [0.1, 0.15, 0.2, 0.25, 0.3, 0.5, 0.8, 1.0, 1.2, 2.0]

quantile_over_time(0.95, latency[5m]):
  Position = 0.95 * 10 = 9.5 → interpolate between 9th and 10th values
  Result ≈ 1.6 seconds (95% of requests faster than this)
```

```ad-warning
This is **approximate** - only as accurate as your sample count. For accurate percentiles, use histograms with `histogram_quantile()`.
```

### stddev_over_time()

**Formula**: Standard deviation of all values

**Example**:
```
response_time[5m] returns: [100, 102, 98, 105, 95, 200, 101, 99]

avg = 112.5
stddev = sqrt(sum((value - avg)²) / count) = 33.7

High stddev = unstable/inconsistent performance
```

## Change Detection Functions

### delta()

**Formula**: `last_value - first_value` (can be negative)

**Example**:
```
temperature[10m] returns:
  (t=0m,  v=20°C)
  (t=5m,  v=25°C)
  (t=10m, v=22°C)

delta() = 22 - 20 = +2°C (net change over 10 minutes)
```

**Use for gauges only** - doesn't handle counter resets.

### changes()

**Formula**: Count how many times value changed

**Example**:
```
state[5m] returns: [1, 1, 2, 2, 1, 1, 3, 3, 3]

changes() = 3 (changed at positions: 1→2, 2→1, 1→3)
```

### resets()

**Formula**: Count how many times counter decreased

**Example**:
```
requests_total[10m] returns: [100, 150, 200, 50, 100, 150]
                                          ↑ reset

resets() = 1
```

## Prediction Functions

### deriv()

**Formula**: Linear regression slope (per-second rate of change)

**Example**:
```
disk_usage[1h] returns points showing steady growth:
  (t=0m,  v=1000GB)
  (t=30m, v=1050GB)
  (t=60m, v=1100GB)

deriv() = 1.67 GB/minute growth rate
```

### predict_linear()

**Formula**: Extrapolate current trend into future

**Example**:
```
disk_usage[1h] growing at 1.67 GB/min

predict_linear(disk_usage[1h], 3600):
  Current: 1100GB
  Predicted in 1 hour: 1100 + (1.67 * 60) = 1200GB
```

## Visualization Impact

**Why graphs look different**:

```
rate(metric[1m])   → responsive, noisy (small window)
rate(metric[10m])  → smooth, slow to react (large window)
irate(metric[1m])  → very spiky (only 2 points)
```

**Scrape interval matters**:
```
Scrape every 15s, query rate(metric[30s]):
  Only 2-3 data points in window → less accurate
  
Scrape every 15s, query rate(metric[5m]):
  20 data points in window → more accurate
```

## When to Use

| Function | Metric Type | Use Case |
|----------|-------------|----------|
| `rate()` | Counter | **Default** - requests/sec, errors/sec |
| `irate()` | Counter | Spike detection (use sparingly) |
| `increase()` | Counter | Total count in window |
| `avg_over_time()` | Gauge | Smooth noisy metrics |
| `max_over_time()` | Gauge | Peak detection |
| `quantile_over_time()` | Gauge | Quick percentiles (less accurate) |
| `delta()` | Gauge | Net change (can be negative) |
| `deriv()` | Gauge | Growth rate trend |

## Trade-offs

**Range window size**:
- Small `[1m]` = responsive, noisy, fewer samples
- Large `[1h]` = smooth, slow to react, more samples

**rate() vs irate()**:
- `rate()` averages over all samples → stable, recommended
- `irate()` uses only last 2 samples → catches sub-minute spikes, but noisy

**Must be ≥ 2x scrape interval**:
```
Scrape interval = 30s
Minimum range = [1m] (ensures at least 2 samples)
```

## Quick Reference

```promql
# Counter functions (handle resets)
rate(metric[5m])              # per-second average rate
irate(metric[1m])             # instant rate (last 2 points)
increase(metric[5m])          # total increase

# Gauge aggregations
avg_over_time(metric[5m])     # average
min_over_time(metric[5m])     # minimum
max_over_time(metric[5m])     # maximum
sum_over_time(metric[5m])     # sum

# Statistics
quantile_over_time(0.95, metric[5m])  # 95th percentile
stddev_over_time(metric[5m])          # standard deviation

# Change detection
delta(metric[5m])             # first - last (gauges)
changes(metric[5m])           # times value changed
resets(metric[5m])            # counter resets

# Prediction
deriv(metric[1h])             # per-second derivative
predict_linear(metric[1h], 3600)  # predict 1h ahead
```

---
## References

- [Prometheus Query Functions](https://prometheus.io/docs/prometheus/latest/querying/functions/)
- [Robust Perception: rate() vs irate()](https://www.robustperception.io/rate-then-sum-never-sum-then-rate)


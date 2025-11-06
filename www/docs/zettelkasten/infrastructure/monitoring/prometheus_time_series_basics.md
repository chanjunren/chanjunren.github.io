🗓️ 06112025 0000

# prometheus_time_series_basics

**Core Concept**: Time series are sequences of (timestamp, value) pairs identified by metric name + labels, collected at regular scrape intervals.

## Why It Matters

Understanding the raw data structure is essential for reasoning about what range functions actually calculate and why visualizations look the way they do.

## What Is a Time Series

A **time series** is a sequence of samples (data points) for a single metric with a unique label set:

```
http_requests_total{method="GET", status="200"}
  (1699000000, 100)  ← timestamp, value
  (1699000015, 115)
  (1699000030, 132)
  (1699000045, 150)
```

**Series identifier** = metric name + labels:
- Metric name: `http_requests_total`
- Labels: `{method="GET", status="200"}`

Each unique label combination creates a **separate time series**.

## How Prometheus Collects Data

### Scrape Intervals

Prometheus **pulls** metrics from your application at regular intervals (default 15s):

```
App exposes:     Prometheus scrapes:     TSDB stores:
/metrics         every 15s               (timestamp, value)
  ↓                  ↓                         ↓
counter=100    →  scrape at t=0     →   (t0, 100)
counter=115    →  scrape at t=15    →   (t15, 115)
counter=132    →  scrape at t=30    →   (t30, 132)
```

**Key insight**: Between scrapes, Prometheus has no data. It only knows values at scrape times.

## Instant vs Range Selectors

### Instant Vector Selector

Returns the **most recent sample** for each matching time series:

```promql
http_requests_total{status="200"}
```

Returns: `(latest_timestamp, latest_value)` for each series

**Lookback delta** (default 5m): If no sample exists within 5 minutes of query time, series is considered stale.

### Range Vector Selector

Returns **all samples** within a time window:

```promql
http_requests_total{status="200"}[5m]
```

Returns array of samples from last 5 minutes:
```
[
  (t-300s, 100),
  (t-285s, 115),
  (t-270s, 132),
  ...
  (t, 200)
]
```

**This is what range functions operate on** - they receive this array and calculate a single output value.

## Label Matching

Filter time series using label matchers:

| Matcher | Syntax | Example |
|---------|--------|---------|
| Equality | `label="value"` | `status="200"` |
| Inequality | `label!="value"` | `status!="500"` |
| Regex match | `label=~"regex"` | `method=~"GET\|POST"` |
| Regex negative | `label!~"regex"` | `path!~"/health.*"` |

Multiple matchers (AND logic):
```promql
http_requests_total{status="200", method="GET", path!~"/health.*"}
```

## Staleness Handling

Prometheus marks series as **stale** when:
- Series disappears between scrapes
- Target scrape fails
- Target disappears completely

Stale series are excluded from instant vector queries after lookback delta expires.

## When to Use

- **Instant selectors** → current state, alerts, single value displays
- **Range selectors** → rate calculations, aggregations over time, trends

## Trade-offs

**Scrape interval**:
- Shorter (5s) = more data points, higher resolution, more storage
- Longer (60s) = fewer points, less resolution, less storage

**Lookback delta**:
- Longer = more tolerant of missed scrapes, slower staleness detection
- Shorter = faster staleness detection, less tolerant of gaps

## Quick Reference

```promql
# Instant vector - latest value
metric_name{label="value"}

# Range vector - last 5 minutes of samples
metric_name{label="value"}[5m]

# Label matchers
{status="200"}              # exact match
{status!="500"}             # not equal
{method=~"GET|POST"}        # regex match
{path!~"/health.*"}         # regex negative match

# Time units
s - seconds
m - minutes
h - hours
d - days
w - weeks
y - years
```

---
## References

- [Prometheus Data Model](https://prometheus.io/docs/concepts/data_model/)
- [Querying Basics](https://prometheus.io/docs/prometheus/latest/querying/basics/)


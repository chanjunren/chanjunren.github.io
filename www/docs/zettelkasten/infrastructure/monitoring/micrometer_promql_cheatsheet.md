🗓️ 16032026 2200

# micrometer_promql_cheatsheet

Practical cheatsheet mapping Micrometer Counter/Timer usage (via `OpStats` or direct API) to the PromQL queries you write in Grafana. For theory, see [[micrometer_metric_types]] and [[micrometer_to_prometheus_mapping]].

## Naming Translation

```
Micrometer metric name    →  Prometheus metric name
─────────────────────────────────────────────────────
my.business.event         →  my_business_event_total        (counter)
my.operation.duration     →  my_operation_duration_seconds_* (timer)
```

Dots become underscores. Counters get `_total`. Timers get `_seconds` + sub-metrics (`_count`, `_sum`, `_bucket`, `_max`).

Tags become labels: `Tag.of("subjectId", "123")` → `{subjectId="123"}`.

---

## Counter (`OpStats.count`)

### Java

```java
// Instance method — auto-includes subjectId tag
opStats.count("order.created", Tag.of("type", "limit"));

// Static method — full control over tags
OpStats.count("order.created", 1.0, Tags.of("subjectId", "123", "type", "limit"));
```

### Prometheus produces

```
order_created_total{subjectId="123", type="limit"} 42
```

### PromQL Queries

| Goal | Query | What it tells you |
|------|-------|-------------------|
| Rate (events/sec) | `rate(order_created_total[5m])` | How fast events are happening right now |
| Total count in window | `increase(order_created_total[1h])` | How many events happened in the last hour |
| Rate by tag | `sum by(type) (rate(order_created_total[5m]))` | Breakdown of event rate per tag value |
| Error ratio | `rate(order_failed_total[5m]) / rate(order_created_total[5m])` | Fraction of events that are failures |
| Top N by label | `topk(5, sum by(subjectId) (rate(order_created_total[5m])))` | Which subjects generate the most events |
| Compare to threshold | `rate(order_created_total[5m]) > 100` | Alert when rate exceeds 100/sec |
| Total across all instances | `sum(rate(order_created_total[5m]))` | Cluster-wide event rate |

:::tip
Always wrap counters in `rate()` or `increase()`. Raw counter values are monotonically increasing and not useful on their own.
:::

---

## Timer (`OpStats.time`)

### Java

```java
// Time a Runnable
opStats.time("order.process.duration", () -> processOrder(order));

// Time a Supplier (returns result)
OrderResult result = opStats.time("order.process.duration", () -> processOrder(order));

// Record a pre-measured Duration
opStats.time("order.process.duration", Duration.ofMillis(elapsed));

// Static versions
OpStats.time("order.process.duration", () -> processOrder(order), tags);
OpStats.time("order.process.duration", Duration.ofMillis(elapsed), tags);
```

### Prometheus produces

```
order_process_duration_seconds_count{subjectId="123"}  500      # total calls
order_process_duration_seconds_sum{subjectId="123"}    123.45   # total time (seconds)
order_process_duration_seconds_max{subjectId="123"}    2.3      # max observed
order_process_duration_seconds_bucket{subjectId="123", le="0.01"}  45   # calls ≤ 10ms
order_process_duration_seconds_bucket{subjectId="123", le="0.1"}   234  # calls ≤ 100ms
order_process_duration_seconds_bucket{subjectId="123", le="+Inf"}  500  # all calls
```

### PromQL Queries

| Goal | Query | What it tells you |
|------|-------|-------------------|
| Average latency | `rate(order_process_duration_seconds_sum[5m]) / rate(order_process_duration_seconds_count[5m])` | Mean duration per call |
| P50 latency | `histogram_quantile(0.50, rate(order_process_duration_seconds_bucket[5m]))` | Median — half of requests are faster than this |
| P95 latency | `histogram_quantile(0.95, rate(order_process_duration_seconds_bucket[5m]))` | 95% of requests are faster than this |
| P99 latency | `histogram_quantile(0.99, rate(order_process_duration_seconds_bucket[5m]))` | Tail latency — worst 1% experience |
| Request rate | `rate(order_process_duration_seconds_count[5m])` | Throughput (calls/sec) — same as a counter |
| Max observed | `order_process_duration_seconds_max` | Peak latency in current scrape window |
| Latency by tag | `histogram_quantile(0.95, sum by(subjectId, le) (rate(order_process_duration_seconds_bucket[5m])))` | P95 broken down per subject |
| % requests under SLA | `sum(rate(order_process_duration_seconds_bucket{le="0.2"}[5m])) / sum(rate(order_process_duration_seconds_count[5m])) * 100` | What % of calls complete within 200ms |
| Slow call alert | `histogram_quantile(0.95, rate(order_process_duration_seconds_bucket[5m])) > 1` | Fire alert when P95 exceeds 1 second |
| Total time spent | `increase(order_process_duration_seconds_sum[1h])` | Total seconds spent in this operation over 1 hour |

:::tip
`histogram_quantile` needs the `le` label preserved — when aggregating, always keep `le` in the `by()` clause: `sum by(someTag, le) (rate(..._bucket[5m]))`.
:::

---

## Common Patterns

### Rate + filter by tag

```promql
rate(order_created_total{subjectId="123", type="limit"}[5m])
```

### Regex match on labels

```promql
rate(order_created_total{type=~"limit|market"}[5m])
```

### Exclude labels

```promql
rate(order_created_total{type!="test"}[5m])
```

### Aggregate across instances

```promql
sum(rate(order_created_total[5m]))                         # total rate
sum by(type) (rate(order_created_total[5m]))               # rate per type
avg by(instance) (rate(order_process_duration_seconds_sum[5m]) / rate(order_process_duration_seconds_count[5m]))   # avg latency per instance
```

### Time window selection

| Window | Use case |
|--------|----------|
| `[1m]` | Real-time, noisy |
| `[5m]` | Standard dashboards (good balance) |
| `[15m]` | Smoother trends |
| `[1h]` | Long-term overview |

:::warning
Shorter windows = noisier graphs but faster reaction. Longer windows = smoother but hide spikes. Match the window to your scrape interval — at minimum 4x the scrape interval (e.g., 15s scrape → use `[1m]` minimum).
:::

---

## Quick Reference

```
┌──────────────────┬────────────────────────────────────────────────────────┐
│ I want to know…  │ PromQL                                               │
├──────────────────┼────────────────────────────────────────────────────────┤
│ Event rate       │ rate(metric_total[5m])                                │
│ Event count      │ increase(metric_total[1h])                            │
│ Avg latency      │ rate(metric_sum[5m]) / rate(metric_count[5m])         │
│ P95 latency      │ histogram_quantile(0.95, rate(metric_bucket[5m]))     │
│ P99 latency      │ histogram_quantile(0.99, rate(metric_bucket[5m]))     │
│ Throughput       │ rate(metric_count[5m])                                │
│ % under SLA      │ rate(metric_bucket{le="X"}[5m]) / rate(metric_count…) │
│ Error ratio      │ rate(errors_total[5m]) / rate(requests_total[5m])     │
│ Top N            │ topk(N, sum by(label) (rate(metric_total[5m])))       │
│ Total time spent │ increase(metric_sum[1h])                              │
└──────────────────┴────────────────────────────────────────────────────────┘
```

---

## References

- [[micrometer_metric_types]]
- [[micrometer_to_prometheus_mapping]]
- [[prometheus_visualization_queries]]
- [PromQL Cheat Sheet](https://promlabs.com/promql-cheat-sheet/)

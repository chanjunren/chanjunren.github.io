🗓️ 07112025 0000

# prometheus_visualization_queries

**Core Concept**: Ready-to-use PromQL query patterns for visualizing Micrometer metrics in Grafana dashboards.

## Why It Matters

Copy-paste queries save time and ensure correct visualization of [[micrometer_metric_types]]. Understanding [[prometheus_range_function_calculations]] helps you modify these patterns for your needs.

## Counter Queries

**Request rate (requests/sec)**:
```promql
rate(http_requests_total[5m])
```

**Total requests in time window**:
```promql
increase(http_requests_total[1h])
```

**Error rate percentage**:
```promql
rate(http_requests_total{status=~"5.."}[5m]) / 
rate(http_requests_total[5m]) * 100
```

**Top N endpoints by traffic**:
```promql
topk(10, sum by(endpoint) (rate(http_requests_total[5m])))
```

## Timer Queries

**95th percentile latency**:
```promql
histogram_quantile(0.95, 
  rate(http_request_duration_seconds_bucket[5m])
)
```

**Average latency**:
```promql
rate(http_request_duration_seconds_sum[5m]) / 
rate(http_request_duration_seconds_count[5m])
```

**Request rate (from timer)**:
```promql
rate(http_request_duration_seconds_count[5m])
```

**Multiple percentiles (p50, p95, p99)**:
```promql
histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
```

**Latency by endpoint (aggregated)**:
```promql
histogram_quantile(0.95,
  sum by(endpoint, le) (rate(http_request_duration_seconds_bucket[5m]))
)
```

**SLA compliance (% requests < 200ms)**:
```promql
sum(rate(http_request_duration_seconds_bucket{le="0.2"}[5m])) /
sum(rate(http_request_duration_seconds_count[5m])) * 100
```

## Gauge Queries

**Current value**:
```promql
queue_size
```

**Average over time**:
```promql
avg_over_time(queue_size[5m])
```

**Max value in window**:
```promql
max_over_time(jvm_memory_used_bytes[1h])
```

**Memory usage percentage**:
```promql
jvm_memory_used_bytes / jvm_memory_max_bytes * 100
```

**Change over time**:
```promql
delta(queue_size[5m])
```

**Rate of change (for growing gauges)**:
```promql
deriv(disk_usage_bytes[1h])
```

## DistributionSummary Queries

**95th percentile payload size**:
```promql
histogram_quantile(0.95,
  rate(request_size_bytes_bucket[5m])
)
```

**Average payload size**:
```promql
rate(request_size_bytes_sum[5m]) / 
rate(request_size_bytes_count[5m])
```

**Total data transferred**:
```promql
increase(request_size_bytes_sum[1h])
```

## LongTaskTimer Queries

**Number of jobs running**:
```promql
batch_job_duration_seconds_active_count
```

**Average duration of active jobs**:
```promql
batch_job_duration_seconds_duration_sum / 
batch_job_duration_seconds_active_count
```

**Alert on stuck jobs (running > 1 hour)**:
```promql
batch_job_duration_seconds_max > 3600
```

**Job completion rate (combine with Counter)**:
```promql
rate(batch_job_completed_total[5m])
```

## HTTP Dashboard Patterns

**RED Metrics (Rate, Errors, Duration)**:

```promql
# Rate - requests per second
rate(http_requests_total[5m])

# Errors - error rate percentage
rate(http_requests_total{status=~"5.."}[5m]) / 
rate(http_requests_total[5m]) * 100

# Duration - p95 latency
histogram_quantile(0.95, 
  rate(http_request_duration_seconds_bucket[5m])
)
```

**Traffic distribution by endpoint**:
```promql
sum by(endpoint) (rate(http_requests_total[5m]))
```

**Error breakdown by status code**:
```promql
sum by(status) (rate(http_requests_total{status=~"[45].."}[5m]))
```

## Database Query Patterns

**Query rate**:
```promql
rate(db_query_duration_seconds_count[5m])
```

**Slow query detection (p99 > 1s)**:
```promql
histogram_quantile(0.99, 
  rate(db_query_duration_seconds_bucket[5m])
) > 1
```

**Query latency by operation**:
```promql
histogram_quantile(0.95,
  sum by(operation, le) (rate(db_query_duration_seconds_bucket[5m]))
)
```

## Cache Metrics Patterns

**Cache hit rate percentage**:
```promql
rate(cache_hits_total[5m]) / 
(rate(cache_hits_total[5m]) + rate(cache_misses_total[5m])) * 100
```

**Cache size trend**:
```promql
cache_size
```

**Cache eviction rate**:
```promql
rate(cache_evictions_total[5m])
```

## JVM Metrics Patterns

**Heap memory usage percentage**:
```promql
jvm_memory_used_bytes{area="heap"} / 
jvm_memory_max_bytes{area="heap"} * 100
```

**GC pause time (p95)**:
```promql
histogram_quantile(0.95,
  rate(jvm_gc_pause_seconds_bucket[5m])
)
```

**Thread count**:
```promql
jvm_threads_live
```

## Alerting Patterns

**High error rate (> 5%)**:
```promql
rate(http_requests_total{status=~"5.."}[5m]) / 
rate(http_requests_total[5m]) * 100 > 5
```

**High latency (p95 > 500ms)**:
```promql
histogram_quantile(0.95, 
  rate(http_request_duration_seconds_bucket[5m])
) > 0.5
```

**No requests (service down)**:
```promql
rate(http_requests_total[5m]) == 0
```

**High memory usage (> 90%)**:
```promql
jvm_memory_used_bytes / jvm_memory_max_bytes * 100 > 90
```

**Queue backup**:
```promql
queue_size > 1000
```

## Quick Reference

| Metric Type         | Common Visualization | Query Pattern                                       |
|---------------------|----------------------|-----------------------------------------------------|
| Counter             | Rate graph           | `rate(metric[5m])`                                  |
| Counter             | Total count          | `increase(metric[1h])`                              |
| Timer               | Percentile graph     | `histogram_quantile(0.95, rate(metric_bucket[5m]))` |
| Timer               | Average latency      | `rate(metric_sum[5m]) / rate(metric_count[5m])`     |
| Gauge               | Current value        | `metric`                                            |
| Gauge               | Average trend        | `avg_over_time(metric[5m])`                         |
| DistributionSummary | Size percentile      | `histogram_quantile(0.95, rate(metric_bucket[5m]))` |
| LongTaskTimer       | Active jobs          | `metric_active_count`                               |

---
## References

- [PromQL Query Examples](https://prometheus.io/docs/prometheus/latest/querying/examples/)
- [Grafana PromQL Basics](https://grafana.com/docs/grafana/latest/datasources/prometheus/)


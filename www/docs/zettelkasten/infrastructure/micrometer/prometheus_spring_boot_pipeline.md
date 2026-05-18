🗓️ 18052026 2200

# prometheus_spring_boot_pipeline

**micrometer-registry-prometheus** creates an end-to-end pipeline in Spring Boot: your code instruments with [[metric_types]] → metrics convert to Prometheus exposition format per [[to_prometheus_mapping]] → exposed at `/actuator/prometheus` → scraped by [[overview]] → queried with PromQL in Grafana.

This note connects the existing pieces into the full data flow and covers what Spring Boot auto-instruments.

## The Pipeline

```
Your Code                Micrometer              Registry                    Endpoint                 Prometheus      Grafana
─────────                ──────────              ────────                    ────────                 ──────────      ───────
Counter.increment()  →   MeterRegistry   →   PrometheusMeterRegistry   →   /actuator/prometheus  →   scrape     →   PromQL
Timer.record()           stores metrics       converts to exposition        text format endpoint      pull every      dashboards
Gauge.builder()          in memory             format on scrape             (GET request)             15-30s          & alerts
```

---

## Setup

### Dependency

```xml
<!-- Maven -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

```groovy
// Gradle
implementation 'io.micrometer:micrometer-registry-prometheus'
```

Spring Boot 3.x includes this transitively via `spring-boot-starter-actuator`.

### Configuration

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health, info, prometheus
  metrics:
    tags:
      application: ${spring.application.name}
```

### Verification

```bash
curl http://localhost:8080/actuator/prometheus
```

---

## Auto-Instrumented Metrics

Spring Boot + Micrometer registers these without any code.

### JVM (`jvm_*`)

| Prometheus Metric | Measures |
|-------------------|----------|
| `jvm_memory_used_bytes{area="heap"}` | Heap memory in use |
| `jvm_memory_max_bytes{area="heap"}` | Max heap |
| `jvm_memory_committed_bytes` | Memory committed by JVM |
| `jvm_gc_pause_seconds_*` | GC pause durations (histogram) |
| `jvm_gc_memory_allocated_bytes_total` | Bytes allocated in young gen |
| `jvm_gc_memory_promoted_bytes_total` | Bytes promoted to old gen |
| `jvm_threads_live_threads` | Current live threads |
| `jvm_threads_daemon_threads` | Daemon thread count |
| `jvm_threads_peak_threads` | Peak thread count |
| `jvm_classes_loaded_classes` | Currently loaded classes |
| `jvm_buffer_memory_used_bytes` | Direct/mapped buffer memory |

### HTTP Server (`http_server_requests_*`)

| Prometheus Metric | Labels |
|-------------------|--------|
| `http_server_requests_seconds_count` | `method`, `uri`, `status`, `outcome` |
| `http_server_requests_seconds_sum` | same |
| `http_server_requests_seconds_bucket` | same + `le` |
| `http_server_requests_seconds_max` | same |

Auto-timed by Spring MVC and WebFlux. See [[promql_cheatsheet]] for query patterns.

```ad-warning
The `uri` label uses the route template (`/api/users/{id}`), not the actual path (`/api/users/123`). `uri="UNKNOWN"` means the request hit no mapped handler. Dynamic path segments as label values cause cardinality explosion.
```

### Connection Pool (`hikaricp_*`)

| Prometheus Metric | Measures |
|-------------------|----------|
| `hikaricp_connections_active` | Connections in use |
| `hikaricp_connections_idle` | Idle connections |
| `hikaricp_connections_max` | Max pool size |
| `hikaricp_connections_pending` | Threads waiting for connection |
| `hikaricp_connections_acquire_seconds_*` | Connection acquisition time |
| `hikaricp_connections_creation_seconds_*` | Connection creation time |
| `hikaricp_connections_usage_seconds_*` | Connection usage duration |

### System / Process

| Prometheus Metric | Measures |
|-------------------|----------|
| `process_cpu_usage` | JVM process CPU (0.0–1.0) |
| `system_cpu_usage` | Whole system CPU (0.0–1.0) |
| `process_uptime_seconds` | JVM uptime |
| `process_start_time_seconds` | JVM start timestamp |
| `process_files_open_files` | Open file descriptors |
| `process_files_max_files` | Max file descriptors |

### Cache (`cache_*` — if Spring Cache enabled)

| Prometheus Metric | Measures |
|-------------------|----------|
| `cache_gets_total{result="hit"}` | Cache hits |
| `cache_gets_total{result="miss"}` | Cache misses |
| `cache_puts_total` | Cache puts |
| `cache_evictions_total` | Cache evictions |
| `cache_size` | Current cache size |

---

## Common Label Dimensions

| Label | Source | Example |
|-------|--------|---------|
| `application` | `management.metrics.tags.application` config | `my-service` |
| `instance` | Added by Prometheus at scrape time | `10.0.0.5:8080` |
| `uri` | Spring MVC route pattern | `/api/users/{id}` |
| `method` | HTTP method | `GET` |
| `status` | HTTP status code | `200` |
| `outcome` | Spring outcome category | `SUCCESS` |
| `area` | JVM memory area | `heap`, `nonheap` |

---

## Prometheus Scrape Configuration

```yaml
# prometheus.yml — static target
scrape_configs:
  - job_name: 'spring-boot'
    metrics_path: '/actuator/prometheus'
    scrape_interval: 15s
    static_configs:
      - targets: ['localhost:8080']
```

For K8s, annotate pods and use service discovery:

```yaml
# pod annotations
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/path: "/actuator/prometheus"
  prometheus.io/port: "8080"
```

Or use [[grafana_alloy]] to collect and forward metrics to a remote backend.

---

## Troubleshooting

| Problem | Check |
|---------|-------|
| No metrics at `/actuator/prometheus` | `micrometer-registry-prometheus` on classpath? Endpoint exposed in config? |
| Metric name mismatch | Dots → underscores, counters get `_total`, timers get `_seconds` — see [[to_prometheus_mapping]] |
| Missing labels | Check tag config in [[metric_types]] |
| High cardinality warning | Avoid dynamic path variables as tags; use route templates |
| Metrics disappear after restart | Counters reset — use `rate()` not raw values |
| `uri="UNKNOWN"` | Request hit no mapped handler — check `@RequestMapping` |
| Pool metrics missing | HikariCP not on classpath, or pool name not set |

---

## Three Layers of Observability

```
┌─────────────────────────────────────────────────────┐
│ Application Metrics (this note)                      │
│ micrometer-registry-prometheus → /actuator/prometheus │
│ JVM, HTTP, pools, custom business metrics            │
├─────────────────────────────────────────────────────┤
│ Container Metrics — [[cadvisor_container_metrics]]   │
│ CPU, memory, network, disk per container             │
├─────────────────────────────────────────────────────┤
│ Host Metrics — [[node_exporter_host_metrics]]        │
│ CPU, memory, disk, network per node                  │
└─────────────────────────────────────────────────────┘
```

---

## References

- [Spring Boot Actuator Metrics](https://docs.spring.io/spring-boot/reference/actuator/metrics.html)
- [Micrometer Prometheus Registry](https://docs.micrometer.io/micrometer/reference/implementations/prometheus.html)

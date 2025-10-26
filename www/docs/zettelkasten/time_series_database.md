🗓️ 12072025 1023

# time_series_database

- **Optimized for appending**: TSDBs assume write-once data; use delta encoding and compression for efficient storage
- **Multi-dimensional model**: Data = metric name + timestamp + labels (e.g., `region="ap-sg"`, `instance="app1"`)
>  Labels allow slicing and dicing. 
- **Cardinality**: Total number of unique time-series (label combinations). High cardinality increases memory, storage, and query latency
- **Scaling limits**: Single Prometheus typically handles ~1–2 million series. Exceeding this requires strategies like sharding, federation, or adopting specialized TSDBs

---
## References

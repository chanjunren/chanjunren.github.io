🗓️ 12072025 1023

# time_series_database

A **time-series database** stores observations associated with timestamps. Its schema and query model often make time-range filtering, retention, and aggregation efficient.

## Common data model

An observation usually contains a measurement, timestamp, value, and identifying dimensions such as `region` or `instance`. In systems such as Prometheus, each unique metric name and label set identifies a time series.

## Design trade-offs

- Time-based partitioning and retention can simplify expiry of old data.
- Compression and downsampling can reduce storage, with detail or precision trade-offs.
- High-cardinality labels create many distinct series and increase memory and storage costs.
- Query speed depends on the engine, retention, label design, scrape interval, and workload.

There is no universal series-count limit. Measure the chosen database with representative labels, retention, and queries. Avoid labels whose values grow without bound, such as request IDs.

## References

- [Prometheus: Data model](https://prometheus.io/docs/concepts/data_model/)

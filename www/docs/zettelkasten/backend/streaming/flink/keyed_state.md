🗓️ 04032025 2259

# keyed_state

Keyed state stores values by the current record key. Flink partitions it with the keyed stream, so each operator instance accesses the state for its assigned keys locally.

Keyed state is available after a keyed partitioning operation such as `keyBy`. Flink can redistribute it when the job is rescaled.

## Key Groups

**Key groups** are the units Flink redistributes. Their count is fixed by the operator's maximum parallelism; each parallel instance handles one or more groups.

## State lifecycle

State is associated with keys and may remain after a key stops receiving events. Use explicit clearing or State TTL when the data's lifetime is bounded. TTL is a cleanup and visibility policy; it does not guarantee immediate physical deletion.

```ad-warning
Long-lived jobs can accumulate state for inactive keys. Set a retention policy that matches the application's correctness needs.
```

Use state APIs to clear a value when its lifecycle ends. Use timers or State TTL for time-based cleanup.


---
## References
- [Apache Flink 1.20: Stateful stream processing](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/stateful-stream-processing/)
- [Apache Flink 1.20: State TTL](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/fault-tolerance/state/#state-time-to-live-ttl)

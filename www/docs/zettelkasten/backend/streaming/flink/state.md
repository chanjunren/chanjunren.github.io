🗓️ 17102026 2135

# state

Flink state is data a streaming operator retains across events, such as a running aggregate, timer, or pending join record.

Managed state lets Flink integrate state with checkpointing and rescaling. [[keyed_state]] is partitioned by a stream key so an operator can access only the current key's values. [[operator_state]] belongs to a parallel operator instance and is redistributed according to its state-handling mode.

The configured state backend determines how state is stored and accessed during processing. Checkpoint storage is a separate choice: it determines where consistent snapshots are made durable. Large state may use local disk for working storage while checkpoints are persisted to a distributed filesystem or object store.

State has operational costs. Larger state increases checkpoint and recovery work; TTL, compaction, key design, and backend choice affect those costs. Choose state scope and retention from the business invariant rather than keeping every historical event indefinitely.

## Related notes

- [[checkpointing]] — consistent snapshots
- [[keyed_state]] — state partitioned by key
- [[operator_state]] — state owned by an operator instance

## References

- [Apache Flink: Working with State](https://nightlies.apache.org/flink/flink-docs-stable/docs/dev/datastream/fault-tolerance/state/)
- [Apache Flink: State Backends](https://nightlies.apache.org/flink/flink-docs-stable/docs/ops/state/state_backends/)

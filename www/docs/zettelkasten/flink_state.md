🗓️ 20012025 1436

# flink_state

## Features
> Why is flink involved in managing state
- **Local**:
  - Flink state is kept local to the machine that processes it
  - Can be accessed at memory speed
- **Durable**: Flink state is fault-tolerant
  - Automatically checkpointed at regular intervals
  - Restored upon failure
- **Vertically scalable**
  - Flink state can be kept in embedded RocksDB instances
  - Scale by adding more local disk
- **Horizontally scalable**
  - Flink state is redistributed as your cluster grows and shrinks

## Types
- [[flink_operator_state]]
- [[flink_keyed_state]]


## References
- https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/etl/

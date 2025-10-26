🗓️ 04032025 2318

# flink_checkpointing

- **Ensures fault tolerance** by saving operator [[flink_state]] periodically
- If a failure occurs, Flink **restores state from the last successful checkpoint**.
- Works with **stateful functions** that retain data across events.


## Prerequisites for Checkpointing

| prerequisite         | usage                       | examples                       |
| -------------------- | --------------------------- | ------------------------------ |
| Durable data sources | For replaying records       | Kafka, RabbitMQ, Kinesis, etc. |
| State storage        | saving checkpoint snapshots | HDFS, S3, Ceph, etc.           |

---
## References

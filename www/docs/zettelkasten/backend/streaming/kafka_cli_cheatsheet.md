🗓️ 17102026 2135

# kafka_cli_cheatsheet

These Kafka CLI examples use the scripts shipped with an Apache Kafka distribution.

Set the broker address and topic for your environment. The examples assume the scripts are available under `bin/` from the Kafka installation directory.

```bash
# Create a topic (topic creation options vary by broker and environment)
bin/kafka-topics.sh --create --topic events --bootstrap-server localhost:9092

# Produce lines from standard input
bin/kafka-console-producer.sh --topic events --bootstrap-server localhost:9092

# Read new records as they arrive
bin/kafka-console-consumer.sh --topic events --bootstrap-server localhost:9092

# Read from the earliest retained offset
bin/kafka-console-consumer.sh --topic events --from-beginning --bootstrap-server localhost:9092
```

`--from-beginning` reads from the earliest offset available to the consumer group; it does not recover records already deleted by retention. In shared or production environments, use the appropriate authentication, authorization, and TLS settings rather than copying the local examples unchanged.

## Related notes

- [[kafka_architecture]] — topics, partitions, and brokers
- [[kafka_partition_ordering_keying]] — per-partition ordering

## References

- [Apache Kafka Quickstart](https://kafka.apache.org/quickstart)

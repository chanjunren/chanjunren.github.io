🗓️ 07032025 1552
📎

# kappa_architecture
> streaming only

- Kappa Architecture **simplifies Lambda** by **eliminating the batch layer**.
- Instead of separate batch & streaming paths, **Kappa uses only a single stream-processing system**.

## How It Works
1. **All data is processed as a real-time stream**.
2. **Stream processors (e.g., Apache Flink, Kafka Streams, Spark Streaming)** process data and store results in a queryable system (e.g., Delta Lake, Elasticsearch, Apache Pinot).
3. If historical data needs to be reprocessed, the system **simply replays the event logs**.

## Pros & Cons

|**Pros**|**Cons**|
|---|---|
|✅ **Simpler than Lambda** – No need to maintain separate batch and streaming layers|❌ Not optimized for massive historical batch processing|
|✅ **Lower latency** – Streaming means **instant insights**|❌ Reprocessing historical data requires replaying event logs|
|✅ **Easier to maintain** – No need to merge batch & real-time results|❌ May require more compute resources for real-time processing|

## When to Use Kappa Architecture?
- When **real-time streaming is the primary use case**.
- When historical batch processing is **not a priority**.
- When working with **event-driven architectures** (e.g., real-time analytics, fraud detection, IoT data).

---
# References

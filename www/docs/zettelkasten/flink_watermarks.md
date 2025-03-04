🗓️ 16012025 1848
📎

# flink_watermarks

```ad-summary
Mechanism to tell flink when to **stop waiting for earlier events** and proceed with processing
```
## Background
-  **Out-of-Order Events:**
	- Streams often contain events that arrive in an order different from when they occurred
	- Some buffering and delay are needed to ensure correct processing order
- **Progress Without Infinite Waiting:**
	- To avoid waiting indefinitely for earlier events, watermarks provide a mechanism to decide when to move forward with processing.

## Requirements 
> What is needed to process data based on event time([[flink_notions_of_time]])

- Timestamp Extractor 
- Watermark Generator - required to handle events that may arrive out of order.

## Mechanism
- Inserted into streams to indicate that all earlier events (up to time t) have likely been processed.
- Common strategy: Bounded-Out-of-Orderness - assumes a fixed maximum delay for late events
- Also possible: hybrid solutions that produce initial results quickly, and then supply updates to those results as additional (late) data is processed
## Tradeoff
Controls the balance between 
- **latency**  - faster results, less accurate
- **completeness** (slower results, more accurate)

```java
DataStream<Event> stream = ...;

WatermarkStrategy<Event> strategy = WatermarkStrategy
        .<Event>forBoundedOutOfOrderness(Duration.ofSeconds(20))
        .withTimestampAssigner((event, timestamp) -> event.timestamp);

DataStream<Event> withTimestampsAndWatermarks =
    stream.assignTimestampsAndWatermarks(strategy);
```



---

# References
- https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/

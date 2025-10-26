🗓️ 16012025 1122

# flink_notions_of_time

## Notions of time

| Notion          | Description                                                                                      | Use case                                                                                          | Example                           |
| --------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | --------------------------------- |
| Event time      | Timestamp of when an event occurred, as recorded by the producing or storing device.             | Reproducible results, historical data analysis, or time-based calculations                        | Stock prices during a time window |
| Ingestion time  | timestamp recorded by Flink at the moment it ingests the event                                   | Quick prototyping or debugging when event time is unavailable or irrelevant                       |                                   |
| Processing time | Time when a specific operator in the pipeline processes the event (system clock of the operator) | Suitable for applications where low-latency processing is more important than exact time accuracy | Monitoring                        |

### Lateness

Lateness is defined relative to the watermarks. A `Watermark(t)` asserts that the stream is complete up through time _t_; any event following this watermark whose timestamp is ≤ _t_ is late.

### Working with Watermarks [#](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/#working-with-watermarks)

In order to perform event-time-based event processing, Flink needs to know the time associated with each event, and it also needs the stream to include watermarks.

The Taxi data sources used in the hands-on exercises take care of these details for you. But in your own applications you will have to take care of this yourself, which is usually done by implementing a class that extracts the timestamps from the events, and generates watermarks on demand. The easiest way to do this is by using a `WatermarkStrategy`:

## Further Reading [#](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/#further-reading)

- [Timely Stream Processing](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/concepts/time/)
- [Windows](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/datastream/operators/windows/)

---

## References
- https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/
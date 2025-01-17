🗓️ 17012025 0114
📎

# flink_window_assigners

![Window assigners](https://nightlies.apache.org/flink/flink-docs-release-1.20/fig/window-assigners.svg)
## Time based

| Type     | Description                                                                     |
| -------- | ------------------------------------------------------------------------------- |
| Tumbling | Fixed-size, non-overlapping windows > Each event belongs to exactly one window. |
| Sliding  | Fixed-size windows that overlap > An event can belong to multiple windows.      |
| Session  | Dynamically sized windows based on inactivity gaps between events               |
- Have both event / processing time flavours
- Tradeoffs
	- Processing:
		- 😃 Lower latency
		- ☹️ Cannot correctly process historic data
		- ☹️ Cannot handle out of order data
		- ☹️ Non deterministic data


## Count based
| Type     | Description                                                            |
| -------- | ---------------------------------------------------------------------- |
| Tumbling | Processes a fixed number of events before triggering (non-overlapping) |
| Sliding  | Processes a fixed number of events with overlap                        |
- Windows will not fire until a batch is complete
- No option to timeout / process a partial window (except with a custom trigger)

## Global

- Assigns every event with the same key to the same global window
- Useful for custom windowing, with a custom Trigger
```ad-note
Apache flink suggests to use [ProcessFunction](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/event_driven/#process-functions) instead
```


---

# References
- https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/streaming_analytics/

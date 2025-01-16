🗓️ 17012025 0114
📎

# flink_window_assigners

![Window assigners](https://nightlies.apache.org/flink/flink-docs-release-1.20/fig/window-assigners.svg)
> Built in assigners

## Time based

| Type     | Description | Example |
| -------- | ----------- | ------- |
| Tumbling |             |         |
| Sliding  |             |         |
| Session  |             |         |
- Have both event / processing time flavours
- Tradeoffs
	- Processing:
		- 😃 Lower latency
		- ☹️ Cannot correctly process historic data
		- ☹️ Cannot handle out of order data
		- ☹️ Non deterministic data


## Count based
| Type     | Description |
| -------- | ----------- |
| Tumbling |             |
| Sliding  |             |
- Windows will not fire until a batch is complete
- No option to timeout / process a partial window (except with a custom trigger)

## Global

- Assigns every event (with the same key) to the same global window
- Useful  for custom windowing, with a custom Trigger
```ad-note
Apache flink suggests to use [ProcessFunction](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/event_driven/#process-functions)
```


---

# References
- https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/streaming_analytics/

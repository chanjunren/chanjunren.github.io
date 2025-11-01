🗓️ 16012025 1856

# flink_windows

- Enable **aggregated processing** of subsets of **unbounded streams**
> Splits the stream into “buckets” of finite size, over which we can apply **computations**
- Example of analytics
	- Page views per minute
	- Sessions per user per week
	- Maximum temperature per sensor per minute

## Components

| Component                  | Description                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| [[flink_window_assigners]] | Assign events to windows                                           |
| [[flink_window_functions]] | Process events in window                                           |
| Triggers                   | Trigger computation when [[flink_watermarks]] surpasses window end |
| Evictors                   | Remove elements from windows before processing                     |
## Surprises 

### Sliding Windows Make Copies 
- Sliding window assigners can create lots of window objects, and will copy each event into every relevant window
- E.g., if you have sliding windows every 15 minutes that are 24-hours in length, each event will be copied into 4 * 24 = 96 windows.

### Time Windows are Aligned to the Epoch
- Just because you are using hour-long processing-time windows and start your application running at 12:05 does not mean that the first window will close at 1:05
- The first window will be 55 minutes long and close at 1:00.

```ad-note
Tumbling and sliding window assigners take an optional offset parameter that can be used to change the alignment of the windows

See [Tumbling Windows](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/operators/windows/#tumbling-windows) and [Sliding Windows](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/operators/windows/#sliding-windows) for details.

```

### Windows Can Follow Windows 

```java
stream
    .keyBy(t -> t.key)
    .window(<window assigner>)
    .reduce(<reduce function>)
    .windowAll(<same window assigner>)
    .reduce(<same reduce function>);
```
> This works

You might expect Flink’s runtime to be smart enough to do this parallel pre-aggregation for you (provided you are using a ReduceFunction or AggregateFunction), but it’s not.

The reason why this works:
- Events produced by a time window are assigned timestamps based on the time at the end of the window
- E.g. all of the events produced by an hour-long window will have timestamps marking the end of an hour
- Any subsequent window consuming those events should have a duration that is the same as, or a multiple of, the previous window
(?? Dont understand)

### No Results for Empty TimeWindows

- Windows are only created when events are assigned to them
- If there are no events in a given time frame, no results will be reported

### Late Events Can Cause Late Merges
- Session windows are based on an abstraction of windows that can _merge_
- Each element is initially assigned to a new window, after which windows are merged whenever the gap between them is small enough
- In this way, a late event can bridge the gap separating two previously separate sessions, producing a late merge.

## Further Reading

- [Timely Stream Processing](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/time/)
- [Windows](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/operators/windows/)

---

## References
- https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/streaming_analytics/ 

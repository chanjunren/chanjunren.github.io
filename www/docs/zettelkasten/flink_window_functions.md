🗓️ 17012025 0116
📎

# flink_window_functions
## Window Functions 

| Option      | Description                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| Batch       | Use `ProcessWindowFunction` to process all window events together                                       |
| Incremental | Using `ReduceFunction` or an `AggregateFunction` that is called as each event is assigned to the window |
| Hybrid      | Combine incremental results with `ProcessWindowFunction` for final processing                           |

#### ProcessWindowFunction Example 

```java
DataStream<SensorReading> input = ...;

input
    .keyBy(x -> x.key)
    .window(TumblingEventTimeWindows.of(Time.minutes(1)))
    .process(new MyWastefulMax());

public static class MyWastefulMax extends ProcessWindowFunction<
        SensorReading,                  // input type
        Tuple3<String, Long, Integer>,  // output type
        String,                         // key type
        TimeWindow> {                   // window type
    
    @Override
    public void process(
            String key,
            Context context, 
            Iterable<SensorReading> events,
            Collector<Tuple3<String, Long, Integer>> out) {

        int max = 0;
        for (SensorReading event : events) {
            max = Math.max(event.value, max);
        }
        out.collect(Tuple3.of(key, context.window().getEnd(), max));
    }
}
```

A couple of things to note in this implementation:
`windowState` and `globalState` are places where you can store per-key, per-window, or global per-key information for all windows of that key. This might be useful, for example, if you want to record something about the current window and use that when processing a subsequent window.

#### Incremental Aggregation Example

```java
DataStream<SensorReading> input = ...;

input
    .keyBy(x -> x.key)
    .window(TumblingEventTimeWindows.of(Time.minutes(1)))
    .reduce(new MyReducingMax(), new MyWindowFunction());

private static class MyReducingMax implements ReduceFunction<SensorReading> {
    public SensorReading reduce(SensorReading r1, SensorReading r2) {
        return r1.value() > r2.value() ? r1 : r2;
    }
}

private static class MyWindowFunction extends ProcessWindowFunction<
    SensorReading, Tuple3<String, Long, SensorReading>, String, TimeWindow> {

    @Override
    public void process(
            String key,
            Context context,
            Iterable<SensorReading> maxReading,
            Collector<Tuple3<String, Long, SensorReading>> out) {

        SensorReading max = maxReading.iterator().next();
        out.collect(Tuple3.of(key, context.window().getEnd(), max));
    }
}
```

Notice that the `Iterable<SensorReading>` will contain exactly one reading – the pre-aggregated maximum computed by `MyReducingMax`.

### Late Events

By default, when using event time windows, late events are dropped. There are two optional parts of the window API that give you more control over this.

You can arrange for the events that would be dropped to be collected to an alternate output stream instead, using a mechanism called [Side Outputs](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/event_driven/#side-outputs). Here is an example of what that might look like:

```java
OutputTag<Event> lateTag = new OutputTag<Event>("late"){};

SingleOutputStreamOperator<Event> result = stream
    .keyBy(...)
    .window(...)
    .sideOutputLateData(lateTag)
    .process(...);
  
DataStream<Event> lateStream = result.getSideOutput(lateTag);
```

You can also specify an interval of _allowed lateness_ during which the late events will continue to be assigned to the appropriate window(s) (whose state will have been retained). By default each late event will cause the window function to be called again (sometimes called a _late firing_).

By default the allowed lateness is 0. In other words, elements behind the watermark are dropped (or sent to the side output).

For example:

```java
stream
    .keyBy(...)
    .window(...)
    .allowedLateness(Time.seconds(10))
    .process(...);
```

When the allowed lateness is greater than zero, only those events that are so late that they would be dropped are sent to the side output (if it has been configured).


---

# References
- https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/streaming_analytics/
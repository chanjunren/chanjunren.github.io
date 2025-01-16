🗓️ 16012025 1856
📎

# flink_windows

#### **1. Windows Overview**

- Windows enable **aggregated processing** of subsets of unbounded streams, commonly used for analytics like:
    - Page views per minute
    - Sessions per user per week
    - Maximum temperature per sensor per minute
- Key components:
    - **Window Assigners**: Assign events to windows.
    - **Window Functions**: Process events in a window.
    - **Triggers**: Determine when to process a window.
    - **Evictors**: Remove elements from windows before processing.

---

#### **2. Window Assigners**

- Flink provides built-in assigners:
    - **Tumbling Windows**: Fixed-size, non-overlapping windows.
    - **Sliding Windows**: Overlapping windows with a fixed interval.
    - **Session Windows**: Dynamically sized windows based on gaps between events.
- **Time-based Assigners**:
    - Event Time: Correct for historical and out-of-order data.
    - Processing Time: Faster but less accurate (non-deterministic results, no out-of-order handling).
- **Count-based Assigners**:
    - Fire only when a batch of events is complete.
- **Global Windows**:
    - Assign all events to a single window for custom behavior (requires custom triggers).

---

#### **3. Window Functions**

- Options for processing window data:
    1. **Batch Processing**: Use `ProcessWindowFunction` to process all events at once.
    2. **Incremental Processing**: Use `ReduceFunction` or `AggregateFunction` to process events as they arrive.
    3. **Hybrid Processing**: Combine incremental and batch approaches by pre-aggregating data with a `ReduceFunction` or `AggregateFunction` and finalizing with a `ProcessWindowFunction`.

---

#### **4. Handling Late Events**

- Late events (events arriving after their window is complete) can be:
    - Sent to a **side output** for separate processing.
    - Processed with **allowed lateness**, keeping windows open for additional time.
- By default, late events are dropped.

---

#### **5. Common Challenges and Considerations**

- **Sliding Windows**: Events can belong to multiple windows, potentially creating significant overhead.
- **Time Alignment**: Time windows are aligned to the epoch unless an offset is specified.
- **Empty Windows**: No output is generated for windows with no events.
- **Late Merges**: Session windows can merge late due to late-arriving events.
- **Window Chaining**: You can chain windows sequentially for advanced workflows (e.g., combining aggregation and global windows).

Computing windowed analytics with Flink depends on two principal abstractions: _Window Assigners_ that assign events to windows (creating new window objects as necessary), and _Window Functions_ that are applied to the events assigned to a window.

Flink’s windowing API also has notions of _Triggers_, which determine when to call the window function, and _Evictors_, which can remove elements collected in a window.

In its basic form, you apply windowing to a keyed stream like this:

```java
stream
    .keyBy(<key selector>)
    .window(<window assigner>)
    .reduce|aggregate|process(<window function>);
```

You can also use windowing with non-keyed streams, but keep in mind that in this case, the processing will _not_ be done in parallel:

```java
stream
    .windowAll(<window assigner>)
    .reduce|aggregate|process(<window function>);
```

### Window Assigners [#](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/#window-assigners)

Flink has several built-in types of window assigners, which are illustrated below:

![Window assigners](https://nightlies.apache.org/flink/flink-docs-release-1.17/fig/window-assigners.svg)

Some examples of what these window assigners might be used for, and how to specify them:

- Tumbling time windows
    - _page views per minute_
    - `TumblingEventTimeWindows.of(Time.minutes(1))`
- Sliding time windows
    - _page views per minute computed every 10 seconds_
    - `SlidingEventTimeWindows.of(Time.minutes(1), Time.seconds(10))`
- Session windows
    - _page views per session, where sessions are defined by a gap of at least 30 minutes between sessions_
    - `EventTimeSessionWindows.withGap(Time.minutes(30))`

Durations can be specified using one of `Time.milliseconds(n)`, `Time.seconds(n)`, `Time.minutes(n)`, `Time.hours(n)`, and `Time.days(n)`.

The time-based window assigners (including session windows) come in both event time and processing time flavors. There are significant tradeoffs between these two types of time windows. With processing time windowing you have to accept these limitations:

- can not correctly process historic data,
- can not correctly handle out-of-order data,
- results will be non-deterministic,

but with the advantage of lower latency.

When working with count-based windows, keep in mind that these windows will not fire until a batch is complete. There’s no option to time-out and process a partial window, though you could implement that behavior yourself with a custom Trigger.

A global window assigner assigns every event (with the same key) to the same global window. This is only useful if you are going to do your own custom windowing, with a custom Trigger. In many cases where this might seem useful you will be better off using a `ProcessFunction` as described [in another section](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/event_driven/#process-functions).

### Window Functions [#](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/#window-functions)

You have three basic options for how to process the contents of your windows:

1. as a batch, using a `ProcessWindowFunction` that will be passed an `Iterable` with the window’s contents;
2. incrementally, with a `ReduceFunction` or an `AggregateFunction` that is called as each event is assigned to the window;
3. or with a combination of the two, wherein the pre-aggregated results of a `ReduceFunction` or an `AggregateFunction` are supplied to a `ProcessWindowFunction` when the window is triggered.

Here are examples of approaches 1 and 3. Each implementation finds the peak value from each sensor in 1 minute event time windows, and producing a stream of Tuples containing `(key, end-of-window-timestamp, max_value)`.

#### ProcessWindowFunction Example [#](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/#processwindowfunction-example)

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

- All of the events assigned to the window have to be buffered in keyed Flink state until the window is triggered. This is potentially quite expensive.
- Our `ProcessWindowFunction` is being passed a `Context` object which contains information about the window. Its interface looks like this:

```java
public abstract class Context implements java.io.Serializable {
    public abstract W window();
    
    public abstract long currentProcessingTime();
    public abstract long currentWatermark();

    public abstract KeyedStateStore windowState();
    public abstract KeyedStateStore globalState();
}
```

`windowState` and `globalState` are places where you can store per-key, per-window, or global per-key information for all windows of that key. This might be useful, for example, if you want to record something about the current window and use that when processing a subsequent window.

#### Incremental Aggregation Example [#](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/#incremental-aggregation-example)

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

### Late Events [#](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/#late-events)

By default, when using event time windows, late events are dropped. There are two optional parts of the window API that give you more control over this.

You can arrange for the events that would be dropped to be collected to an alternate output stream instead, using a mechanism called [Side Outputs](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/event_driven/#side-outputs). Here is an example of what that might look like:

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

### Surprises [#](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/#surprises)

Some aspects of Flink’s windowing API may not behave in the way you would expect. Based on frequently asked questions on the [flink-user mailing list](https://flink.apache.org/community.html#mailing-lists) and elsewhere, here are some facts about windows that may surprise you.

#### Sliding Windows Make Copies [#](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/#sliding-windows-make-copies)

Sliding window assigners can create lots of window objects, and will copy each event into every relevant window. For example, if you have sliding windows every 15 minutes that are 24-hours in length, each event will be copied into 4 * 24 = 96 windows.

#### Time Windows are Aligned to the Epoch [#](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/#time-windows-are-aligned-to-the-epoch)

Just because you are using hour-long processing-time windows and start your application running at 12:05 does not mean that the first window will close at 1:05. The first window will be 55 minutes long and close at 1:00.

Note, however, that the tumbling and sliding window assigners take an optional offset parameter that can be used to change the alignment of the windows. See [Tumbling Windows](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/datastream/operators/windows/#tumbling-windows) and [Sliding Windows](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/datastream/operators/windows/#sliding-windows) for details.

#### Windows Can Follow Windows [#](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/#windows-can-follow-windows)

For example, it works to do this:

```java
stream
    .keyBy(t -> t.key)
    .window(<window assigner>)
    .reduce(<reduce function>)
    .windowAll(<same window assigner>)
    .reduce(<same reduce function>);
```

You might expect Flink’s runtime to be smart enough to do this parallel pre-aggregation for you (provided you are using a ReduceFunction or AggregateFunction), but it’s not.

The reason why this works is that the events produced by a time window are assigned timestamps based on the time at the end of the window. So, for example, all of the events produced by an hour-long window will have timestamps marking the end of an hour. Any subsequent window consuming those events should have a duration that is the same as, or a multiple of, the previous window.

#### No Results for Empty TimeWindows [#](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/#no-results-for-empty-timewindows)

Windows are only created when events are assigned to them. So if there are no events in a given time frame, no results will be reported.

#### Late Events Can Cause Late Merges [#](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/#late-events-can-cause-late-merges)

Session windows are based on an abstraction of windows that can _merge_. Each element is initially assigned to a new window, after which windows are merged whenever the gap between them is small enough. In this way, a late event can bridge the gap separating two previously separate sessions, producing a late merge.

[Back to top](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/#top)

## Hands-on [#](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/streaming_analytics/#hands-on)

The hands-on exercise that goes with this section is the [Hourly Tips Exercise](https://github.com/apache/flink-training/blob/release-1.17//hourly-tips) .


---

# References

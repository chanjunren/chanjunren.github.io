🗓️ 15012025 2227
📎

# flink_data_pipelines_etl

```ad-abstract
One very common use case for Apache [[flink]] is to implement ETL (extract, transform, load) pipelines that

1. Take data from one or more sources
2. Perform some transformations and/or enrichments
3. Store the results somewhere
```

## Stateless Transformations

### `map()` / `flatmap()`

Similar to Java streams so I won't talk about this

## Keyed Streams 

### `keyBy()` 

For partitioning a stream around one of its attributes

```ad-warning
Causes a network shuffle > expensive operation since it involves network communication (between nodes) along with serialization and deserialization
```

![keyBy and network shuffle](https://nightlies.apache.org/flink/flink-docs-release-1.20/fig/keyBy.png)

### Computed keys

`KeySelectors` (functions that determine keys used for partioning) not limited to field extraction

| Requirement                                              | Description                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| Deterministic (same result given same input)             | Ensures consistent / correct behavior in distributed systems |
| has valid implementations of `hashCode()` and `equals()` | Used by Flink for partitioning                               |

- ❌ KeySelectors that generate random numbers
- ❌ Arrays, enums
- ✅ Tuples
- ✅ Composite Keys
- ✅ POJOs

## Aggregations on Keyed Streams

- Flink provides support for stream aggregations e.g.
  - `maxBy()`
  - ...
  - `reduce()` - can implement your own aggregator

```ad-warning
Flink needs to keep track of the state of aggregations for each distinct key > amount of **state** grows with each distinct key

Whenever the key space is unbounded, then so is the amount of state Flink will need
```

### Key Considerations

- **Bounded Key Spaces**: Design your keys to ensure the key space remains manageable (e.g., limit the number of unique keys).
- **State Management**: Use **state backends** (e.g., RocksDB) and enable **checkpointing** to handle large state sizes efficiently.

## Stateful Transformations

### Why is Flink Involved in Managing State? 

Basically, because Flink has some good features:

- **Local**:
  - Flink state is kept local to the machine that processes it
  - Can be accessed at memory speed
- **Durable**: Flink state is fault-tolerant
  - Automatically checkpointed at regular intervals
  - Restored upon failure
- **Vertically scalable**
  - Flink state can be kept in embedded RocksDB instances
  - Scale by adding more local disk
- **Horizontally scalable**
  - Flink state is redistributed as your cluster grows and shrinks

### Rich Functions

- There are "rich" variants of Flink's function interfaces
- Contain additional methods

| Method                  | Description                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| `open(Configuration c)` | Called once during operator initialization (e.g., to load static data or establish connections) |
| `close()`               | Called at the end of the operator's lifecycle                                                   |
| `getRuntimeContext()`   | Provides access to Flink’s runtime context, including state management                          |

### An Example with Keyed State 

In this example, imagine you have a stream of events that you want to de-duplicate, so that you only keep the first event with each key. Here’s an application that does that, using a `RichFlatMapFunction` called `Deduplicator`:

```java
private static class Event {
    public final String key;
    public final long timestamp;
    ...
}

public static void main(String[] args) throws Exception {
    StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

    env.addSource(new EventSource())
        .keyBy(e -> e.key)
        .flatMap(new Deduplicator())
        .print();

    env.execute();
}
```

To accomplish this, `Deduplicator` will need to somehow remember, for each key, whether or not there has already been an event for that key. It will do so using Flink’s *keyed state* interface.

When you are working with a keyed stream like this one, Flink will maintain a key/value store for each item of state being managed.

Flink supports several different types of keyed state, and this example uses the simplest one, namely `ValueState`. This means that *for each key*, Flink will store a single object – in this case, an object of type `Boolean`.

Our `Deduplicator` class has two methods: `open()` and `flatMap()`. The open method establishes the use of managed state by defining a `ValueStateDescriptor<Boolean>`. The arguments to the constructor specify a name for this item of keyed state (“keyHasBeenSeen”), and provide information that can be used to serialize these objects (in this case, `Types.BOOLEAN`).

```java
public static class Deduplicator extends RichFlatMapFunction<Event, Event> {
    ValueState<Boolean> keyHasBeenSeen;

    @Override
    public void open(Configuration conf) {
        ValueStateDescriptor<Boolean> desc = new ValueStateDescriptor<>("keyHasBeenSeen", Types.BOOLEAN);
        keyHasBeenSeen = getRuntimeContext().getState(desc);
    }

    @Override
    public void flatMap(Event event, Collector<Event> out) throws Exception {
        if (keyHasBeenSeen.value() == null) {
            out.collect(event);
            keyHasBeenSeen.update(true);
        }
    }
}
```

When the flatMap method calls `keyHasBeenSeen.value()`, Flink’s runtime looks up the value of this piece of state *for the key in context*, and only if it is `null` does it go ahead and collect the event to the output. It also updates `keyHasBeenSeen` to `true` in this case.

This mechanism for accessing and updating key-partitioned state may seem rather magical, since the key is not explicitly visible in the implementation of our `Deduplicator`. When Flink’s runtime calls the `open` method of our `RichFlatMapFunction`, there is no event, and thus no key in context at that moment. But when it calls the `flatMap` method, the key for the event being processed is available to the runtime, and is used behind the scenes to determine which entry in Flink’s state backend is being operated on.

When deployed to a distributed cluster, there will be many instances of this `Deduplicator`, each of which will responsible for a disjoint subset of the entire keyspace. Thus, when you see a single item of `ValueState`, such as

```java
ValueState<Boolean> keyHasBeenSeen;
```

understand that this represents not just a single Boolean, but rather a distributed, sharded, key/value store.

### Clearing State [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/etl/#clearing-state)

There’s a potential problem with the example above: What will happen if the key space is unbounded? Flink is storing somewhere an instance of `Boolean` for every distinct key that is used. If there’s a bounded set of keys then this will be fine, but in applications where the set of keys is growing in an unbounded way, it’s necessary to clear the state for keys that are no longer needed. This is done by calling `clear()` on the state object, as in:

```java
keyHasBeenSeen.clear();
```

You might want to do this, for example, after a period of inactivity for a given key. You’ll see how to use Timers to do this when you learn about `ProcessFunction`s in the section on event-driven applications.

There’s also a [State Time-to-Live (TTL)](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/fault-tolerance/state/#state-time-to-live-ttl) option that you can configure with the state descriptor that specifies when you want the state for stale keys to be automatically cleared.

### Non-keyed State [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/etl/#non-keyed-state)

It is also possible to work with managed state in non-keyed contexts. This is sometimes called [operator state](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/fault-tolerance/state/#operator-state). The interfaces involved are somewhat different, and since it is unusual for user-defined functions to need non-keyed state, it is not covered here. This feature is most often used in the implementation of sources and sinks.

[Back to top](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/etl/#top)

## Connected Streams [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/etl/#connected-streams)

Sometimes instead of applying a pre-defined transformation like this:

![simple transformation](https://nightlies.apache.org/flink/flink-docs-release-1.20/fig/transformation.svg)

you want to be able to dynamically alter some aspects of the transformation – by streaming in thresholds, or rules, or other parameters. The pattern in Flink that supports this is something called *connected streams*, wherein a single operator has two input streams, like this:

![connected streams](https://nightlies.apache.org/flink/flink-docs-release-1.20/fig/connected-streams.svg)

Connected streams can also be used to implement streaming joins.

### Example [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/etl/#example)

In this example, a control stream is used to specify words which must be filtered out of the `streamOfWords`. A `RichCoFlatMapFunction` called `ControlFunction` is applied to the connected streams to get this done.

```java
public static void main(String[] args) throws Exception {
    StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

    DataStream<String> control = env
        .fromElements("DROP", "IGNORE")
        .keyBy(x -> x);

    DataStream<String> streamOfWords = env
        .fromElements("Apache", "DROP", "Flink", "IGNORE")
        .keyBy(x -> x);

    control
        .connect(streamOfWords)
        .flatMap(new ControlFunction())
        .print();

    env.execute();
}
```

Note that the two streams being connected must be keyed in compatible ways. The role of a `keyBy` is to partition a stream’s data, and when keyed streams are connected, they must be partitioned in the same way. This ensures that all of the events from both streams with the same key are sent to the same instance. This makes it possible, then, to join the two streams on that key, for example.

In this case the streams are both of type `DataStream<String>`, and both streams are keyed by the string. As you will see below, this `RichCoFlatMapFunction` is storing a Boolean value in keyed state, and this Boolean is shared by the two streams.

```java
public static class ControlFunction extends RichCoFlatMapFunction<String, String, String> {
    private ValueState<Boolean> blocked;

    @Override
    public void open(Configuration config) {
        blocked = getRuntimeContext()
            .getState(new ValueStateDescriptor<>("blocked", Boolean.class));
    }

    @Override
    public void flatMap1(String control_value, Collector<String> out) throws Exception {
        blocked.update(Boolean.TRUE);
    }

    @Override
    public void flatMap2(String data_value, Collector<String> out) throws Exception {
        if (blocked.value() == null) {
            out.collect(data_value);
        }
    }
}
```

A `RichCoFlatMapFunction` is a kind of `FlatMapFunction` that can be applied to a pair of connected streams, and it has access to the rich function interface. This means that it can be made stateful.

The `blocked` Boolean is being used to remember the keys (words, in this case) that have been mentioned on the `control` stream, and those words are being filtered out of the `streamOfWords` stream. This is *keyed* state, and it is shared between the two streams, which is why the two streams have to share the same keyspace.

`flatMap1` and `flatMap2` are called by the Flink runtime with elements from each of the two connected streams – in our case, elements from the `control` stream are passed into `flatMap1`, and elements from `streamOfWords` are passed into `flatMap2`. This was determined by the order in which the two streams are connected with `control.connect(streamOfWords)`.

It is important to recognize that you have no control over the order in which the `flatMap1` and `flatMap2` callbacks are called. These two input streams are racing against each other, and the Flink runtime will do what it wants to regarding consuming events from one stream or the other. In cases where timing and/or ordering matter, you may find it necessary to buffer events in managed Flink state until your application is ready to process them. (Note: if you are truly desperate, it is possible to exert some limited control over the order in which a two-input operator consumes its inputs by using a custom Operator that implements the [InputSelectable](https://nightlies.apache.org/flink/flink-docs-release-1.20/api/java//org/apache/flink/streaming/api/operators/InputSelectable.html)

[Back to top](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/etl/#top)

## Hands-on [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/etl/#hands-on)

The hands-on exercise that goes with this section is the [Rides and Fares](https://github.com/apache/flink-training/blob/release-1.20//rides-and-fares) .

[Back to top](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/etl/#top)

## Further Reading [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/etl/#further-reading)

- [DataStream Transformations](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/operators/overview/#datastream-transformations)
- [Stateful Stream Processing](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/stateful-stream-processing/)

---

# References

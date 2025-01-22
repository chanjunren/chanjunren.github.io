🗓️ 15012025 2227
📎

# flink_keyed_streams

```ad-abstract
One very common use case for Apache [[flink]] is to implement ETL (extract, transform, load) pipelines that

1. Take data from one or more sources
2. Perform some transformations and/or enrichments
3. Store the results somewhere
```


## `keyBy()` 

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

### Keyed State
State that is **partitioned by key** when working with a keyed stream (e.g., using `keyBy`)

```ad-info
Flink maintains a separate **key/value store** for each key, allowing state to be tied to specific keys in the stream.
```


#### `ValueState`
A simple form of keyed state where **one value per key** is stored (there are other forms)

How it Works
1. Initialization
- A `ValueStateDescriptor` is used to define the name and type of the state.
- Done in `open()`
- State is accessed via `getRuntimeContext().getState(descriptor)`.

2. Access and Update
- During processing, Flink dynamically associates the state with the key of the current event.
- Methods like `value()` and `update()` allow reading and updating the state.

#### **Distributed State Management**
- Keyed state (including `ValueState`) is **sharded across Flink nodes**, with each parallel instance managing state for its assigned keys
- The state for a key is **local** to the parallel instance handling that key and is not shared across nodes.


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

### Clearing State
If keyed state is not cleared, it will keep growing for every distinct key encountered

Therefore, keyed state should be cleared when it's no longer needed

This can be done through:
- Manual clearing
```java
keyHasBeenSeen.clear();
```
- Timers: Clear state after a period of inactivity (e.g., with ProcessFunction).
- [State Time-to-Live (TTL)](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/fault-tolerance/state/#state-time-to-live-ttl) 

### Non-keyed (Operator) State 
```ad-note
Rarely needed in user-defined functions
```
- Primarily used in implementation of sources and sinks
- Operates different

## Connected Streams 
- Pattern for allowing a single operator to process two input streams simultaneously
- Enable dynamic transformations by streaming in thresholds, rules, or parameters
- Common use cases: 
	- **Streaming joins** 
	- Advanced processing requiring interaction between two streams


![simple transformation](https://nightlies.apache.org/flink/flink-docs-release-1.20/fig/transformation.svg)
> Simple transformation

![connected streams](https://nightlies.apache.org/flink/flink-docs-release-1.20/fig/connected-streams.svg)
> Connected stream


### Keying Requirement
- Both streams must be keyed in a compatible way (same keying logic and keyspace)
- Ensures that events with the same key from both streams are **processed by the same parallel instance**
### Features
**State Sharing**:
- Connected streams can share **keyed state**.
- For example, one stream can update state, while the other uses it for processing.

**RichCoFlatMapFunction**:
- A special function that processes connected streams.
- Provides `flatMap1` for the first stream and `flatMap2` for the second stream.
- Supports **stateful processing** via the rich function interface.


### Considerations
1. **Race Conditions**:
    - The order of `flatMap1` and `flatMap2` calls is not guaranteed.
    - Flink processes events from the two streams independently, which can lead to race conditions.
    - Use managed state to buffer events if ordering is critical.
	
2. **Custom Operators**:
    - For precise control over input consumption, use a custom operator implementing `InputSelectable`.


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


## Further Reading
- [DataStream Transformations](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/operators/overview/#datastream-transformations)
- [Stateful Stream Processing](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/concepts/stateful-stream-processing/)

---

# References
- https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/learn-flink/etl/
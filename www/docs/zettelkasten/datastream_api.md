🗓️ 15012025 2139

# datastream_api

> [[flink]]'s data stream API

## What can you stream using datastream APIs?
Anything that flink can serialize

### Native serialization

Used for
- basic types, i.e., String, Long, Integer, Boolean, Array
- composite types: Java Tuples, POJOs, and Scala case classes

```ad-note
Flink recognizes a data type as a POJO type (and allows “by-name” field referencing) if the following conditions are fulfilled:

- The class is public and standalone (no non-static inner class)
- The class has a public no-argument constructor
- All non-static, non-transient fields in the class (and all superclasses) are either public (and non-final) or have public getter- and setter- methods that follow the Java beans naming conventions for getters and setters.

```

### Other serializers
- Falls back to Kryo for other types
- Avro is well supported
## Stream Execution Environment
- Context in which Flink application runs
- Starting point for building and executing Flink streaming jobs

### Job Graph
- Blueprint of data processing logic using the DataStream API
- Built and attached to the `StreamExecutionEnvironment`
- `env.execute()` - triggers packaging of graph and sending it to the `JobManager`

### JobManager
- Divides job into smaller, parallelisable tasks based on configured parallelism
- Distributes jobs to `TaskManagers`

### TaskManager
- Handles actual computation
-  Each parallel slice of your job will be executed in a _task slot_

```ad-note
A task slot represents allocated computational resources
```

![Flink runtime: client, job manager, task managers](https://nightlies.apache.org/flink/flink-docs-release-1.20/fig/distributed-runtime.svg)

## Stream Sources
Entry points for data into a Flink application.

| Type      | Description           | Example                             |
| --------- | --------------------- | ----------------------------------- |
| Bounded   | Finite data           | Files / Batch datasets              |
| Unbounded | Infinite data streams | Message queues / socket connections |

```ad-note
Can define your own data source by implementing the `SourceFunction` interface for unbounded sources or `RichSourceFunction` for advanced features
```

## Stream Sinks
Endpoints where processed data is sent or stored after computation

| Type          | Description                                 |
| ------------- | ------------------------------------------- |
| Storage       | Files, databases, distributed storage       |
| Message Queue | Kafka / Rabbit MQ                           |
| Monitoring    | Monitoring tools like Prometheus or Grafana |

## Further Reading (I haven't read this)

- [Flink Serialization Tuning Vol. 1: Choosing your Serializer — if you can](https://flink.apache.org/news/2020/04/15/flink-serialization-tuning-vol-1.html)
- [Anatomy of a Flink Program](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/overview/#anatomy-of-a-flink-program)
- [Data Sources](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/overview/#data-sources)
- [Data Sinks](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/overview/#data-sinks)
- [DataStream Connectors](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/connectors/datastream/overview/)

---

## References
- https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/datastream_api/

🗓️ 17012025 1959
📎

# flink_side_outputs

## Use Cases
- Reporting
	- Exceptions
	- Malformed events
	- Late events
	- Operational alerts, such as timed-out connections to external services
- Implement n-way split of a stream

## Example

```java
private static final OutputTag<TaxiFare> lateFares = new OutputTag<TaxiFare>("lateFares") {};
```

```java
if (eventTime <= timerService.currentWatermark()) {
    // This event is late; its window has already been triggered.
    ctx.output(lateFares, fare);
} else {
    . . .
}
```

```java
// compute the sum of the tips per hour for each driver
SingleOutputStreamOperator hourlyTips = fares
        .keyBy((TaxiFare fare) -> fare.driverId)
        .process(new PseudoWindow(Time.hours(1)));

hourlyTips.getSideOutput(lateFares).print();
```

```ad-note
Alternatively, you can use two OutputTags with the same name to refer to the same side output, but if you do, they must have the same type
```


---

# References
- https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/event_driven/#side-outputs
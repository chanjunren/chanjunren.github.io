🗓️ 31102024 1524
📎 #prometheus #observability 

# prometheus_data_types

> How to use correctly

## Gauges
- Represents a current measurement 
- Can go up or down
- e.g. memory usage

```java
// Use Set() when you know the absolute
// value from some other source.
queueLength.Set(0)

// Use these methods when your code directly observes
// the increase or decrease of something, such as
// adding an item to a queue.

queueLength.Inc() // Increment by 1.
queueLength.Dec() // Decrement by 1.
queueLength.Add(23)
queueLength.Sub(42)

// When you want to know the time of when something happened
myTimestamp.SetToCurrentTime()
```
> Gauge methods

```
# No labels
queue_length 42
```
> Exposition

```promql
# Figure out how long ago an event happened
time() - process_start_time_seconds 
```
> PromQL

## Counters
- Cummulative count over time
- Only allowed to go up

```ad-note
Counter resets - Counter resets to 0 upon restart, but this is handled gracefully with **Functions**
```

```java
totalRequests.Inc()
```
> Instrumentation methods


### Relevant functions
- Usually don't consider the absolute values
- Consider things like **What's the rate of increase here, averaged over the preceding time window?**

```ad-note
Handles counter resets gracefully by treating any decrease as a reset and corrects it as much as possible
```

| Function     | Description |
| ------------ | ----------- |
| `rate()`     |             |
| `irate()`    |             |
| `increase()` |             |

## Summaries
For tracking distributions as a percentile / quantile

```go
requestDurations := prometheus.NewSummary(prometheus.SummaryOpts {
	Name: "http_request_duration_seconds",
	Help: "A summary of HTTP Request durations in seconds",
	Objectives: map[float64]float64{
		// 50th percentile with a max absolute error of 0.05
		0.5: 0.05,
		// 90th percentile with a max absolute error of 0.01
		0.9: 0.01,
		// 99th percentile with a max absolute error of 0.0001
		0.99: 0.001
	}
})

// Summary metric will output quantiles based on a streaming algorithm
requestDurations.Observe(2.3)
```
> Constructing summaries

```
http_request_duration_seconds{quantile="0.5"} 0.052
http_request_duration_seconds{quantile="0.90"} 0.0564
http_request_duration_seconds{quantile="0.99"} 2.372
http_request_duration_seconds_sum 88364.234
http_request_duration_seconds_count 227420
```
> Exposition

## Histograms

---

# References

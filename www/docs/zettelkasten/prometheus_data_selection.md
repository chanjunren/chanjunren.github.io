🗓️ 31102024 1703
📎 #prometheus 

# prometheus_data_selection

For understanding how to select data you care about
There are two primary types of data selectors in Prometheus
- Instant Vector Selectors
- Range Vector Selectors
## Instant Vector Selectors
Selecting a SINGLE value for a set of time series 
- **Vector** - List of time series
- **Instant** - Returns the sample of the specified metric of the specified timestamp

Graph / tabular view
### Label matchers
For filtering results

```
# Equality matcher
demo_memory_usage_bytes{type="free"}

# Inequality matcher
demo_memory_usage_bytes{type!="free"}

# Regex match
demo_memory_usage_bytes{type=~"buffers|cache"}

# Regex inequality match
demo_memory_usage_bytes{type!~"buffers|cache"}

# Multiple matchers (all must match)
demo_memory_usage_bytes{type!~"buffers|cache",instance="demo-servoce-0:10000"}

```

## Visualizing Instant Vector Selector Behavior
### Lookback Delta
- Most recent sample of a specified window is selected (default 5 mins)
- Handles **stale data** (i.e last sample was very long ago )
- Time window is controlled by
```
--query.lookback-delta
```

## Staleness Makers / Handling

Staleness markers are used to indicate when a time series should be excluded from the results

Common scenarios
- Series disappears from one scrape to the next
- Target scrape fails
- Target disappears completely
- Series disappears from one rule evaluation to the next
- Entire rule group disappears permanently

## Range Vector Selectors

Usually, it make more sense to select a range of values and then perform aggregations on those values
```
# Returns all samples in the specified time period
demo_cpu_usage_seconds_total[1m]
```
- Cannot be directly graphed
- Need to feed into a function that converts the range 
```
# Per second increase of the provided time window
rate(demo_cpu_usage_seconds_total[1m])
```

Can specify selector range (time frame of which you want to fetch the values for) 

### Offsetting
Offsetting allows for comparing sets of data across different time frames, which can be useful for analyzing trends over time.

---

# References
- https://www.youtube.com/watch?v=xIAEEQwUBXQ&list=PLyBW7UHmEXgylLwxdVbrBQJ-fJ_jMvh8h&index=4 

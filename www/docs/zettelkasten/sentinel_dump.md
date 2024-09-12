🗓️ 12092024 1153
📎 #sentinel #resilience 

# sentinel_dump

## Degrade Rules Cheatsheet
### RT-based Degradation
> Triggered when average RT exceeds a threshold
- Grade: 0
- Works with `slowRationThreshold` to measure the percentage of slow calls that exceed the threshold

| Parameter             | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `count`               | Threshold in miliseconds for response time            |
| `slowRationThreshold` | Percentage of slow calls that exceed threshold        |
| `timeWindow`          | Degrade time (in seconds during which API is blocked) |
### Exception Ratio-based Degradation
> Triggered when the **error/exception ratio** of requests exceeds a given threshold
> 
> GRADE: 1

| Parameter    | Description                              |
| ------------ | ---------------------------------------- |
| `count`      | Exception ratio threshold (0.2 => 20%)   |
| `timeWindow` | Degrade time during which API is blocked |
**Use Case**: Helps to degrade a service when a significant number of requests fail.

### Exception Count-based Degradation
> Triggered when the **total number of exceptions** in a time window exceeds a given threshold
> 
> GRADE: 2

| Parameter    | Description                                              |
| ------------ | -------------------------------------------------------- |
| `count`      | Total number of exceptions that will trigger the degrade |
| `timeWindow` | Degrade time in which API is blocked                     |
 **Use Case**: Useful when you want to limit the total number of exceptions within a given time window.

### **Key Points to Remember**:

- Degradation **temporarily stops** serving requests to a particular resource if certain thresholds are exceeded, allowing the system to recover.
- **RT-based rules** prevent a service from being overwhelmed by slow responses, whereas **exception-based rules** handle situations with high error rates.
- After the **time window**, the service will try to serve requests again. If the issue persists, it may degrade again.

## Example
```json
[
  {
    "resource": " POST:http://something",
    "count": 0.15,
    "timeWindow": 5,
    "grade": 1
  },
  {
    "resource": " POST:http://something",
    "count": 1200,
    "timeWindow": 5,
    "grade": 0,
    "slowRatioThreshold": 0.2
  }
]

```

- The **first rule** will degrade the service if the **error ratio** exceeds **15%** over a 5-second period.
- The **second rule** will degrade the service if **more than 20% of requests take longer than 1.2 seconds** during a 5-second window.
---

# References

🗓️ 31102024 1149
📎 #observability #prometheus

# prometheus

```ad-summary
Metrics based system that helps you collect / record metrics from your services
```

## System Architecture

<img src="https://prometheus.io/assets/architecture.png"/>

Pull based monitoring system
1. Pulls data from a list of services 
	- List can be configured
		- Statically
		- Dynamically through service discovery
	- Can use to generate alerts through an Alertmanager
	- Or query

## Core Features

### Data model

Tracks and stores time series values (Numeric values that change over time)
> Sampled at specific points in time (prometheus pull interval)

| Term              | Description                                                                           |
| ----------------- | ------------------------------------------------------------------------------------- |
| sample            |                                                                                       |
| series            | a progression of samples                                                              |
| series identifier | metric name and a set of labels                                                       |
| metric name       | what you are trying to measure                                                        |
| label             | key-value pairs that allow you to partition a metric name into individual time series |
| target labels     |                                                                                       |
### Transfer format
```prom
# HELP http_requests_total The total number of prrocessed HTTP requests.
# TYPE http_requests_total counter
http_requests_total{status="200"} 8556
http_requests_total{status="404"} 20
http_requests_total{status="500"} 68

# HELP process_open_fds Number of open file descripttors
# TYPE process_open_fds gauge
process_open_fds 32
```

```ad-info
It is text based so that no special libraries are needed to expose metrics

```

```ad-note
The above is scraped through a HTTP endpoint
```
### Query language
> For doing useful things with data stored in TSDB

 Prom QL
- has many functions to do stuff with metrics (dimension based aggregations tec.)
	- an be 
- can be very mathy

### Alerting

Also based on PromQL
```yaml
alert: Many500Errors
expr: |
(
	sum by(path) (rate(http_requests_total{status="500"}[5m]))
/
	sum by(path) (rate(http_requests_total[5m]))
) * 100 > 5
for: 5m
labels:
	severity: "critical"
annotations:
	summary: "Many 500 errors for path {{$labels.path}} ({{$value}}%)"
```
### Service Discovery
Prometheus easily integrates with many service discovery platforms


---

# References
- https://www.youtube.com/watch?v=STVMGrYIlfg&list=PLyBW7UHmEXgylLwxdVbrBQJ-fJ_jMvh8h
- https://prometheus.io/docs/introduction/overview/
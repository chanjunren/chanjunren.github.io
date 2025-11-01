🗓️ 03092024 1125
📎 

# pool_suspension

```ad-abstract
In the context of connection pools, like HikariCP, refers to a feature or mechanism that allows the pool to temporarily stop serving new connections without immediately shutting down the pool or discarding all existing connections

```

This can be useful during maintenance or when there are temporary issues with the database that need to be resolved.

## Purpose
1. Temporary Halt
	- Prevent new transactions or operations from starting 
	- Ongoing transactions are allowed to complete.

2. Graceful Maintenance
	- Controlled maintenance
	- Recovery process without disrupting active connections
	- For example, during a database restart, the pool can be suspended to avoid connection failures until the database is back online.
## How Pool Suspension Works
1. No New Connections
> Any request to borrow a new connection will either wait or fail immediately (depending on pool configuration)

2. Existing Connections Remain Active
	-  Existing connections that are already borrowed from the pool remain active and continue to function normally
	- Allows ongoing transactions to complete without interruption

3. Reactivation
	- Once the underlying issue is resolved, or the maintenance is complete, the pool can be "resumed," allowing new connections to be borrowed again.
## Usage Scenarios

1. Database Restart or Maintenance
	- Planned or unplanned database restarts
	- Suspending the pool prevents a flood of connection attempts that would otherwise fail and cause exceptions
2. Graceful Degradation
	- In a microservices environment, when a service detects that a dependent database is down
	- Dependent DB down > suspend its connection pool to prevent unnecessary load and quickly fail fast, allowing the service to degrade gracefull
3. Resource Constraints
	- In case of temporary resource constraints (e.g., high CPU or memory usage), suspending the pool can help prevent further load on the database or application server
## Integration with HikariCP
HikariCP and Pool Suspension: HikariCP, a high-performance JDBC connection pool, does not natively support a "suspend" feature in its basic configuration. However, you can implement similar behavior by combining the following configurations and application-level controls:
Set maximumPoolSize to zero: Temporarily set the maximum pool size to zero to prevent new connections from being created. This effectively "suspends" new connections but does not impact active ones.
Connection Timeout Adjustments: Increase the connectionTimeout to a high value to avoid immediate failures when the pool is suspended.
Custom Implementation for Suspension in HikariCP:

While HikariCP does not provide built-in pool suspension, you can implement your suspension mechanism in your application logic:

---

## References
- ChatGPT
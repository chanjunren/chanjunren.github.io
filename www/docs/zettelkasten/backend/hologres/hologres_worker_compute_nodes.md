🗓️ 03022025 1348

# hologres_worker_compute_nodes
- **Workers** are the compute nodes in Hologres that process queries and manage [[hologres_storage_engine]]s
- Each worker handles multiple [[hologres_shard]]
- Each worker creates multiple internal storage engines and each storage engine reads data from and writes data to a shard

```ad-note
If you do not specify the number of table groups and shard count when you create a database, Hologres creates a default table group for you and sets the default shard count for the table group


For more information, see [Instance types](https://www.alibabacloud.com/help/en/hologres/user-guide/instance-management-types/#concept-2042629)
```


## Resource Allocation
- Hologres Shards are distributed evenly across workers to ensure balanced resource usage
- Prevents uneven resource allocation where a table group is allocated to one worker and other workers are idle

```ad-warning
If the shard count is not proportional to the number of workers, some workers may become idle
```

## Failover Handling
- If a worker fails, its shards are reallocated to healthy workers to maintain even distribution
-  The query engine can access data on shards by calling these operations to implement high-performance data writes or reads

---
## References
- https://www.alibabacloud.com/help/en/hologres/user-guide/table-group-and-shard-count
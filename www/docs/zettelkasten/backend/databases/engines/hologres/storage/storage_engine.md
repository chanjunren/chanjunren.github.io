🗓️ 03022025 1344

# storage_engine

> **Storage Engine (SE)**: The Hologres worker component that manages data and CRUD operations for shards. ([Hologres documentation](https://www.alibabacloud.com/help/en/hologres/user-guide/basic-concepts))

- The **storage engine** in Hologres manages data on [[shard]] and provides CRUD  operations
- It is responsible for high-performance data writes and reads

```mermaid
sequenceDiagram
  participant QE as Query Engine
  participant SE as Storage Engine
  participant Shard
  participant Pangu
  QE->>SE: Read or write request
  SE->>Shard: Operate on shard data
  Shard->>Pangu: Persist or fetch data
  Pangu-->>Shard: Data blocks
  Shard-->>SE: Rows or write result
  SE-->>QE: Result
```
![Relationship diagram](https://help-static-aliyun-doc.aliyuncs.com/assets/img/en-US/6049589661/p511561.png)
## **Relationship with Shards**
- Each worker creates multiple storage engines, with each engine handling one shard.
- Storage engines are evenly distributed across workers to ensure balanced resource usage.

## **Performance Considerations**
- Proper configuration of shard counts and table groups ensures efficient resource allocation and high concurrency.
- Improper configuration can lead to uneven resource usage and performance degradation.

---
## References
- https://www.alibabacloud.com/help/en/hologres/user-guide/table-group-and-shard-count

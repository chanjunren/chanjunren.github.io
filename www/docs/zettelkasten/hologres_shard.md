🗓️ 03022025 1236
📎

# hologres_shard

- A **shard** is a physical storage unit in Hologres, where data is stored and processed.
- Shards are managed by [[pangu]]

![Relationship diagram](https://help-static-aliyun-doc.aliyuncs.com/assets/img/en-US/6049589661/p511561.png)
## Shard Allocation
- When a table is created, it is assigned to a table group, and data is distributed to specific shards.
- Each shard has a unique ID within an instance.

#### **Shard Count and Workers**
- Shards are distributed across **worker compute nodes** for parallel processing.
- The number of shards should be proportional to the number of workers to ensure balanced resource allocation.

## **Failover Handling**
- If a worker fails, its shards are reallocated to healthy workers to maintain even distribution.

---
# References
- https://www.alibabacloud.com/help/en/hologres/user-guide/table-group-and-shard-count
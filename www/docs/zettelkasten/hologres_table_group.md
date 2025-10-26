🗓️ 03022025 1236

# hologres_table_group
- In Hologres, data is stored in shards on [[pangu]]
    
- **Table groups** are logical storage units used to manage shards
- Each table group contains a fixed number of shards
- When a table is created:
	- It is assigned to a table group
	- Data is distributed to specific shards based on [[hologres_distribution_key]]
    
```ad-note
A table group is a unique concept in Hologres and differs from PostgreSQL's **tablespace** (which identifies storage locations)

```

![Layout of table groups](https://help-static-aliyun-doc.aliyuncs.com/assets/img/en-US/5049589661/p512067.png)
## Key Relationships

### Table Groups and Schemas
> Tables in different schemas can belong to the same table group, sharing the same underlying shards

### Table Groups and Databases
- A database contains one or more table groups
- By default, Hologres creates one table group per database, but you can add more or modify the default
        
### Table Groups and Shards
- Shards are not shared between table groups
- Each shard has a unique ID within an instance

### Shard Count
- The number of shards in a table group is **fixed at creation** and cannot be changed later
- To change the shard count, you must create a new table group
        
### Tables and Shards
    
- Data in a table is distributed to shards based on the distribution key
- Without a distribution key, data is randomly allocated

### Table Groups and Tables
- Multiple tables can belong to the same table group, but a table cannot belong to multiple table groups.
- Tables cannot be moved to another table group unless re-created or moved using a specific function.

---
## References
- https://www.alibabacloud.com/help/en/hologres/user-guide/basic-concepts
🗓️ 31012025 1649
📎

# hologres_architecture

- [[hologres]] adopts the [[storage_disaggregation_architecture]] 
- Uses [[pangu]] as the storage system

![Hologres architecture](https://help-static-aliyun-doc.aliyuncs.com/assets/img/en-US/3403915561/p431174.png)


## Computing layer
    
### Frontend (FE)
- An FE authenticates, parses, and optimizes SQL statements
- A Hologres instance has multiple FEs

```ad-note
Hologres is ecologically compatible with PostgreSQL 11. You can use the standard PostgreSQL syntax for development or use PostgreSQL-compatible development tools and Business Intelligence (BI) tools to connect to Hologres.
```
        
### HoloWorker
#### [[hologres_qe]]
#### SE
- SE manages and processes data
- Allows you to perform create, read, update, and delete (CRUD) operations on data
### Cache
The Cache component caches query results to improve query performance

#### HOS Scheduler
Provides lightweight scheduling capabilities.

### Meta Service
- Manages metadata and provides metadata for FEs
- Metadata includes table structures and data distribution on SE.

### Holo Master

```ad-abstract
Hologres is natively deployed in a Kubernetes cluster
		
If a worker node in the cluster is faulty, the cluster creates another worker node within a short period to ensure worker node-level availability
```

Holo Master maintains component availability within each worker node
> If a component enters an abnormal state, Holo Master restarts the component within a short period to recover the services provided by the component.
        
## Storage layer
- Hologres data is stored in the [[pangu]] file system.
- Hologres can access MaxCompute data that is stored in Pangu
- Pangu implements efficient mutual access between Hologres and MaxCompute
- Hologres can access the data in Object Storage Service (OSS) and Data Lake Formation (DLF) to accelerate analysis in data lakes
        

---

# References
- https://www.alibabacloud.com/help/en/hologres/product-overview/architecture
- Summarised by ChatGPT
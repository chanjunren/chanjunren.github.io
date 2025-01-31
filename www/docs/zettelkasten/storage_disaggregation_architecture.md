🗓️ 31012025 1657
📎 #wip 

# storage_disaggregation_architecture

A.K.A Compute-Storage Separation (Storage Disaggregation Architecture)

```ad-summary
The Compute-storage separation (or storage disaggregation) architecture decouples the 
- compute layer (responsible for data processing) 
- the storage layer (responsible for data persistence)

Allowing them to scale independently
```
- Ideal for 
	- **real-time data processing systems**
	- **cloud-native platforms**
	- **data-intensive applications** where dynamic resource allocation, cost-efficiency, and fault tolerance are critical.

## Key Features
### Decoupling of Compute and Storage Layers
#### Compute Layer
Handles real-time or batch data processing tasks 
- aggregations
- transformations
- analytics

Compute nodes are typically ephemeral, processing data in memory for low-latency performance

#### Storage Layer
Handles 
- persistent storage of raw data
- intermediate results
- processed outputs using **distributed file systems** (e.g., Alibaba Cloud’s Pangu, OSS, or HDFS).

### Independent Scaling
    
- Compute resources (CPU, memory) can be scaled independently based on workload demands.
- Storage resources (disk capacity, I/O throughput) can grow as needed without affecting compute operations.

### Resource Optimization
- Pay-as-you-go
> Only pay for active compute processing and persistent storage separately.

- Avoid overprovisioning 
> Done by dynamically allocating resources based on real-time demands.

### Fault Tolerance and Reliability
    
- Persistent storage ensures data integrity even if compute nodes fail or restart
- State snapshots and checkpoints are stored in the storage layer for recovery during failures.

### Elasticity and Cost Efficiency
- **Compute workloads can be scaled up or down** during traffic spikes without overcommitting storage resources.
- Persistent data storage remains unaffected by compute resource scaling
> Reducing costs compared to tightly coupled architectures

### Performance Optimization
- High-performance compute nodes can process large-scale data without being constrained by local disk capacity
- Modern storage solutions (e.g., OSS, Pangu) provide fast access, allowing efficient streaming and batch operations.

## How the Architecture Works
### 1 - Data Ingestion
    
- Raw data is ingested from storage systems such as OSS, Kafka, or HDFS.
- State snapshots and intermediate results during processing are saved periodically to distributed storage.

###  2 - Processing
    
- Compute nodes (e.g., Flink clusters) process the data in-memory for low-latency computations.
- Ephemeral compute nodes execute real-time processing tasks like anomaly detection, aggregation, and transformation.
### 3 - Persistent Storage
    
- Raw data, checkpoints, and processing results are stored in persistent layers (e.g., OSS, Pangu, or RDS).
- This decoupling ensures that even during a node failure, the system can quickly restart processing by recovering state from the storage layer.
## Advantages of Compute-Storage Separation
### Elasticity
Independent scaling of compute and storage enables efficient handling of dynamic workloads (e.g., traffic spikes).
    
### Cost Efficiency
Storage and compute are billed separately, avoiding overprovisioning commonly seen in tightly coupled systems.
    
### High Performance
High-performance compute nodes interact with distributed storage systems to deliver low-latency results.
    
### Fault Tolerance:
Persistent storage ensures reliable recovery during failures, with state snapshots available for resuming processing.

---

# References
- ChatGPT
🗓️ 13012025 1722
📎

# compute_storage_separation_architecture

A **compute-storage separation architecture** is an architectural design where the **compute layer** (responsible for processing data) and the **storage layer** (responsible for storing data) are decoupled, enabling them to scale independently and optimize performance, cost, and flexibility.

This architecture is commonly adopted in cloud-native platforms, including Alibaba Cloud's **Realtime Compute for Apache Flink**, to meet the demands of real-time analytics and data-intensive applications.

### Key Features of Compute-Storage Separation

1. **Decoupling**:
    
    - The **compute layer** handles data processing tasks such as transformations, aggregations, and analytics.
    - The **storage layer** is responsible for persisting raw data or results, typically using distributed file systems, object storage, or databases.
2. **Independent Scaling**:
    
    - Compute resources (CPU, memory) can be scaled up or down based on the complexity and volume of data processing.
    - Storage resources (disk space, storage throughput) can be scaled independently to handle the growth in data volume.
3. **Resource Optimization**:
    
    - Applications can pay for exactly what they use: compute power for active processing and storage capacity for long-term data retention.
    - Resources are utilized more efficiently, avoiding overprovisioning or underutilization.
4. **Fault Tolerance and Reliability**:
    
    - Data is safely stored in a persistent storage layer, which remains intact even if compute nodes fail.
    - Compute nodes can be replaced or restarted without losing data.

---

### Advantages of Compute-Storage Separation in Flink

1. **Elasticity**:
    
    - Since compute and storage scale independently, you can handle bursty workloads (e.g., during peak processing times) by dynamically allocating additional compute resources.
    - Storage remains persistent and unaffected by changes in compute workloads.
2. **Cost Efficiency**:
    
    - In traditional tightly coupled architectures, compute and storage scale together, often leading to overprovisioning.
    - With separation, you only pay for the compute resources when processing is required, and storage is billed separately based on usage.
3. **Performance**:
    
    - High-performance compute nodes can process data from shared storage systems without being limited by local disk capacity.
    - Modern storage systems (like Alibaba Cloud OSS or HDFS) provide fast access to data, enabling efficient streaming and batch processing.
4. **Disaster Recovery and Backups**:
    
    - Persistent storage ensures that data is not lost even if the compute nodes are disrupted.
    - This makes it easier to restart Flink jobs or recover from failures.
5. **Flexibility**:
    
    - You can use different storage systems for various data needs (e.g., OSS for raw logs, RDS for structured results) while keeping the compute layer unchanged.

---

### How Compute-Storage Separation Works in Realtime Compute for Apache Flink

1. **Compute Layer**:
    
    - Flink jobs are deployed on compute clusters that execute data processing tasks.
    - Compute nodes are ephemeral; they process data in real-time and typically handle in-memory computations for low-latency processing.
2. **Storage Layer**:
    
    - Persistent data (e.g., raw input data, intermediate results, state snapshots) is stored in distributed storage solutions like:
        - **OSS (Object Storage Service)** for storing raw data or checkpoint/snapshot files.
        - **HDFS** for structured data in big data systems.
        - **Kafka** for input and output streams in real-time processing.
3. **State Management**:
    
    - Flink uses **state backends** (e.g., RocksDB or Memory) for managing job states during processing.
    - In a compute-storage-separated setup, Flink's state snapshots are periodically persisted to the storage layer, allowing state recovery during failures.
4. **Workflow**:
    
    - Data is ingested from storage (e.g., OSS, Kafka).
    - Compute nodes process the data in-memory or with minimal intermediate storage.
    - Processed results are written back to the storage layer or forwarded to downstream systems.

---

### Example Use Case:

Imagine a real-time fraud detection system:

1. **Input**: Transaction data streams into Kafka.
2. **Compute**: Flink processes transactions in real-time to detect anomalies.
3. **Storage**:
    - Raw transaction logs are stored in OSS for future analysis.
    - Checkpoints and snapshots are saved in OSS or HDFS for recovery.
    - Anomaly detection results are stored in RDS for reporting.

In this setup, the compute and storage layers are completely separate, providing scalability, reliability, and cost efficiency.

---

### Why Alibaba Cloud Uses This Architecture for Flink:

- Cloud-native design aligns with scalability and elasticity requirements.
- Provides seamless integration with Alibaba Cloud's storage products like OSS, Tablestore, and HDFS.
- Supports a wide range of real-time and batch processing workloads effectively.

---

# References

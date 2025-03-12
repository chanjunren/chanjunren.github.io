🗓️ 07032025 1549
📎

# lambda_architecture
> batch + streaming hybrid, considered a subset of streaming architecture

Lambda Architecture is designed to **handle both batch and real-time data** by using **two parallel processing paths**:

- **Batch Layer** → For large-scale, historical data processing.
- **Speed (Real-time) Layer** → For real-time, low-latency queries.
- **Serving Layer** → Combines results from both layers to provide a unified output.

## How It Works
### Batch Layer (Historical Processing)
- Stores all incoming data.
- Runs **batch jobs** periodically (e.g., using Hadoop, Apache Spark, MaxCompute).
    - Generates precomputed **views** for fast querying.
### Speed Layer (Real-Time Processing)
- Processes **streaming data** in real time (e.g., Apache Kafka, Apache Flink, Spark Streaming).
- Stores recent results for fast access.
### Serving Layer (Query Engine)
- Merges outputs from both the **batch** and **speed layers**.
- Provides **a unified view** for applications and dashboards.


|**Pros**|**Cons**|
|---|---|
|✅ **Combines batch + streaming** for accurate & real-time insights|❌ **Complex** – Maintaining two separate processing paths is harder|
|✅ **Scalable & fault-tolerant**|❌ **Data Duplication** – Requires logic to merge batch & real-time results|
|✅ Works well for applications needing **historical & real-time analytics**|❌ Latency in batch layer – Real-time results may differ slightly from batch|

## When to Use Lambda Architecture?

- When you need **both real-time and historical** processing.
- When **batch processing is critical** (e.g., regulatory reporting, financial transactions).
- When you want **fault tolerance** and the ability to **recompute historical data**.

---
# References

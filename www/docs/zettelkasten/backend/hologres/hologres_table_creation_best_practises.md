🗓️ 03022025 1403

# hologres_table_creation_best_practises

1. Choose the Right [[hologres_distribution_key]]
    - Select a column with **high cardinality** and **evenly distributed values** as the distribution key.
    - This ensures data is evenly distributed across shards, preventing **data skew** and improving query performance for JOINs and GROUP BY operations.
2. Set an Appropriate Shard Count
    - The [[hologres_shard]] count should be proportional to the number of [[hologres_worker_compute_nodes]] in your instance.
    - Avoid setting the shard count higher than the number of **computing cores** in your instance to prevent resource contention.
        
3. Assign Tables to the Correct [[hologres_table_group]]
    - Place related tables in the same table group to enable **local joins**, which are faster and more efficient.
    - Avoid creating unnecessary table groups, as each shard occupies memory, even if unused.
        
4. Consider Data Volume and Query Patterns
    - For small datasets (e.g., thousands of rows), set the shard count to **1** to minimize overhead.
    - For large datasets or high-concurrency workloads, increase the shard count to improve parallelism.

---
## References

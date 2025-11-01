🗓️ 03022025 1603

# hologres_specific_tables

> Type of tables specific to [[hologres_]]

## Parent Partitioned Table

> A logical table that divides data into smaller, more manageable pieces called **partitions**

- Each partition is a separate physical table, but queries can target the parent table to access all partitions or specific ones

### Use Cases

- Managing large datasets, especially time-series or batch data
- Improving query performance by scanning only relevant partitions

## Foreign Table

> A table that references data stored outside Hologres, such as in an external database or file system (e.g., MaxCompute, OSS, or PostgreSQL)

Hologres can query the data in the foreign table as if it were stored locally, but the data remains in the external system

### Use Cases

- Querying data from external systems without needing to import it into Hologres
- Integrating with other data sources for federated queries
  Example: Querying data stored in MaxCompute or OSS (Object Storage Service) directly from Hologres

---

## References

- Deepseek

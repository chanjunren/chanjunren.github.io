🗓️ 17102026 2135

# product_overview

Hologres is Alibaba Cloud's distributed real-time data warehouse for SQL analytics and data-serving workloads.

It combines a PostgreSQL-compatible SQL interface with a distributed execution layer, several table storage orientations, and integrations with Alibaba Cloud data services. That makes it useful for workloads that need both analytical queries and operational data access, but the product's specific compatibility and performance guarantees depend on the feature and deployed version.

When learning Hologres, separate three decisions:

- **Where data comes from:** ingestion, foreign tables, or lake integrations.
- **How tables are laid out:** see [[storage_modes]], [[distribution_key]], and [[clustering_key]].
- **How SQL executes:** see [[compute_storage_architecture]] and [[query_engine]].

Avoid applying a single storage layout to every workload. Point lookups, broad scans, aggregations, and mixed access patterns can benefit from different table orientations and keys.

## Related notes

- [[table_creation_best_practises]] — table property choices
- [[sql_optimization]] — query tuning concepts
- [[specific_tables]] — local and external table forms

## References

- [Hologres: Product overview](https://www.alibabacloud.com/help/en/hologres/product-overview/what-is-hologres)
- [Hologres: Architecture](https://www.alibabacloud.com/help/en/hologres/product-overview/architecture)

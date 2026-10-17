🗓️ 17102026 2135

# indexes

In Hologres, table properties control where rows are distributed, how rows are organized within shards, and which extra indexes accelerate filters.

These settings are selected for query patterns and can have write, storage, and operational costs:

- [[distribution_key]] routes rows to shards and affects data locality for joins and lookups.
- [[clustering_key]] orders data within a shard to help range scans and filtering.
- [[segment_key]] is the note's original name for the event-time organization setting; use current product terminology and version docs when configuring it.
- Bitmap indexes and dictionary encoding can help selected filters, but consume resources during ingestion and storage.

Do not configure every property by default. Start from the queries that matter, choose table orientation and distribution first, then evaluate clustering and secondary indexes with representative data. Some layout properties are fixed at table creation, so confirm which can be changed before committing to a schema.

## Related notes

- [[table_creation_best_practises]] — scenario-based table configuration
- [[sql_optimization]] — query plans and bottlenecks
- [[storage_modes]] — row, column, and hybrid storage

## References

- [Hologres: Best practices for table properties](https://www.alibabacloud.com/help/en/hologres/user-guide/guide-on-scenario-specific-table-creation-and-tuning)
- [Hologres: Create tables](https://www.alibabacloud.com/help/en/hologres/developer-reference/create-tables)

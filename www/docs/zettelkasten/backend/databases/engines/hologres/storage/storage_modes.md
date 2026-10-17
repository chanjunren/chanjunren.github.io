🗓️ 17102026 2135

# storage_modes

Hologres table orientation chooses how column values are physically organized for the table's workload.

The documented orientations include `column`, `row`, and `row,column`. Column orientation suits scans and aggregations over selected columns; row orientation suits point lookups and writes that access a complete row; hybrid orientation supports mixed access patterns with product-specific tradeoffs. Confirm feature availability and restrictions for the Hologres version and table type in use.

```sql
CREATE TABLE example (...) WITH (orientation = 'column');
```

Older Hologres examples may set table properties through `set_table_property`. Prefer the current syntax and product documentation for the deployed release rather than combining examples from different versions.

## Related notes

- [[storage_engine]] — physical storage context
- [[table_creation_best_practises]] — table design choices

## References

- [Hologres: Storage models of tables](https://www.alibabacloud.com/help/en/hologres/user-guide/storage-models-of-tables)

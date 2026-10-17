🗓️ 27052025 1356

# warehouse_naming_conventions

Warehouse names should communicate a model's purpose and lineage. Prefixes and suffixes can encode those roles, but their meanings belong to a project's naming contract; there is no universal abbreviation set.

| Term | Definition | Source |
|---|---|---|
| **Fact table** | A table that stores measurements or events for analysis, with each row representing a chosen level of detail. | [Microsoft: Fact tables](https://learn.microsoft.com/fabric/data-warehouse/dimensional-modeling-fact-tables) |
| **Dimension table** | A table that stores descriptive attributes, such as customer or product details, for filtering and grouping analytical records. | [Microsoft: Dimensional modeling](https://learn.microsoft.com/en-us/fabric/data-warehouse/dimensional-modeling-overview) |

```mermaid
flowchart LR
  S[Source data] --> T[Staging models]
  T --> I[Intermediate transformations]
  I --> M[Fact and dimension models]
  M --> R[Reporting or serving models]
```

## What names can express

- **Processing role**: source-aligned, staging, intermediate, analytical, or serving.
- **Business subject**: the entity, event, or measure represented.
- **Row detail**: one row per order, order line, customer, or reporting period.
- **Lifecycle**: temporary, snapshot, incremental, or retained history, when useful.

For example, `staging_orders`, `fact_order_lines`, and `customer_dimension` communicate different roles. These are illustrative names, not required formats. A project may use another vocabulary or encode the role in schemas and metadata instead.

Agree on names with the people producing and consuming the data. Document abbreviations, grain, refresh behavior, and retention rules in the project contract. Avoid encoding details that can change often or are already stored as table metadata.

## References

- [dbt: Intermediate model naming and purpose](https://docs.getdbt.com/best-practices/how-we-structure/3-intermediate)
- [Microsoft: Dimensional modeling overview](https://learn.microsoft.com/en-us/fabric/data-warehouse/dimensional-modeling-overview)
- [Microsoft: Fact tables](https://learn.microsoft.com/fabric/data-warehouse/dimensional-modeling-fact-tables)

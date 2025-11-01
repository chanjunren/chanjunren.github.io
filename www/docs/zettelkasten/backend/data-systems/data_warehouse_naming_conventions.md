🗓️ 27052025 1356

# data_warehouse_naming_conventions
## Common Layer Prefixes

| Prefix | Meaning                    | Usage                                                                                                      |
| ------ | -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `ods_` | **Operational Data Store** | Raw, unprocessed data ingested from sources (e.g., logs, Kafka, RDS dumps). Often partitioned by day/hour. |
| `dwd_` | **Data Warehouse Detail**  | Cleansed and detailed data, usually 1:1 with business events/entities. Normalized and enriched.            |
| `dws_` | **Data Warehouse Summary** | Aggregated data for specific business domains. Used for reporting, metrics, dashboards.                    |
| `ads_` | **Application Data Store** | Final layer used directly by applications or APIs (reports, dashboards, downstream services).              |
| `dim_` | **Dimension Table**        | Lookup tables with descriptive attributes (e.g., `dim_user`, `dim_region`).                                |
| `tmp_` | **Temporary Table**        | Intermediate tables used in ETL processing. Not meant for long-term use.                                   |
| `rpt_` | **Report Table**           | Tables generated specifically for business reports, often updated on schedule.                             |

## Suffixes / Contextual Tags

| Suffix / Tag       | Meaning                    | Notes                                                                                                              |
| ------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `_di`              | **Daily Incremental**      | Updated once per day, may include only changes (upserts/inserts).                                                  |
| `_fi`              | **Full Incremental**       | Full daily snapshot, usually for slowly changing dimensions or syncs.                                              |
| `_ri`              | **Real-Time Incremental**  | Updated in near-real-time, often with Flink/Kafka pipelines.                                                       |
| `_hi`              | **Historical Incremental** | Stores historical data with full SCD (slowly changing dimension) support. Usually partitions over long time spans. |
| `_full`            | Full Snapshot              | Typically refers to a full data snapshot without incremental logic.                                                |
| `_bak` / `_backup` | Backup Table               | Used for temporary backups, often before destructive operations.                                                   |

---
## References
- ChatGPT
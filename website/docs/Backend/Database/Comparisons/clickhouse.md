---
sidebar_position: 1
sidebar_label: ClickHouse
---

# ClickHouse

## Use Cases

- Large-scale data analytics and processing: ClickHouse can rapidly process tens of billions to hundreds of billions of data, supporting high concurrency queries and data aggregation, making it an ideal choice for big data analytics and processing.
- Real-time analysis and reporting: ClickHouse can perform real-time queries and analyses on massive data in milliseconds, quickly generating real-time reports and analysis results.
- Log analysis: Efficiently stores and analyzes large amounts of log data, enabling quick data finding and filtering, improving log analysis efficiency.
- Time-series data storage and querying: Suitable for real-time data analysis and processing in IoT, finance, telecommunications, etc.

## Advantages

- Good read performance, an order of magnitude higher than Elasticsearch in equivalent configurations.
- High write performance, five times that of Elasticsearch under similar conditions.
- Saves storage space, using only one-sixth the storage space of Elasticsearch for the same amount of data.
- Supports SQL language, low learning cost.

## Disadvantages

- Does not support transactions.
- Not adept at querying based on primary keys at row granularity (although supported), hence should not be used as a Key-Value database.
- Not adept at deleting data by row (more suited for batch deletions).
- Inferior in full-text search compared to Elasticsearch.
- Low concurrency, generally below 100.

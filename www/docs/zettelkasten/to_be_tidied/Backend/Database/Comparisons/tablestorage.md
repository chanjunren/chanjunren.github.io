---
sidebar_position: 8
sidebar_label: Table Storage
---


# Table Storage

## Use Cases

- Internet applications: Widely used in daily life for shopping, socializing, gaming, etc. Table storage architecture can meet most business needs of internet applications, including historical order data, IM (instant messaging), and Feed stream (production and consumption of message streams).
- Big data: Characterized by large scale, diverse data types, rapid generation, immense value but low density. Table storage data lake architecture effectively addresses storage and analysis challenges in big data, including recommendation systems, and public opinion & risk control analysis.
- IoT: Helps in operational monitoring and monitoring of environments and people in IoT scenarios, supporting high-concurrency writes and data storage for numerous devices and systems, and decision analysis.

## Advantages

- Multi-model data storage: Supports wide column, time series, message, and other data storage models, enabling integrated storage of various data types.
- Diversified data indexing: Besides primary key querying, it supports secondary and multi-dimensional indexing, providing powerful data querying capabilities.
  - Secondary indexing: Equivalent to providing another sorting method for data tables, pre-designing data distribution for query conditions to speed up data retrieval.
  - Multi-dimensional indexing: Based on inverted indexing and columnar storage, supports multi-field combination queries, fuzzy queries, geographic location queries, full-text search, etc., solving complex querying challenges in big data.
- Seamless expansion: Through data sharding and load balancing, storage can be seamlessly expanded. As table data volumes grow, table storage adjusts data partitioning to allocate more storage. Supports at least 10PB of data storage, with a single table capable of storing at least 1PB or 1 trillion records.
- Strong data consistency: Guarantees strong consistency in data writes, ensuring all three data replicas are written to disk and kept consistent. Once a write operation succeeds, the application can immediately read the latest data.
- High concurrency for read and write: Unlike ES and HBase, it has strong capabilities for both reading and writing.

## Disadvantages

- Inconvenient resizing: Once a fixed configuration is purchased, resizing (upgrading or downgrading) isn't straightforward and requires data migration.
- Delay in multi-dimensional index querying (1-3 seconds).

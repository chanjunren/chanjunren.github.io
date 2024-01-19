---
sidebar_position: 3
sidebar_label: HBase
---


# HBASE

## Introduction

Cloud database HBase is a key-value/wide table distributed database suitable for any data scale. It can provide millisecond response performance, especially excels in low-cost, high-concurrency scenarios, and supports horizontal scaling to PB-level storage and tens of millions of QPS. Cloud database HBase is a low-cost, highly scalable, cloud-intelligent big data NoSQL, compatible with standard HBase access protocols, offering low-cost storage, high scalability throughput, and intelligent data processing.

## Use Cases

- Semi-structured or unstructured data: HBase supports dynamic addition of columns.
- Very sparse records: RDBMS rows have a fixed number of columns, and columns with null values waste storage space. As mentioned, HBase does not store columns with null values, saving space and improving read performance.
- Multi-version data: As mentioned, values located by Rowkey and Columnkey can have any number of version values, making HBase very convenient for data requiring storage of change history. For example, an author’s Address, which changes, generally only the latest value is needed for business, but sometimes historical values may be required.
- Extremely large data volumes.

## Advantages

- Strong consistency model: When a write operation is confirmed, all users will read the same value.
- Reliable automatic scaling: Regions with too much data will automatically split, using HDFS for distributed storage and data backups.
- Built-in recovery feature: Uses WAL for data recovery.
- Well-integrated with Hadoop: MapReduce works intuitively on HBase.

## Disadvantages

- Slow WAL recovery.
- Complex and inefficient recovery in case of exceptions.
- Requires resource-intensive and IO-intensive Major compaction.
- Does not support cold-hot data separation.


# VII. ClickHouse

## Use Cases

- Large-scale data analytics and processing: ClickHouse can rapidly process tens of billions to hundreds of billions of data, supporting high concurrency queries and data aggregation, making it an ideal choice for big data analytics and processing.
- Real-time analysis and reporting: ClickHouse can perform real-time queries and analyses on massive data in milliseconds, quickly generating real-time reports and analysis results.
- Log analysis: Efficiently stores and analyzes large amounts of log data, enabling

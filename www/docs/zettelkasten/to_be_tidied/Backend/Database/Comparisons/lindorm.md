---
sidebar_position: 4
sidebar_label: Lindorm
---


# Lindorm

## Introduction
Lindorm is a cloud-native, multi-model, hyper-converged database designed and optimized for IoT, Internet, and Vehicular networks. It supports unified access and fusion processing of various data types like wide tables, time series, text, objects, streams, spatial, etc. It's compatible with SQL, HBase/Cassandra/S3, TSDB, HDFS, Solr, Kafka, and other standard interfaces, integrating seamlessly with third-party ecosystem tools. It's suitable for logs, monitoring, billing, advertising, social, travel, risk control, etc.

## Use Cases
- Semi-structured or unstructured data.
- Very sparse records.
- Multi-version data.
- Extremely large data volumes: Lindorm’s read scenarios are most suited for primary key queries. A few fixed query conditions can use secondary index solutions. For scenarios requiring various condition combination queries, a search index needs to be established (using technology similar to ES). For instance:
  - **Explore**: Mainly stores transactions, logs, and other on-chain data, processed data, and business-required data for browsers and on-chain eye business lines.
  - **Market Data**: Mainly stores market data.

## Advantages
- Superior write performance compared to ES, which requires various indexes, as Lindorm’s write model is more lightweight.
- Real-time primary key queries.
- Strong scalability, supports horizontal scaling to thousands of nodes.
- Supports storage separation of cold and hot data.
- Compatible with HBase, Cassandra, S3, TSDB, HDFS, Solr, etc., and supports wide tables, time series, objects, text, queues, spatial, and other data models.

## Disadvantages
- Limited transaction support: only supports row-level transactions (updates).
- Non-primary key multi-dimensional random queries have eventual consistency (Lindorm).

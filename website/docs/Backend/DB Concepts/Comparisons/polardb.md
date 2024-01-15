---
sidebar_position: 5
sidebar_label: PolarDB
---


# PolarDB

## Introduction to PolarDB
- Backed by Alibaba Cloud PolarDB.

## Use Cases
- General OLTP, similar to MySQL.
- Used in businesses such as:
  - **Wallet_web3**: Mainly stores wallet-related data, wallet addresses, etc.

## Advantages
- 100% compatible with MySQL, can be upgraded from RDS to PolarDB with one click (within the same Alibaba Cloud account).
- Large capacity: instances up to 100TB, single tables can support up to 50T (maintaining minor performance loss within 6 billion rows).
- Separate scalability for compute and storage nodes.
- High availability and reliability, data security guaranteed.
- Shared distributed storage design thoroughly solves the issue of non-strong consistency in backup data due to asynchronous replication in Master-Slave setups, ensuring zero data loss in the entire database cluster during any single point of failure.
- Multi-Availability Zone architecture, with data backups in multiple zones, providing disaster recovery for databases.
- Strong consistency (three copies in distributed storage), enables read-write separation.

## Disadvantages
- Cross-Availability Zone failures involve minute-level switch time (due to computation node retrieval).
- Higher cost: A PolarDB cluster with the same configuration is more expensive than RDS (from 25% to 125% more).
- Strong consistency in multi-Availability Zone backups impacts performance (around 15%).
- During the one-click upgrade from RDS to PolarDB, there might be ongoing connections to the old instance.
---
sidebar_position: 2
sidebar_label: ElasticSearch
---

# ES (Elasticsearch)

## Use Cases
- Search
- Statistics
- In our company, the use cases are broadly as follows:
  - **Trading Counter**: Mainly stores historical bills, orders, order cancellations, K-line data points, growth data, and other business-related data.
  - **Explore**: Uses ES to store blocks, transactions (index-related), internal transactions, token transfers, addresses, tokens, token holdings, logs (indexed), and other index-related data.
  - **Funds**: Mainly stores asset analysis data and historical transaction records.
  - **Wallet**: Mainly stores transaction data.
  - **NFT**: Mainly stores NFT assets and transaction history.

## Advantages
- Capable of storing massive amounts of data.
- Effective read scenarios under various query conditions.

## Disadvantages
- Reading from ES can have certain delays.
- Principle: ES writes first to memory, and the data in memory is periodically flushed to disk to form files. Only data that has been written to disk can be queried; data in memory cannot be queried, hence the read delay issue.
- No locks, no transactions.
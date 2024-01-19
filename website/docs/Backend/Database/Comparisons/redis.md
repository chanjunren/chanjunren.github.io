---
sidebar_position: 7
sidebar_label: Redis
---


# Redis

## Use Cases
- Caching
- Storing business data
- Distributed locks
- Counters and leaderboards
- Real-time messaging
  - Redis's publish/subscribe feature is suitable for real-time message pushing, ideal for chat rooms, real-time push notifications, etc.
- Most of our business uses Redis for caching data, but some also directly store business data, such as trade mark prices, buy and sell prices, dollar prices, etc. Some use Redis for pub-sub notification features, like push.

## Advantages
- Fast: All Redis data is stored in memory, allowing rapid access and data operations, with very fast read/write speeds.
- Versatility: Redis supports various data structure types, including strings, hash tables, lists, sets, and sorted sets, meeting different data storage needs.
- High concurrency: Redis supports high concurrent access and can handle numerous requests simultaneously.
- Scalability: Redis can be horizontally scaled using clusters to meet higher performance needs.
- Persistence: Redis offers various persistence options, including snapshots and log append, which can recover data upon server restart.
- Rich features: Redis supports advanced features like publish/subscribe patterns, Lua scripts, etc., meeting complex application requirements.

## Disadvantages
- Data volume limitation: Since all Redis data is stored in memory, its data volume is limited by memory capacity. Large data volumes require clustering Redis, which increases cost and complexity.
- No transaction support: Redis does not support ACID transactions, hence cannot guarantee data integrity and consistency.
- Limited storage format: Redis does not support storing structured data and cannot perform complex data queries and analyses like traditional relational databases.


🗓️ 29042026 2030
📎 #kafka #messaging #streaming

# kafka_architecture

> The structural model that explains Kafka's throughput, ordering guarantees, and operational behaviour. Knowing the parts (broker, topic, partition, consumer group, offset) is the prerequisite for every other Kafka discussion.

## The Building Blocks

```ad-abstract
**Broker** — a single Kafka server. Brokers form a cluster.
**Topic** — a named channel of messages. Logical category.
**Partition** — a topic is split into N partitions. Each partition is an append-only log on disk, owned by one broker (the **leader**) and replicated to others (**followers**).
**Producer** — writes messages to a topic; each message lands in exactly one partition.
**Consumer** — reads messages from one or more partitions.
**Consumer Group** — a set of cooperating consumers; partitions are divided among them so each partition is consumed by exactly one member.
**Offset** — monotonically increasing position within a partition; identifies a message uniquely.
```

## The Mental Model

```
Topic "orders" with 3 partitions:

partition 0: [m0][m1][m2][m3][m4][m5]...    ← leader: broker A, followers: B, C
partition 1: [m0][m1][m2][m3]...            ← leader: broker B, followers: A, C
partition 2: [m0][m1][m2][m3][m4]...        ← leader: broker C, followers: A, B

Producer P writes to topic "orders":
  - hash(key) → picks a partition
  - leader of that partition appends + replicates to followers
  - acks back to producer

Consumer Group "billing" with 2 members:
  member-A → partitions 0, 1
  member-B → partition 2

Each partition consumed by exactly one member of the group.
```

## Why Partitions Matter

Partitions are the unit of:

- **Parallelism** — N partitions = N concurrent consumers in a group.
- **Ordering** — order is preserved *within* a partition, not across the topic.
- **Throughput** — adding partitions adds parallel write/read capacity.
- **Replication** — each partition has its own replica set.

This is also why partition count is hard to undo. Adding partitions changes the hash mapping (`partition = hash(key) mod N`), which can break per-key ordering for in-flight messages. See [[kafka_partition_ordering_keying]].

## Replication and ISR

For each partition, `replication.factor` (e.g. 3) brokers hold a copy. One is the leader; others are followers.

The **In-Sync Replica set (ISR)** is the subset of replicas currently caught up to the leader. The leader only acknowledges writes when they've been replicated to all members of the ISR (with `acks=all`).

If a follower lags too long (`replica.lag.time.max.ms`), it's removed from the ISR. If the leader fails, a new leader is elected from the ISR.

`min.insync.replicas` (typically 2 with RF=3) caps how small the ISR can shrink before writes start failing — preserves durability at the cost of availability under partial failures.

## Offsets and Commit

Each consumer tracks its position via offsets. Two relevant ones:

- **Log end offset (LEO)** — next position the leader will append.
- **High watermark (HW)** — the offset up to which all ISR members have replicated. Consumers can only read up to HW (prevents reading uncommitted data that may be lost on leader change).

Consumer commits its offset (back to Kafka, in `__consumer_offsets` topic) to mark progress. On restart or rebalance, it resumes from the committed offset.

**Auto-commit vs manual commit:**
- Auto-commit (default): Kafka commits offsets at intervals. Simple but can replay or skip messages on crash.
- Manual commit: app commits after processing. More control, more code.

## Storage Model

Each partition is a sequence of **segment files** on the broker's disk:

```
/var/log/kafka/orders-0/
  00000000000000000000.log    ← messages 0–999999
  00000000000000000000.index  ← offset → file position
  00000000000001000000.log    ← messages 1000000–1999999
  ...
```

Old segments deleted (or compacted) per the topic's retention policy:

- `cleanup.policy=delete` + `retention.ms` / `retention.bytes` → time- or size-based deletion.
- `cleanup.policy=compact` → keep the latest message per key (used for changelogs, e.g. `__consumer_offsets`).
- Both can be combined.

## ZooKeeper → KRaft

Kafka historically used ZooKeeper to store metadata (broker list, topic configs, ISR info). Modern Kafka (3.x+) uses **KRaft** — Kafka's own Raft-based metadata quorum, replacing ZooKeeper. Operationally simpler (one cluster instead of two).

You may still encounter ZooKeeper-mode clusters; the architectural concepts are identical. See [[raft]] for the consensus layer KRaft is built on.

## Producer Knobs Worth Knowing

| Knob               | Effect                                                              |
|--------------------|---------------------------------------------------------------------|
| `acks=0`           | Fire and forget. Highest throughput, can lose data.                 |
| `acks=1`           | Leader-only ack. Loss possible if leader fails before replication.  |
| `acks=all`         | Wait for full ISR. Strongest durability.                            |
| `enable.idempotence=true` | Producer assigns sequence numbers; broker dedupes retries on the partition. Required for [[delivery_semantics_at_most_at_least_exactly]]'s exactly-once. |
| `max.in.flight.requests.per.connection` | Higher = throughput, but >1 risks reordering on retry without idempotence. |

## Consumer Knobs Worth Knowing

| Knob                      | Effect                                                          |
|---------------------------|-----------------------------------------------------------------|
| `fetch.min.bytes`         | Wait for batch before returning. Throughput vs latency.         |
| `max.poll.records`        | How many messages per `poll()` call.                            |
| `enable.auto.commit`      | Whether Kafka commits offsets on a timer.                       |
| `session.timeout.ms`      | Member is considered dead after this long without heartbeat.    |

## Common Pitfalls

- **Confusing topic-level and partition-level ordering** — only per-partition ordering is guaranteed.
- **Setting partition count too low** — bottlenecks future scaling. Hard to add later without breaking ordering.
- **`acks=1` with `replication.factor=3`** — looks safe, isn't. Leader can crash before followers catch up; the ack lied.
- **`enable.auto.commit=true` + business logic that can fail mid-batch** — auto-commit may move offsets past unprocessed messages. Use manual commit for reliability.
- **Treating Kafka as a queue** — it's a distributed commit log. Messages stay until retention, regardless of consumption. Reprocessing is intentional, not a bug.
- **Per-message overhead** — Kafka is optimised for batches. Single-message writes/reads waste throughput.
- **Compacted topic without keys** — compaction by key requires keys. Null-key messages on compacted topics are dropped in compaction.

## Related

- [[kafka_partition_ordering_keying]] — keying strategy and ordering guarantees.
- [[delivery_semantics_at_most_at_least_exactly]] — durability semantics in Kafka.
- [[exactly_once_semantics]] — Kafka's exactly-once feature.
- [[kafka_cli_cheatsheet]] — operational commands.
- [[idempotent_consumer_pattern]] — at-least-once delivery requires consumer-side dedup.
- [[raft]] — the consensus protocol behind KRaft mode.

---

## References

- Kafka docs: [Architecture](https://kafka.apache.org/documentation/#design)
- Kreps, "The Log: What every software engineer should know about real-time data's unifying abstraction" (2013)
- "Kafka: The Definitive Guide" (Narkhede et al.)

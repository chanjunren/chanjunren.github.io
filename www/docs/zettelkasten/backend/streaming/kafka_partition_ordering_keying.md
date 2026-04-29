🗓️ 29042026 2045
📎 #kafka #messaging #ordering

# kafka_partition_ordering_keying

> Kafka guarantees ordering only within a partition. The partition key chosen at produce time determines which entities share an ordering boundary — and getting the key wrong is the source of most "events arrived out of order" production incidents.

## The Ordering Guarantee

```ad-abstract
**Within a single partition**, messages are strictly ordered by offset.
**Across partitions of the same topic**, no ordering is guaranteed — concurrent consumption sees an arbitrary interleaving.
```

There is no "topic-wide order" knob. Topic-wide order means **single partition** — which means single-consumer parallelism.

## How a Message Picks Its Partition

The producer (Java client default) decides:

1. **Explicit partition** in the `ProducerRecord` → use it.
2. **Non-null key** → `partition = murmur2(key) % numPartitions`. Same key always goes to the same partition (until partition count changes).
3. **Null key** → **sticky partitioner** (modern default): batch a stream of messages to the same partition for throughput, switch periodically. Older clients used round-robin per message.

## Choosing a Key

The key is the **ordering boundary**. Same key = same partition = guaranteed order across those messages.

| Use case                       | Reasonable key                              |
|--------------------------------|----------------------------------------------|
| Order events for a single user | `user_id`                                    |
| Account ledger entries          | `account_id`                                 |
| State changes per IoT device    | `device_id`                                  |
| Order events for a specific order | `order_id`                                |
| Tenant-scoped events           | `tenant_id` (then sort within consumer)      |

The key's cardinality should be ≥ partition count, ideally much higher. With 12 partitions and only 3 distinct keys, 9 partitions sit idle.

## Trade-offs of Key Cardinality

| Cardinality           | Effect                                                       |
|-----------------------|--------------------------------------------------------------|
| Low (e.g. by region)  | Few partitions get traffic. Ordering preserved per region but throughput is partition-bound. |
| High (e.g. user_id)   | Even spread, parallelism = partition count. Per-user order preserved. |
| Very high (e.g. UUID per message) | Effectively random. Parallelism maxed. **No useful ordering** — every message is its own group. |

## What Breaks Ordering

### 1. Adding partitions

`partition = hash(key) % N`. Going from N=12 to N=18 changes `hash(key) % 18` for most keys, sending some `user_42` messages to a new partition while old ones still ride the old partition. Per-user order is broken for the transition window.

Mitigations:
- Avoid increasing partition count if order matters. Pre-provision more partitions than you need.
- For systems where this is a real concern, use a custom partitioner with a stable mapping (e.g. consistent hashing).
- Cassandra and other systems use a "virtual partition" or "slot" concept to decouple key→partition from broker count. Kafka does not.

### 2. Producer retries with `max.in.flight.requests > 1`

A failed-then-retried message can land *after* messages produced after it. Idempotent producer (`enable.idempotence=true`) fixes this by stamping sequence numbers — the broker rejects out-of-order retries.

### 3. Consumer parallelism within a partition

Two threads of the same consumer reading the same partition will see messages in offset order, but processing them concurrently can finalise side effects out of order. If you parallelise consumer-side, you've effectively recreated the multi-partition ordering problem.

### 4. Cross-partition consumer logic

If your consumer reads from 6 partitions and merges results based on timestamp, the merge is best-effort. Network jitter and consumer lag mean a fresh message on partition 1 may arrive before an older message on partition 5.

## Strategies for Strict Total Order

If you need topic-wide total order:

- **Single partition** — only choice that gives true total order. Throughput capped at single-partition speed.
- **Topic-per-entity** — one topic per entity (extreme cardinality). Doesn't scale to millions of entities.
- **Reorder downstream** — accept arbitrary delivery order, sort by attached sequence number in the consumer. Adds complexity and a buffering window.
- **Don't actually need total order** — most systems need per-key order, not topic-wide. Question the requirement.

## Common Pitfalls

- **Conflating topic order with partition order** — most Kafka discussions implicitly mean per-partition; rare requirements need topic-wide and pay for it.
- **Null keys with order requirements** — sticky partitioner batches to one partition for a while, but messages then move to another partition. Ordering is not guaranteed for null-key streams.
- **Partition count "we'll add later"** — adding partitions later breaks per-key ordering. Pre-provision generously.
- **Reusing a key for unrelated entities** — same key sends both to same partition; ordering between them now matters when it shouldn't. Pick keys per entity domain.
- **`max.in.flight=5` without idempotence** — retries can reorder.
- **Custom partitioner that ignores key** — the producer must agree with the consumer on what "same key" means. A custom partitioner that randomises silently breaks every downstream assumption.

## Related

- [[kafka_architecture]] — partition / consumer-group fundamentals.
- [[delivery_semantics_at_most_at_least_exactly]] — what "exactly-once" means with respect to ordering.
- [[exactly_once_semantics]] — Kafka idempotent producer + transactions.
- [[idempotent_consumer_pattern]] — surviving duplicate or out-of-order delivery.
- [[consistent_hashing]] — the "stable mapping" shape Kafka does *not* provide.

---

## References

- Kafka docs: [Producer configuration](https://kafka.apache.org/documentation/#producerconfigs)
- Confluent: [Order matters: how Kafka guarantees ordering](https://www.confluent.io/blog/apache-kafka-message-ordering/)

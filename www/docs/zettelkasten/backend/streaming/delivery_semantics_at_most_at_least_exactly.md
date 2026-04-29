🗓️ 29042026 2100
📎 #messaging #kafka #delivery_semantics

# delivery_semantics_at_most_at_least_exactly

> The three delivery guarantees a messaging system can offer between producer and consumer. The labels are simple; the implementation cost increases steeply from left to right, and "exactly-once" is famously misunderstood.

## The Three Guarantees

```ad-abstract
**At-most-once** — every message is delivered 0 or 1 times. Loss is possible; duplication is not.
**At-least-once** — every message is delivered 1 or more times. Duplication is possible; loss is not.
**Exactly-once** — every message is delivered exactly 1 time. No loss, no duplication.
```

## At-most-once

```
producer → send → forget
consumer → receive → process → no ack required
```

Producer doesn't retry on failure. Consumer doesn't track position carefully. If anything fails, the message is gone.

**Implementation**: producer with `acks=0` (Kafka), or fire-and-forget UDP-style messaging. Consumer with auto-commit before processing.

**Use cases**: telemetry where some loss is fine (95% of metrics events are enough). Logs at very high volume where duplicates would be expensive.

**Cost**: cheapest by far. No retries, no dedup state.

## At-least-once

```
producer → send → wait for ack → retry on failure
consumer → receive → process → ack only after success
```

Producer keeps retrying until acked. Consumer commits offsets only after processing. If processing succeeds but the ack/commit fails, the message is redelivered.

**Implementation**: most messaging systems' default. Kafka with `acks=all`, retries enabled, manual offset commit after processing.

**Use cases**: nearly all production systems. Ledger entries, business events, anything where loss is unacceptable.

**Cost**: medium. Retries on failure; consumer must handle duplicates idempotently.

## Exactly-once

The interesting one. Two distinct flavours.

### Within a single system (Kafka exactly-once)

Kafka 0.11+ provides **transactional exactly-once within Kafka**:

```
- Producer: enable.idempotence=true
  → producer assigns sequence numbers per partition
  → broker dedupes retries on the partition
- Producer: transactional.id set
  → atomic write across multiple partitions/topics
- Consumer: isolation.level=read_committed
  → only sees committed transactions
- Stream processor: read-process-write atomic
  → input offsets committed in same Kafka transaction as output writes
```

This gives "exactly-once *processing*" for the read-process-write loop **as long as you stay inside Kafka**. See [[exactly_once_semantics]].

### End-to-end across systems

Kafka's exactly-once does not extend to your DB, your S3 bucket, your downstream HTTP service. The moment a side effect leaves Kafka, exactly-once becomes the application's responsibility.

The standard pattern: **at-least-once delivery + idempotent consumer** = effectively exactly-once. The consumer dedupes via business key, message ID, or idempotency key:

```
process(message):
  if processedRepo.exists(message.id):
    return                      # already done
  doBusinessWork(message)
  processedRepo.save(message.id)   # in same DB transaction
```

If `doBusinessWork` fails, the txn rolls back including the dedup record → message will be retried. If it succeeds and the broker re-delivers (because ack was lost), the second attempt sees the dedup record and skips. See [[idempotent_consumer_pattern]].

## What Breaks Exactly-once Claims

- **Side effects on external systems** — sending an email, charging a card. Once the side effect happens, you can't pretend it didn't.
- **Non-idempotent consumers** — at-least-once + non-idempotent = effectively at-least-once with bugs.
- **Distributed transactions across DB and broker** — XA / 2PC works in theory, hated in practice. See [[two_phase_commit]].
- **Clock-based dedup** — "skip if seen in last N minutes" fails when retries straddle the window.

## Choosing

| Need                              | Choice                                                    |
|-----------------------------------|------------------------------------------------------------|
| Telemetry, sampled logs           | At-most-once                                              |
| Anything with business value      | At-least-once + idempotent consumer                        |
| Read-process-write entirely in Kafka | Exactly-once with transactional API                    |
| Cross-system pipeline             | At-least-once + idempotency keys + [[outbox_pattern]]      |

## Common Pitfalls

- **Treating "exactly-once" as a checkbox** — it's a property of the *whole pipeline*, not the message broker alone. The weakest link defines the guarantee.
- **Idempotent producer ≠ exactly-once delivery** — it dedupes producer retries on a single partition, not consumer-side processing.
- **`acks=all` ≠ at-least-once** — if the producer doesn't retry on failure, you can still drop messages. Configure both.
- **Auto-commit + manual processing** — auto-commit moves offsets on a timer regardless of processing. Use manual commit for at-least-once.
- **Dedup state TTL too short** — if your dedup window is 1 hour but a retry storm spans 2 hours, you'll process duplicates. Size for worst-case retry scenarios.
- **Confusing "delivered" vs "processed"** — Kafka guarantees delivery; your code is responsible for "processed exactly once". Idempotency at the consumer is the mechanism.

## Related

- [[exactly_once_semantics]] — deep dive on Kafka's exactly-once feature.
- [[idempotent_consumer_pattern]] — the universal solution to at-least-once duplication.
- [[outbox_pattern]] — at-least-once publication with DB-atomic origination.
- [[kafka_architecture]] — the building blocks these semantics depend on.
- [[two_phase_commit]] — the alternative most teams reject for cross-system atomicity.

---

## References

- Confluent: [Exactly-Once Semantics in Apache Kafka](https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/)
- Kreps, ["Why local state is a fundamental primitive in stream processing"](https://www.oreilly.com/radar/why-local-state-is-a-fundamental-primitive-in-stream-processing/)
- "Designing Data-Intensive Applications" ch. 11

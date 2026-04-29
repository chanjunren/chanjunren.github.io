🗓️ 29042026 2115
📎 #messaging #patterns #idempotency

# idempotent_consumer_pattern

> The standard fix for at-least-once delivery: track which messages have been processed, skip duplicates. Pairs with [[outbox_pattern]] on the producer side and is the practical answer to "how do you achieve exactly-once?" without distributed transactions.

## Why You Need It

Production messaging is at-least-once: brokers retry on ack loss, consumers retry on processing failure, network partitions cause duplicates. A consumer that processes a payment twice — even just once a year — is a bug. Idempotency makes the consumer safe under any number of redeliveries.

## The Pattern

Add a dedup record per processed message, in the same database transaction as the business work. Re-delivery sees the dedup record and skips.

```java
@Transactional
public void handle(Event event) {
  if (processedEventRepo.existsById(event.id())) {
    log.info("[idempotent_consumer] skip duplicate, eventId={}", event.id());
    return;
  }
  doBusinessWork(event);
  processedEventRepo.save(new ProcessedEvent(event.id(), Instant.now()));
}
```

Three properties make this work:

1. **Atomic** — the dedup record commits with the business write. If business fails, dedup rolls back too; the message will be retried correctly.
2. **Durable** — the dedup record survives consumer restarts. State lives in the DB, not in memory.
3. **Indexed on a stable ID** — the message has a unique identifier the consumer can recognise across redeliveries.

## Choosing the Idempotency Key

The key must be **stable across retries** of the same logical event.

| Source                       | Suitability                                                   |
|------------------------------|---------------------------------------------------------------|
| Kafka `(topic, partition, offset)` | Stable per delivery, but a producer retry creates a new offset for the same logical event. |
| Producer-assigned UUID       | Best for exactly-once intent. Produced with the event, never changes. |
| Business key (e.g. `order_id + event_type`) | Strong invariant; multiple events for the same business state collapse correctly. |
| Hash of payload              | Catches accidental redeliveries; misses semantic duplicates with different bytes. |

The right answer is usually **producer-assigned UUID + business key as fallback**. The UUID handles broker-level retries; the business key handles application-level idempotency (e.g. "two requests to charge the same order").

## Schema

```sql
CREATE TABLE processed_event (
  event_id     VARCHAR(64) PRIMARY KEY,
  consumer     VARCHAR(64) NOT NULL,    -- which consumer processed it
  processed_at TIMESTAMP NOT NULL,
  INDEX idx_consumer_time (consumer, processed_at)
);
```

- PK on `event_id` → fast existence check + unique constraint as safety net (race-proof).
- `consumer` column for multi-consumer scenarios where the same event flows to many handlers.
- `processed_at` for TTL cleanup.

## Cleanup

Dedup tables grow unbounded. Strategies:

- **Time-based purge** — `DELETE FROM processed_event WHERE processed_at < now() - interval '7 days'`. Pick the window long enough that no retry could plausibly arrive after it.
- **Partitioned table** — partition by month, drop old partitions. Faster than DELETE.
- **Tiered storage** — recent in DB, older archived. Rarely worth the complexity.

The cleanup window must exceed your **maximum retry horizon**. If your producer retries for up to 24 hours and the broker holds messages for 7 days, the dedup window must be at least 7 days.

## Race-proof Variant

The check-then-insert above can race under concurrent delivery to the same consumer instance:

```
T1: SELECT exists(eventId) → false
T2: SELECT exists(eventId) → false   ← race
T1: INSERT processed_event(eventId)
T2: INSERT processed_event(eventId)  ← unique key violation
```

Two race-proof patterns:

1. **Insert-first** — try to insert dedup record first; on unique-violation, skip. The DB constraint becomes the synchronisation primitive:
   ```java
   try {
     processedEventRepo.save(new ProcessedEvent(event.id()));
   } catch (DuplicateKeyException e) {
     return;  // already processed
   }
   doBusinessWork(event);
   ```
   Caveat: if `doBusinessWork` fails after the insert succeeds, the dedup record persists and the message will never be reprocessed. Wrap both in a single transaction.

2. **Pessimistic lock per key** — `SELECT ... FOR UPDATE` on the event ID before processing. Slower but correct.

In practice, version 1 inside a single `@Transactional` method handles both correctness and races.

## Spring + MyBatis Note

Make `@Transactional` work for this pattern:

- Method must be `public` (Spring proxy limitation — see [[concurrency_control]] and Spring rules).
- Don't catch and swallow the `DuplicateKeyException` outside the transaction boundary; that risks committing the dedup record without the business write.
- The dedup repo and business repo must use the same transaction manager.

## Common Pitfalls

- **Idempotent consumer for non-idempotent business logic** — if the business write itself isn't idempotent (e.g. "increment counter by 1"), the dedup record is the only protection. A bug in dedup handling becomes a real correctness bug.
- **Dedup TTL shorter than retry horizon** — message redelivered after the dedup record was purged. Process runs twice. Size the TTL conservatively.
- **Storing dedup in the broker** (Kafka exactly-once mode) and *also* in the DB — overhead without added safety. Pick one.
- **Using auto-incrementing IDs as the dedup key** — auto-increment differs across producer retries. Use producer-assigned UUIDs.
- **Not making the dedup write atomic with the business write** — common mistake. Two separate transactions = race window where business succeeded but dedup didn't.
- **Cross-service idempotency** — when one event causes downstream calls to other services, each downstream call also needs an idempotency key. Propagate it.

## Related

- [[outbox_pattern]] — producer side; this zettel is the consumer side.
- [[delivery_semantics_at_most_at_least_exactly]] — at-least-once + this pattern ≈ exactly-once in practice.
- [[exactly_once_semantics]] — Kafka transactional alternative for read-process-write loops.
- [[saga_pattern]] — every saga step's consumer should be idempotent.
- [[message_queue]] — the broader messaging primitive.

---

## References

- Microservices.io: [Idempotent Consumer](https://microservices.io/patterns/communication-style/idempotent-consumer.html)
- "Microservices Patterns" (Chris Richardson) ch. 3
- Stripe API: [Idempotent Requests](https://docs.stripe.com/api/idempotent_requests)

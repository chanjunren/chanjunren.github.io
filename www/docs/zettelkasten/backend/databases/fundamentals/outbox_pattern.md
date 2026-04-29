🗓️ 29042026 1815
📎 #distributed_systems #messaging #patterns

# outbox_pattern

> How to atomically commit a DB write + publish a message, when your DB and your message broker are separate systems. The standard solution to the **dual-write problem**.

## The Dual-Write Problem

A service handles "place order":

```java
@Transactional
public void placeOrder(Order order) {
  orderRepository.save(order);          // DB write
  kafkaProducer.publish("order_placed", event);  // message broker
}
```

Looks atomic. Isn't.

| Failure point                     | Result                                              |
|-----------------------------------|-----------------------------------------------------|
| Crash after DB save, before publish | Order in DB, no event. Downstream never knows.    |
| Publish before commit (any order) | Crash after publish but before commit → ghost event. |
| `@Transactional` doesn't span Kafka | Kafka publish ignores the DB transaction entirely.|

You cannot solve this by reordering. The DB and Kafka are independent systems with no shared transaction.

## The Outbox Solution

```ad-abstract
Write the event into an `outbox` table **inside the same DB transaction** as the business write. A separate process reads the outbox and publishes to the broker, marking each row as sent.
```

```
TRANSACTION:
  INSERT INTO orders (...) VALUES (...);
  INSERT INTO outbox (id, topic, payload, created_at) VALUES (...);
COMMIT;
```

The outbox row commits atomically with the business data. Either both are persisted, or neither — pure ACID.

A relay process picks up unsent outbox rows and publishes them:

```
SELECT * FROM outbox WHERE published_at IS NULL ORDER BY id;
publish each to Kafka;
UPDATE outbox SET published_at = now() WHERE id IN (...);
```

If the relay crashes between "publish" and "UPDATE", the next run republishes — events may be sent **twice** but never **lost**. This pushes the burden onto consumers: they must be **idempotent**.

## CDC Variant (no application polling)

Instead of an app process polling the outbox, use Change Data Capture:

```
Debezium ──reads MySQL binlog──► Kafka topic
```

App writes outbox row → CDC tool reads the binlog change → publishes to Kafka. No polling, no relay code in the app.

**Pros**: less code, lower latency than polling.

**Cons**: operational complexity (Debezium cluster, schema evolution). Often a fixed cost worth paying once for many services.

## Polling vs Tailing the Log

| Method     | Mechanism                                  | Latency | Operational cost |
|------------|--------------------------------------------|---------|------------------|
| Polling    | App `SELECT` from outbox every X ms        | poll-interval | Low (just app code) |
| Log tailing (CDC) | Read DB binlog/WAL via Debezium etc. | sub-second | Higher (CDC infra) |

Both are valid. Start with polling for one or two services; introduce CDC when the pattern is repeated across many services.

## Handling Duplicates Downstream

The outbox guarantees **at-least-once delivery**. Consumers must dedupe.

Standard pattern: **idempotent consumer**.

```java
@Transactional
public void handle(OrderPlacedEvent event) {
  if (processedEventRepo.existsById(event.id())) {
    return;  // already processed
  }
  doBusiness(event);
  processedEventRepo.save(new ProcessedEvent(event.id()));
}
```

The processed-event check + business work + record-as-processed all share one DB transaction → re-delivery is safe.

## Schema Considerations

```sql
CREATE TABLE outbox (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  aggregate_id VARCHAR(64) NOT NULL,    -- which entity
  topic        VARCHAR(128) NOT NULL,
  payload      JSON NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  INDEX idx_unpublished (published_at, id)
);
```

- PK = monotonically increasing → preserves event order.
- Index on `published_at IS NULL` → fast poll for unsent rows.
- Old published rows can be archived or deleted after a TTL — but be careful, deletion order may interact with replication lag.

## Common Pitfalls

- **`@Transactional` does not protect a Kafka publish** — Spring's transaction doesn't bind to the broker, so the publish goes through regardless of DB commit or rollback. The outbox is the fix because it writes the event to the *same* DB.
- **`@TransactionalEventListener` (Spring) is not the same** — it defers in-process listeners until commit but doesn't help with cross-system publish. The listener still issues an unprotected Kafka call. Combine: have the listener write the outbox row.
- **Outbox does not give exactly-once** — at-least-once delivery. Pair with idempotent consumers (or [[exactly_once_semantics]]) downstream.
- **Ordering is bounded** — outbox PK gives total order per producer; Kafka partition key (often `aggregate_id`) preserves per-entity order downstream. Cross-entity order is not preserved.
- **Outbox table growth** — periodic cleanup of published rows via cron + TTL. Keep a few hours/days for redelivery scenarios.
- **Polling vs CDC** — start with polling for one or two services. Move to CDC when the per-service polling burden compounds and the team can operate Debezium.

## Related

- [[saga_pattern]] — outbox is how each saga step reliably publishes its event.
- [[exactly_once_semantics]] — what consumers downstream still have to enforce.
- [[two_phase_commit]] — the heavyweight alternative outbox replaces.
- [[message_queue]] — outbox is producer-side; consumer side handles dedup.

---

## References

- Microservices.io: [Transactional Outbox](https://microservices.io/patterns/data/transactional-outbox.html)
- Debezium docs: [Outbox Pattern with Debezium](https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html)
- "Microservices Patterns" (Chris Richardson) ch. 3

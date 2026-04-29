🗓️ 29042026 1300
📎 #api #patterns #idempotency

# idempotency_keys_api_design

> The mechanism that turns a non-idempotent API operation (POST a charge, send a transfer, place an order) into something safe to retry. The client supplies a unique key per logical operation; the server stores the result keyed by it; replays return the cached result instead of re-executing.

## The Pattern

### Client side

```http
POST /charges HTTP/1.1
Idempotency-Key: 7f8e9c10-1234-4567-89ab-cdef01234567
Content-Type: application/json

{ "amount": 1000, "currency": "USD" }
```

The client generates a UUID (or any unique value) and reuses it across retries of the same logical operation. The header name `Idempotency-Key` is convention, popularised by Stripe.

### Server side

```sql
CREATE TABLE idempotency_record (
  key           VARCHAR(64)  PRIMARY KEY,
  request_hash  VARCHAR(64)  NOT NULL,    -- detect "same key, different body"
  response_code INT          NOT NULL,
  response_body TEXT         NOT NULL,
  created_at    TIMESTAMP    NOT NULL,
  status        VARCHAR(16)  NOT NULL     -- IN_PROGRESS / COMPLETED
);
```

On each request:

1. Look up the key.
2. **Found, status=COMPLETED** → return the stored `response_code` + `response_body`. Do not execute again.
3. **Found, status=IN_PROGRESS** → another request is processing this key. Either wait, or return 409 Conflict ("retry shortly"), depending on the API contract.
4. **Found, but `request_hash` differs** → return 422 Unprocessable Entity. Same key with different payload is a client bug; refuse silently re-executing under either body.
5. **Not found** → insert with status=IN_PROGRESS (atomically — unique constraint catches races), execute the operation, store the response, mark COMPLETED.

The dedup record is updated **atomically with the business write**. Either both commit or both roll back. See [[idempotent_consumer_pattern]] for the same idea on the message-bus side.

## Worked Example: Charging a Card

Without idempotency:

```
client → POST /charges {amount: 100} → server starts, charges card
server → response → never reaches client (network blip)
client → retries → POST /charges {amount: 100} → server charges card AGAIN
```

Two charges. Customer angry.

With idempotency keys:

```
client → POST /charges Idempotency-Key: K1 {amount: 100} → server stores K1, charges card, stores response
server → response → never reaches client
client → retries → POST /charges Idempotency-Key: K1 {amount: 100}
server → finds K1, returns stored response
```

One charge. Customer happy.

## Where the Key Comes From

| Source                               | Pros / Cons                                                  |
|--------------------------------------|--------------------------------------------------------------|
| **Client-generated UUID per logical op** | Standard. Strong, unambiguous.                          |
| **Client-generated business key** (e.g. `order_id`) | Reuses domain identifier. Risky if the client could submit two different real operations with the same business key. |
| **Server-generated, returned to client** | Two-step: client GETs a key, then POSTs with it. Extra round-trip. Used in some payment APIs.  |
| **Hash of request body**             | Doesn't distinguish "I deliberately want to charge this same body again" from "I'm retrying". Avoid. |

Default to client-generated UUID per intent.

## TTL — How Long to Remember

Long enough to outlast every plausible retry path:

- Client retries (SDK + user retries) — typically minutes to hours.
- Network buffer / queue retention — depends on stack.
- Operator manual replays during incident response — can be hours to days.

Common default: **24 hours**. Stripe uses 24 hours. After that, the same key is treated as a fresh request.

Cleanup pattern:

```sql
DELETE FROM idempotency_record WHERE created_at < NOW() - INTERVAL '24 HOURS';
```

Run as a periodic job. Partition the table by date for cheap drops at high volume.

## Race-Proofness

Two concurrent requests with the same key can race:

```
T1: lookup K → not found
T2: lookup K → not found
T1: INSERT K, status=IN_PROGRESS
T2: INSERT K, status=IN_PROGRESS  ← unique constraint violation
```

The unique constraint is the synchronisation primitive. T2 catches the violation and re-reads the record. By then T1 may be IN_PROGRESS (T2 should wait or return 409) or COMPLETED (T2 returns the stored response).

Implementation pattern:

```java
try {
  repo.insertInProgress(key, requestHash);
} catch (DuplicateKeyException e) {
  IdempotencyRecord existing = repo.findByKey(key);
  if (!existing.requestHash().equals(requestHash)) return error(422, "key reused");
  if (existing.status() == COMPLETED) return existing.response();
  return error(409, "in progress, retry");
}
// proceed with business work, then update record to COMPLETED
```

## Idempotency Key vs Idempotent Method

[[http_methods_idempotency_safety]] talks about *protocol-level* idempotency: PUT and DELETE are inherently idempotent because their semantics are state-replacing. POST is not, by spec.

Idempotency keys are an **application-level** mechanism for forcing protocol-non-idempotent methods to behave idempotently. Different layer, complementary.

## Boundary Cases

- **Same key, modified body** — return 422. The client made a mistake; don't quietly accept either request.
- **Key reused for genuinely different operation** — same as above. Reject.
- **Operation succeeded but server crashed before storing the response** — on retry, key not found, operation runs again. Need: (a) atomic record-write with business work, OR (b) tolerate small probability of double-execute and design business work itself idempotently.
- **Long-running operation** — IN_PROGRESS lasts seconds-to-minutes. Concurrent retry sees IN_PROGRESS → 409. Client backs off and retries; eventually sees COMPLETED.
- **Asynchronous operation** — return 202 Accepted with the key as the operation identifier. Subsequent GETs of the operation use the key as the path parameter.
- **Distributed transactions** — idempotency keys are a key piece of [[saga_pattern]] step idempotency.

## Common Pitfalls

- **Storing only the success response** — error responses also need to be idempotent. A retry that returned 422 yesterday should still return 422 today.
- **Fingerprinting only request body, not headers** — if the operation depends on `Authorization` (different user) or `User-Agent`, the same key from different contexts could collide.
- **TTL too short** — manual operator retries during a long incident exceed the window. Be generous.
- **TTL too long** — storage growth + risk of accidental key collisions across deployments. Document the window in API docs.
- **Updating the record outside a transaction** — business write succeeds, idempotency record fails to update → next retry runs the business write again.
- **Using auto-increment IDs as the key** — auto-increment shifts across retries; your "same operation" key isn't stable. Use UUIDs.
- **Letting clients pick weak keys** — short integers, predictable patterns. Document UUID / 32-char minimum.
- **Forgetting to scope the key** — same key from two different users. Scope by `(user_id, key)` or include user identity in the lookup.
- **Treating keys as authentication** — they aren't. Don't expose data based on key knowledge alone.

## Related

- [[http_methods_idempotency_safety]] — protocol-level idempotency this layers on.
- [[retry_backoff_jitter]] — what idempotency keys make safe.
- [[idempotent_consumer_pattern]] — same pattern on the messaging side.
- [[outbox_pattern]] — pairs with idempotent consumers downstream.
- [[saga_pattern]] — every saga step needs an idempotency key.
- [[http_status_codes_semantics]] — 409 / 422 specifically.

---

## References

- Stripe API: [Idempotent Requests](https://docs.stripe.com/api/idempotent_requests)
- IETF draft: [The Idempotency-Key HTTP Header Field](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/)
- Adyen, PayPal, AWS APIs all implement variants of this pattern.

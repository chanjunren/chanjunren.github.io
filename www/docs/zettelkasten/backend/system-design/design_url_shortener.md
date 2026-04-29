🗓️ 29042026 1400
📎 #system_design #design

# design_url_shortener

> The canonical first system-design problem. Useful precisely because the surface looks trivial — `short → long` lookup — but the realistic version forces decisions about ID generation, caching, sharding, and analytics.

## 1. Requirements

### Functional
- Shorten a long URL → return a short URL (`example.com/abc123`).
- Visit a short URL → 302 redirect to the long URL.
- Optional: custom alias (`example.com/my-link`).
- Optional: expiry, click analytics.

### Non-functional
- High availability (links must redirect; downtime = broken links across the internet).
- Low latency redirect (target < 100 ms p99).
- Read-heavy: 100:1 read-to-write ratio.
- Eventual consistency on analytics, strong on the mapping itself (a freshly created link must redirect immediately).
- Mappings effectively permanent (no auto-deletion unless TTL set).

## 2. Capacity

(Detailed math in [[back_of_envelope_estimation]].)

- 100M new links/day → ~1k writes/s.
- 10B redirects/day → ~100k reads/s (peak ~3× avg → 300k reads/s).
- 5-year storage: 200B mappings × 500 bytes ≈ 100 TB.
- Hot working set (Pareto 80/20): ~1 TB → sharded Redis.
- Read bandwidth: 100k × 500 bytes ≈ 50 MB/s. Trivial.

These numbers determine the architecture: caching mandatory, DB sharded, read path is the bottleneck.

## 3. API

```
POST /shorten
  Auth: optional API key (rate-limited if anon)
  Body: { "long_url": "...", "custom_alias": "..." (optional), "expires_at": "..." (optional) }
  Response: 201 Created
            { "short_url": "https://sho.rt/abc123" }

GET /:short_id
  Response: 302 Found, Location: <long_url>
            (302 over 301 to keep analytics; 301 is permanent and browsers cache aggressively)

GET /api/stats/:short_id
  Auth: required (link owner)
  Response: { "click_count": ..., "last_click": ... }
```

POST should be idempotent for the same `(user_id, long_url)` to make retries safe. Use [[idempotency_keys_api_design]] explicitly, or natural dedup on `(owner, long_url)`.

## 4. Data Model

```sql
-- Primary mapping
CREATE TABLE url_mapping (
  short_id      VARCHAR(8)   PRIMARY KEY,
  long_url      TEXT         NOT NULL,
  user_id       BIGINT,
  expires_at    TIMESTAMP,
  created_at    TIMESTAMP    NOT NULL,
  INDEX idx_user_created (user_id, created_at DESC)
);

-- Custom aliases (separate table to enforce uniqueness independently)
CREATE TABLE custom_alias (
  alias         VARCHAR(64)  PRIMARY KEY,
  short_id      VARCHAR(8)   NOT NULL,
  FOREIGN KEY (short_id) REFERENCES url_mapping(short_id)
);

-- Analytics (denormalised, async-fed)
CREATE TABLE click_event (
  short_id      VARCHAR(8),
  clicked_at    TIMESTAMP,
  ip_country    VARCHAR(2),
  user_agent    TEXT,
  INDEX idx_short_time (short_id, clicked_at)
);
```

Choices visible:

- `short_id` is the PK and the URL path. Lookup hits the [[b_plus_tree_indexes]] clustered index — one tree walk.
- Custom aliases in a separate table so uniqueness is enforced without conflicting with the auto-generated short_id namespace.
- Click events offline; the read path doesn't write.

## 5. Architecture

```
[Browser]
   │
   ▼
[CDN edge — caches popular redirects]
   │  (cache miss)
   ▼
[Geo Load Balancer] → [App tier — stateless]
                          │
              ┌───────────┼───────────────┐
              ▼           ▼               ▼
         [Redis cluster] [DB shards]   [ID gen]
              │               │
              └─[CDC pipeline]─┴─→ [Kafka] → [Analytics warehouse]
```

- App is stateless, behind a load balancer; horizontally scaled.
- Redis sits in front of the DB for the hot 1 TB; cache-aside (see [[cache_aside]]).
- DB sharded by `short_id` (or by hash of it).
- ID generator is a separate service producing short codes.
- Click events fire-and-forget into Kafka → consumed asynchronously into the analytics warehouse — see [[kafka_architecture]] and [[outbox_pattern]].
- CDN edge caches `GET /:short_id` 302 responses for the most popular links — these can be served entirely without hitting the origin.

## 6. Deep Dive

### 6.1 ID Generation — base62 over a counter

7 characters of base62 (`[0-9A-Za-z]`) → 62^7 ≈ 3.5 × 10^12 unique IDs. Plenty.

**Approach 1: counter + base62 encode**

A central counter (or per-instance ranges) issues incrementing 64-bit integers; convert to base62:

```
counter: 1, 2, 3, ..., 1000000, ...
encoded: "1", "2", "3", ..., "4c92"  (base62 of 1,000,000)
```

Pros: short codes, no collisions, deterministic, sequential growth fills shorter codes first.

Cons: predictable (scrapers can enumerate). For privacy-sensitive use cases, mitigate via hash-of-counter or random suffix.

Counter source: [[design_unique_id_generator_snowflake]] for a distributed counter, or DB auto-increment with cached ranges per app instance.

**Approach 2: hash of long URL → take first 7 chars**

```
short_id = base62(md5(long_url))[:7]
```

Pros: idempotent (same long_url always produces same short).

Cons: collisions. Two distinct long URLs may collide on the truncated prefix. Need handling: re-hash with a salt, or fall back to counter.

**Approach 3: random + DB unique constraint**

Generate random 7 chars, INSERT, on collision retry. Probability of collision is tiny when only a small fraction of the keyspace is used.

**Recommendation: counter + base62 for the default case.** Predictable scraping is the only downside; mitigate at the rate-limit layer if it matters.

### 6.2 Cache Strategy

[[cache_aside]] is the default: read tries cache, miss reads DB, populates cache.

```
read(short_id):
  v = redis.get(short_id)
  if v: return v
  v = db.get(short_id)
  if v: redis.set(short_id, v, ttl=24h)
  return v
```

Hot keys (>>1k req/s on a single short_id) need [[cache_stampede_thundering_herd]] protection — single-flight on the cache miss, or refresh-ahead.

For brand-new URLs, the first redirect always misses. To mitigate the long-tail of "I just shortened, why slow?", populate the cache on POST as well.

### 6.3 Hot URL Spike (Celebrity Link)

A celebrity short URL can take 1M+ req/sec. Mitigations stack:

- **CDN edge**: 302 responses cacheable at the CDN. Vast majority of requests never reach origin.
- **In-process L1 cache**: per app-instance LRU on top of Redis.
- **Redis cluster sharding**: one popular key still lives on one Redis node — that node hits its cap. Use **client-side replication** (read from N replicas) or replicate hot keys explicitly.
- **Read-only replicas of Redis** for the hottest keys.

The [[redis_cluster]] zettel covers slot-based sharding limits; very hot single keys exceed any single shard.

### 6.4 Sharding the DB

100 TB doesn't fit on one machine. Shard by `short_id`:

- **Hash sharding**: `shard = hash(short_id) % N`. Even distribution, no range queries.
- **Range sharding by counter prefix**: shorter codes (early) → shard A, longer codes → shard B. Risk of unbalanced load (newer codes hotter).
- **[[consistent_hashing]]**: minimum movement when adding shards.

Hash sharding is the default. See [[database_sharding_strategies]] for the trade-offs.

### 6.5 Analytics Path

Click events fire-and-forget into Kafka via the app server (no synchronous write to analytics DB on the read path). Async consumer aggregates into the warehouse.

Trade-off: analytics is eventually consistent (delayed by minutes); the redirect remains microsecond-fast. See [[outbox_pattern]] if you need *guaranteed* event delivery for billing/legal reasons.

### 6.6 Custom Aliases

Separate `custom_alias` table:

- INSERT with unique constraint on `alias` field.
- On collision: 409 Conflict to client.
- On read: `GET /:short_id` first checks `custom_alias` table, falls through to `url_mapping`.

Cache custom aliases the same way as short_ids.

## Trade-Offs Summary

| Decision               | Choice                | Trade-off acknowledged                          |
|------------------------|-----------------------|-------------------------------------------------|
| ID generation          | Counter + base62      | Predictable codes; rate-limit to mitigate scraping |
| Redirect status        | 302                   | Browsers don't cache; analytics work; slightly more origin load. 301 trades that for permanence. |
| Caching                | Cache-aside (Redis)   | Eventual consistency; first-read penalty       |
| DB sharding            | Hash on short_id      | No range queries on PK; even distribution      |
| Analytics              | Async via Kafka       | Eventual analytics; no impact on read path     |
| Hot key handling       | CDN + L1 + replicated Redis hot keys | Operational complexity for the long tail |

## Common Pitfalls

- **Designing for analytics first** — the redirect path is the hot path; analytics is decoupled.
- **Auto-incrementing PK without thinking about shards** — auto-increment becomes a global contention point; either shard the counter (snowflake) or use ID ranges per shard.
- **Hash-of-URL as the only ID strategy** — collisions are rare but require a backup plan; better to use counter for default and hash for *idempotent* shorten-this-URL semantics.
- **Strong consistency on analytics** — wastes the read path. Decouple.
- **Forgetting hot URLs** — the long tail isn't the problem; the head is. CDN + L1 must be in the design.
- **301 instead of 302** — 301 caches in browsers indefinitely. If the long URL changes, old browsers still hit the old destination. 302 keeps the redirect dynamic.
- **Single-region** — broken for international users. CDN at minimum; multi-region origin if availability targets demand it.
- **Thinking the DB is the read tier** — at 100k reads/s with 100 TB of data, the DB serves only cache misses. Caching is mandatory, not an optimisation.

## Related

- [[system_design_framework]] — the six-step approach this walks through.
- [[back_of_envelope_estimation]] — capacity numbers behind every choice here.
- [[design_unique_id_generator_snowflake]] — alternative ID-generation approach.
- [[cache_aside]], [[cache_stampede_thundering_herd]] — caching for the read path.
- [[database_sharding_strategies]], [[consistent_hashing]] — sharding the DB.
- [[outbox_pattern]], [[kafka_architecture]] — analytics pipeline.

---

## References

- Alex Xu, Vol. 1 ch. 8 (ByteByteGo).
- Bitly engineering blog (various posts on their architecture).

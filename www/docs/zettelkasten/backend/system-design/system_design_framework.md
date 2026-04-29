🗓️ 29042026 1330
📎 #system_design #framework

# system_design_framework

> A six-step approach to working through a system design problem under time pressure. Not a script — a scaffold. The framework's value is keeping you from skipping steps that matter (requirements, capacity) when the temptation is to dive straight into "I'd use Kafka and Redis".

## The Six Steps

```ad-abstract
1. **Clarify requirements** — functional + non-functional. What does the system do? What does it need to handle?
2. **Estimate scale** — back-of-envelope numbers for QPS, storage, bandwidth.
3. **API design** — the contract between users and the system.
4. **Data model** — entities, relationships, persistence shape.
5. **High-level architecture** — boxes-and-arrows; major components and their interactions.
6. **Deep dive** — pick the bottleneck or interesting part; trade-offs explicitly.
```

In a 45-minute exercise: ~5 / 5 / 5 / 5 / 10 / 15 minutes. Adjust to the question's emphasis.

## Step 1 — Clarify Requirements

Two halves. Both are required.

### Functional

What features must the system support? Confirm the *minimum viable* set before designing.

For a URL shortener:
- Shorten a long URL → short URL.
- Visit the short URL → redirect to the long URL.
- Analytics? Custom aliases? Expiry? — *ask, don't assume.*

The art is **not designing for unstated requirements**. If the prompt didn't mention analytics, don't slot Kafka in for analytics by default. Pin the scope.

### Non-functional

Performance, scale, consistency, availability — the *-ilities*.

| Dimension     | Question to ask                                            |
|---------------|-----------------------------------------------------------|
| Scale         | How many users? Reads vs writes? Daily / peak QPS?         |
| Latency       | What's the SLA? p50, p99?                                  |
| Availability  | 99.9%? 99.99%? Multi-region?                               |
| Consistency   | Strong, eventual, read-your-writes?                        |
| Durability    | Loss tolerance? RTO / RPO?                                |
| Security      | Auth model? Rate-limited? Trust boundaries?               |

These choices drive every later decision. *"Strong consistency"* steers you toward [[raft]]-backed stores; *"99.99% availability"* steers you toward multi-region; *"100M users"* changes data-model decisions.

## Step 2 — Estimate Scale

[[back_of_envelope_estimation]] is the dedicated zettel. Quick recap:

- **Users** → DAU → QPS (read + write split).
- **Storage** = records × size, projected forward.
- **Bandwidth** = QPS × payload.
- **Memory** = hot working set × multiplier.

Why this step matters: it tells you when **a single machine is enough** and when sharding / replication / caching is mandatory. A 100 QPS write workload doesn't need Kafka. A 1M QPS workload does.

Round numbers liberally. Order-of-magnitude reasoning is what drives the design; exact arithmetic is rarely the point.

## Step 3 — API Design

The endpoints/actions the system exposes. Don't dump every URL — the **shape** is what matters.

For a URL shortener:

```
POST /shorten
  body:    { "long_url": "...", "custom_alias": "..." (optional) }
  returns: { "short_url": "..." }

GET /:short_id
  returns: 302 redirect to long_url
```

Decisions visible here:
- Which methods (REST, gRPC, GraphQL — pick one and justify briefly).
- Auth (API key? OAuth? Public for redirects?).
- Pagination shape if applicable.
- Idempotency for non-idempotent operations — see [[idempotency_keys_api_design]].

A clean API forces you to commit to a contract before getting lost in implementation.

## Step 4 — Data Model

Entities, attributes, relationships.

For a URL shortener:

```
URLMapping
  short_id      VARCHAR(8)  PRIMARY KEY
  long_url      TEXT
  user_id       BIGINT (nullable, for anonymous shortens)
  expires_at    TIMESTAMP (nullable)
  created_at    TIMESTAMP
  click_count   BIGINT (denormalised)
```

Decisions visible here:
- SQL vs NoSQL (and *why* — relationships? Schema flexibility? Scale?).
- Primary key choice (autoinc / UUID / snowflake — see [[design_unique_id_generator_snowflake]]).
- Denormalisation for read patterns.
- Indexes — what queries does each support?

This is the step where DB internals matter: [[b_plus_tree_indexes]], [[composite_index_leftmost_prefix]], [[transaction_isolation_levels]].

## Step 5 — High-Level Architecture

The boxes-and-arrows diagram. Major components and traffic flow.

For a URL shortener:

```
[Client] → [CDN] → [Load Balancer] → [App Server fleet]
                                       ↓
                            [Redis cache] ↔ [Database]
                                       ↑
                            [ID Generator service]
```

Key decisions visible:
- Where caching sits (request, app, edge).
- Single-region vs multi-region.
- Sync vs async paths (hot path is sync; analytics async via Kafka).
- Stateful vs stateless components (app servers stateless; DB stateful).

Speak to **why each box exists**. Adding components without justification is a tell that you're cargo-culting reference architectures.

## Step 6 — Deep Dive

Pick the most interesting / hardest part. Don't try to deep-dive everything; you don't have time.

Common deep-dive choices for a URL shortener:

- **ID generation** — base62, length math, snowflake vs hash vs counter, collision handling.
- **Cache strategy** — read-through? cache-aside? what's the hit ratio with 80/20? See [[cache_aside]] and [[cache_penetration_breakdown_avalanche]].
- **Hot URLs** — celebrity short URL gets 1M req/sec; how do you survive? See [[cache_stampede_thundering_herd]].
- **Analytics** — async pipeline; CDC vs Kafka producer; aggregation strategy.
- **Custom alias collisions** — uniqueness check, race-proof under concurrent posts.

Each deep dive should reach a **trade-off** explicitly. "Snowflake gives sortable IDs and 4M IDs/sec/machine; UUID gives no central allocator but loses sortability and uses more bytes. I'd go with snowflake because we want chronological sorting for `created_at` queries." That's a senior-shaped answer.

## Common Pitfalls

- **Skipping requirements** — diving straight to architecture. Without nailed-down requirements, your design has no defence against "but what if X?" questions.
- **Skipping estimates** — leads to over- or under-engineered solutions. 100 QPS doesn't need Kafka; 1M QPS does. Numbers tell you which.
- **Jumping to favourite tools** — "I'd use Redis, Kafka, ElasticSearch, Spark…" before establishing why any of them is needed. Each tool needs a reason that traces back to a requirement.
- **All boxes, no flow** — drawing a diagram without explaining how a request traverses it. Walk through one read path and one write path explicitly.
- **No trade-offs in the deep dive** — claiming a single right answer. Real systems are pick-your-pain. Name what you're trading away.
- **Ignoring failure modes** — "what happens when X fails?" should have an answer for every X you drew on the diagram.
- **Going too deep too early** — getting stuck in implementation details before the high-level shape is right. Time-box.

## Related

- [[back_of_envelope_estimation]] — the math behind step 2.
- [[design_url_shortener]] — applies all six steps.
- [[design_rate_limiter]] — applies all six steps with a different shape.
- [[design_unique_id_generator_snowflake]] — focused deep-dive on a recurring sub-problem.
- [[moc_distributed_systems]], [[moc_db_internals]], [[moc_caching]], [[moc_messaging]] — feed the deep-dive vocabulary.

---

## References

- Alex Xu, Vol. 1 (ByteByteGo) — the canonical playbook.
- Donne Martin's "system-design-primer" GitHub repo.

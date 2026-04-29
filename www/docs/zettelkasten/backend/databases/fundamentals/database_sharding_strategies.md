🗓️ 29042026 1730
📎 #database #sharding

# database_sharding_strategies

> The three (and a half) ways to split a dataset across nodes when one machine isn't enough. Choice of strategy and shard key shape every cross-shard pain you'll hit later — and the wrong choice is expensive to undo.

## Vertical vs Horizontal

```ad-abstract
**Vertical sharding** — split by **feature/column**. Users on one DB, orders on another, comments on a third.
**Horizontal sharding** — split by **row** within the same table. Users 1–10M on shard A, 10M–20M on shard B.
```

Vertical is just service decomposition. The interesting and harder problem is horizontal — and "sharding" alone usually means horizontal.

## The Three Horizontal Strategies

### 1. Range-based

Partition the keyspace into contiguous ranges, one range per shard.

```
shard A: user_id [    0,  10M)
shard B: user_id [10M,   20M)
shard C: user_id [20M,   30M)
```

**Pros**: range scans hit one or few shards (`WHERE user_id BETWEEN 5M AND 7M` → shard A only). Easy to reason about.

**Cons**: hot ranges. If new users (high IDs) are most active, shard C burns while A and B idle. Auto-incrementing PKs make this worse.

**Used in**: BigTable, HBase, MongoDB ranged shard key.

### 2. Hash-based

`shard = hash(key) mod N`. Distributes load evenly.

**Pros**: even distribution by construction. Hot keys still possible but no hot ranges.

**Cons**:
- Adding a node remaps `~(N-1)/N` of keys → see [[consistent_hashing]] for the fix.
- Range scans become **scatter-gather** — query every shard, merge results.
- Co-located reads (e.g. all of one user's data) require careful key design.

**Used in**: Cassandra, ShardingSphere `MOD` algorithm, classic Memcached client routing.

### 3. Directory / Lookup

A separate service maps each key to a shard. The map is the source of truth; you can split, merge, or move shards arbitrarily.

```
lookup_service.find_shard(user_id=42) → "shard B"
```

**Pros**: maximum flexibility. Reshard any time without rehashing.

**Cons**: extra hop on every query (cache it). Lookup service is a SPOF if not HA. More moving parts.

**Used in**: Vitess (its `vschema`), Foursquare's MongoDB sharding, custom homegrown systems.

### 3.5 Geographic / Tenant-based

Special-case directory: shard by region or by customer.

```
EU users → shard EU
US users → shard US
TenantA → dedicated shard A
```

Common in B2B SaaS for compliance (GDPR), latency, or noisy-neighbour isolation.

## Choosing a Shard Key

The hardest decision in sharding. Once chosen, hard to change.

Evaluation criteria:

| Criterion             | What to ask                                                      |
|-----------------------|------------------------------------------------------------------|
| **Cardinality**       | Enough distinct values to spread across N shards?                |
| **Frequency / hotness** | Are some values vastly more common (celebrity user_id)?         |
| **Query alignment**   | Do hot queries filter by this key (so they hit one shard)?       |
| **Co-location need**  | Are related rows reachable via this key (user_id co-locates user's posts)? |
| **Monotonicity**      | If always-increasing (timestamps, auto-IDs), expect range hot-spots. |

Common choices: `user_id`, `tenant_id`, `region`, `entity_id`. Avoid: `created_at` (range hotspot), `status` (low cardinality), boolean flags.

## Cross-Shard Queries

The bane of sharding.

| Pattern             | Cost                                                              |
|---------------------|-------------------------------------------------------------------|
| Single-shard read   | One shard. Cheap.                                                 |
| Scatter-gather read | All N shards, merge. Slowest shard caps latency.                  |
| Cross-shard JOIN    | Effectively impossible at scale; precompute or denormalise.       |
| Cross-shard txn     | [[two_phase_commit]] or [[saga_pattern]]. Both have downsides.    |

Listing rows across shards (e.g. all orders by status) typically becomes one of: secondary index per shard plus aggregator service running scatter-gather, or an async pipeline (CDC → search index like Elasticsearch) that owns the cross-shard view separately.

## Resharding

Adding capacity is the biggest operational pain.

- **Range**: split a range. Move only the data in the new sub-range.
- **Hash mod N → mod (N+1)**: rehash everything. Avoid via consistent hashing or fixed-slots scheme.
- **Consistent hashing**: only `~1/N` of keys move.
- **Fixed slots** (Redis Cluster's 16384, Vitess's vstreams): move slot ownership, not data hashing.
- **Directory**: update the map. Simplest in theory; hardest if data must physically migrate.

## Common Pitfalls

- **Sharding by `user_id` is the common starting point for B2C** — but its failure modes (celebrity users, cross-user analytics, abandoned-account shards) all need separate plans.
- **A wrong shard key is expensive to fix** — dual-write to the new sharding scheme, backfill, then cut over. Months of work. Choose carefully up-front.
- **Cross-shard JOINs are usually avoided, not solved** — denormalise (duplicate data), pre-aggregate, or push the JOIN into a separate analytical store fed by CDC.
- **Uniqueness constraints across shards are only enforceable in-shard** — for global uniqueness: pre-allocated ID ranges, a central allocator, or UUIDs (with the trade-off that random UUIDs hurt range scans).
- **Vertical partitioning only delays the problem** — eventually a single feature's data outgrows one box, and you're back to horizontal sharding.

## Related

- [[consistent_hashing]] — minimises rehashing on N changes.
- [[redis_cluster]] — fixed-slot variant.
- [[two_phase_commit]] — cross-shard atomicity option (rarely good).
- [[saga_pattern]] — saga-based cross-shard alternative.

---

## References

- "Designing Data-Intensive Applications" ch. 6
- Vitess docs: [Sharding](https://vitess.io/docs/user-guides/configuration-basic/sharding/)
- ShardingSphere docs: [Sharding Algorithms](https://shardingsphere.apache.org/document/current/en/dev-manual/sharding/)

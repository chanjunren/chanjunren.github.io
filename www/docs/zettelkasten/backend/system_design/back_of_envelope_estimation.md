🗓️ 29042026 1345
📎 #system_design #estimation

# back_of_envelope_estimation

> Quick capacity arithmetic to size a system before designing it. The numbers don't need to be exact — they need to be **right within an order of magnitude**, fast, and consistent. Numbers replace hand-waving.

## The Latency Numbers Every Engineer Should Know

Memorise these. They drive intuition for what "fast" and "slow" mean in different layers.

| Operation                           | Time         | Memory shorthand     |
|-------------------------------------|--------------|----------------------|
| L1 cache reference                  | ~0.5 ns      | "instant"            |
| Branch mispredict                   | ~5 ns        |                      |
| L2 cache reference                  | ~7 ns        |                      |
| Mutex lock/unlock                   | ~25 ns       |                      |
| Main memory reference               | ~100 ns      | "fast"               |
| Compress 1 KB with Snappy           | ~3 μs        |                      |
| Send 2 KB over 1 Gbps network       | ~20 μs       |                      |
| Read 1 MB sequentially from memory  | ~250 μs      |                      |
| Round trip in same datacenter       | ~500 μs      | "intra-DC"           |
| Read 1 MB sequentially from SSD     | ~1 ms        |                      |
| Disk seek (HDD)                     | ~10 ms       | "slow"               |
| Read 1 MB sequentially from disk (HDD) | ~20 ms    |                      |
| Cross-continent round trip          | ~150 ms      | "user-perceptible"   |

Order-of-magnitude takeaways:

- L1/L2 → main memory → SSD → HDD: each is ~100× the previous.
- Intra-DC RTT (500 μs) ≈ 500× a memory access.
- Cross-continent RTT (150 ms) is *huge* — caching at edge / CDN is the only real fix.
- Disk seek (10 ms) is more expensive than 1000 memory reads. Sequential beats random by orders of magnitude.

## Powers of 2 (storage)

| Power | Approx | Name |
|-------|--------|------|
| 2^10  | 10^3   | KB   |
| 2^20  | 10^6   | MB   |
| 2^30  | 10^9   | GB   |
| 2^40  | 10^12  | TB   |
| 2^50  | 10^15  | PB   |

Approximation: `2^n ≈ 10^(n * 0.3)`. For mental math, 2^30 ≈ 1 billion is precise enough.

## Powers of 10 (counts)

| Number | Name        |
|--------|-------------|
| 10^3   | thousand (K) |
| 10^6   | million (M)  |
| 10^9   | billion (B)  |
| 10^12  | trillion (T) |

A second has 10^9 nanoseconds. A day has ~10^5 seconds (86,400 — round to 100k). A year has ~3 × 10^7 seconds.

## Single-Server Sanity Numbers

What can one mid-spec machine do today?

| Resource                    | Approximate single-server limit                            |
|-----------------------------|------------------------------------------------------------|
| Modern x86 server, RAM      | 64–512 GB                                                 |
| SSD storage                 | 1–10 TB                                                   |
| Network                     | 10–100 Gbps                                               |
| HTTP server (well-tuned)    | ~10–50k QPS                                                |
| MySQL writes                | ~5–20k writes/s (depends on schema, durability config)    |
| Redis ops (single instance) | ~100–200k ops/s                                            |
| Kafka broker                | ~100–500k msgs/s (small messages, batched)                |
| Cache hit ratio (typical)   | 80–95% for read-heavy workloads                            |

When your estimated load fits one server: the design problem is *latency*, not *scale*. When it doesn't: shard, replicate, distribute.

## Worked Example — URL Shortener

**Inputs (assumed)**
- 100M new URLs / day (write).
- Read-to-write ratio: 100:1 → 10B reads / day.

**Daily → per-second QPS**

```
86,400 s/day ≈ 100,000 s/day      (round generously)
writes:  100M  / 100K  = 1,000 writes/s
reads:   10B   / 100K  = 100,000 reads/s
```

100k reads/s — well past one server's HTTP limit. Read-heavy → caching is mandatory; sharding likely.

**Storage (5 years)**

```
5 years × 365 × 100M URLs ≈ 200B URLs
each URL row: ~500 bytes (long URL + metadata + indexes)
total: 200B × 500 bytes = 100 TB
```

Doesn't fit on one machine — sharding required. With 16 shards, ~6 TB each. Manageable.

**Bandwidth**

```
read response ~500 bytes
100k reads/s × 500 bytes = 50 MB/s = 400 Mbps
```

Trivial for modern network gear.

**Cache memory**

```
80/20 rule: 20% of URLs serve 80% of reads
cached URLs: 20% × current 30B URLs = 6B
each cached entry ~200 bytes (short_id + long_url + minimal meta)
total cache: 6B × 200 bytes = 1.2 TB
```

1.2 TB of Redis is too much for one machine — sharded Redis cluster needed.

The numbers told you: **caching is required, sharding is required, the database is the storage tier (not the read tier).** Now the architecture follows.

## Worked Example — Twitter-like Feed

**Inputs (assumed)**
- 200M DAU.
- Average user: 200 follows.
- 10 tweets posted per user per day.
- 100 feed loads per user per day.

**Tweets/day**: 200M × 10 = 2B tweets/day → ~20k tweets/s.

**Feed loads/day**: 200M × 100 = 20B loads/day → ~200k loads/s.

**Naive on-demand fan-out**: each load queries all 200 follows, takes top 100 from each, merges. 200 × 200k = 40M tweet-fetches/s. Far too much.

**Naive write fan-out**: each tweet pushes into 200 followers' caches. 20k × 200 = 4M cache-writes/s. Plausible. *But* a celebrity with 100M followers fans out to 100M writes per tweet — hours to drain.

**Hybrid**: write fan-out for normal users, read fan-out for celebrities (>1M followers). Pre-compute the union at read time only for the celebrity portion.

The estimate exposed why feed systems are hybrid — neither pure approach works under realistic numbers.

## Standard Approximations to Memorise

| Concept                  | Approx                                          |
|--------------------------|--------------------------------------------------|
| 1 day                    | 100,000 seconds (actual 86,400)                 |
| 1 year                   | 30M seconds                                     |
| 100M users × 1 op/s each | 100M ops/s — way past any single layer's limit  |
| 1B records × 1 KB        | 1 TB of storage                                 |
| 1 KB / message × 100k QPS | 100 MB/s — basic network                       |
| Read-write ratio         | 10:1 typical, 100:1 for content sites           |
| Hot data fraction        | 20% gets 80% of access (Pareto)                 |

## Interpreting the Numbers

The point isn't precision; it's **deciding what the design has to optimise for**.

| Estimate result                            | Design implication                                 |
|--------------------------------------------|----------------------------------------------------|
| QPS fits one server                        | Single instance + replica for HA; latency-focused |
| Storage exceeds single SSD                 | Sharding mandatory                                |
| Read QPS >> write QPS                      | Caching layer + read replicas                     |
| Bandwidth approaches network limits        | CDN; geographic placement                         |
| Memory working set exceeds RAM             | Eviction policy; multi-tier cache                 |
| Latency budget < cross-region RTT          | Same-region serving only; no cross-region writes  |

## Common Pitfalls

- **Computing exact arithmetic** — wastes time. Round.
- **Stopping at "QPS"** — also estimate storage, bandwidth, memory. Each one can be the binding constraint.
- **Ignoring peaks** — 100M DAU isn't 100M / 86,400. Traffic is bursty (peak/avg ≈ 2–3×). Provision for peak.
- **Assuming uniform distribution** — Pareto distribution shows up everywhere (users, tweets, URLs). 20% of keys carry 80% of load.
- **Conflating storage with active working set** — 100 TB of data with 1 TB hot doesn't need 100 TB of RAM cache.
- **Forgetting amplification** — one user write may trigger 200 follower-cache writes. The pipeline factor matters.
- **Single-server math at fleet scale** — "Redis can do 100k ops/s" → assuming Redis can do 10M ops/s with 100 machines linearly. Network shuffling, hot keys, and partition limits make it sublinear.

## Related

- [[system_design_framework]] — this is step 2 of the framework.
- [[design_url_shortener]] — full estimation walkthrough.
- [[design_rate_limiter]] — different shape: lots of small ops.
- [[redis_cluster]], [[database_sharding_strategies]] — what the numbers force you toward.

---

## References

- Jeff Dean, ["Numbers Everyone Should Know"](https://gist.github.com/jboner/2841832) — Google internal talk; the original latency table.
- Alex Xu, Vol. 1 ch. 2 (ByteByteGo).
- Peter Norvig, ["Teach Yourself Programming in Ten Years"](https://norvig.com/21-days.html) — the latency numbers reproduced.

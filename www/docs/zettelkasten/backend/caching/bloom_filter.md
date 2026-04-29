🗓️ 29042026 2000
📎 #datastructures #caching #probabilistic

# bloom_filter

> A space-efficient probabilistic data structure that answers "is this element in the set?" with two possible responses: **definitely not**, or **possibly yes**. The asymmetry — false positives but never false negatives — is exactly the right shape for cache-penetration gating, exists-checks before expensive lookups, and many bigtable-style optimisations.

## How It Works

```ad-abstract
A bit array of m bits, all initially 0. **k independent hash functions** map each element to k positions in the array. To insert: set those k bits to 1. To query: check if all k bits are 1 — if any is 0, the element is definitely absent.
```

```
m = 16 bits (toy example):
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0

insert("apple"):
  h1("apple") = 3
  h2("apple") = 7
  h3("apple") = 12
  → set bits 3, 7, 12

0 0 0 1 0 0 0 1 0 0 0 0 1 0 0 0

query("apple"):
  bits 3, 7, 12 all 1 → "possibly yes"

query("banana"):
  h1("banana") = 5  → bit 5 is 0 → "definitely no"
```

## Why "Possibly Yes"

After enough inserts, all k bits for a query may happen to be set by *other* elements' hashes. A query then returns "yes" even though the element was never inserted. That's a **false positive**.

The opposite cannot happen: if any of the k bits is 0, no insert ever touched it, so the element is definitively absent. **No false negatives.**

## False Positive Rate

For an m-bit array, k hash functions, after n insertions, the probability of false positive is approximately:

```
ε ≈ (1 - e^(-kn/m))^k
```

The optimal number of hash functions for a given `m/n` is:

```
k* = (m/n) * ln(2) ≈ 0.693 * (m/n)
```

Plugging back gives the minimum FP rate at optimal k:

```
ε_min ≈ 0.6185^(m/n)
```

Quick reference:

| Bits per element (m/n) | Optimal k | False positive rate |
|------------------------|-----------|---------------------|
| 8                      | 6         | ~2%                 |
| 10                     | 7         | ~1%                 |
| 16                     | 11        | ~0.05%              |
| 24                     | 17        | ~0.001%             |

So ~10 bits per element gets you a 1% false positive rate. Cheap.

## What Bloom Filters Cannot Do

- **Cannot delete**. Resetting a bit may unset a bit needed by another element. Use a **counting Bloom filter** (counters instead of bits) for delete support — at the cost of 4x space.
- **Cannot enumerate** members. The filter knows nothing of the actual values, just hash positions.
- **Cannot resize cleanly**. Adding more bits requires rehashing all elements.

## Real-World Uses

| System              | Use of bloom filter                                              |
|---------------------|------------------------------------------------------------------|
| Google BigTable / Cassandra | Skip disk reads for SSTables that "definitely don't contain key" |
| Redis (RedisBloom module) | Application-side dedup, recommendation skip-lists           |
| Chrome Safe Browsing | Local check against malicious URL list before remote query     |
| CDNs / proxies      | "Has this URL been seen before?" cache admission                 |
| Spell checkers (legacy) | "Is this word in the dictionary?"                            |
| Distributed systems | Element existence tests across nodes without full transfer       |

## Bloom Filter Family Tree

| Variant                 | What it adds                                            |
|-------------------------|----------------------------------------------------------|
| **Counting Bloom Filter**| Counters → supports delete; 4x space                    |
| **Cuckoo Filter**       | Alternative structure with similar FP rate, supports delete, slightly more compact at low FP rate |
| **Scalable Bloom Filter**| Chains multiple filters of growing size; handles unknown insertion volume |
| **Bloomier Filter**     | Maps keys to short values, not just yes/no              |

Adjacent probabilistic structures (different problems):

- **HyperLogLog** — count distinct elements (cardinality), not membership
- **Count-Min Sketch** — frequency estimation per element
- **MinHash** — set similarity (Jaccard)
- **Quotient Filter** — ordered alternative to Bloom

## Common Pitfalls

- **Wrong k for your m/n** — using k=3 when optimal is k=7 doubles your FP rate. Use the formula or a library that picks k.
- **Hash function correlation** — k hashes need to be effectively independent. In practice: use one good hash and `h_i = h_a + i * h_b` (Kirsch-Mitzenmacher trick) — works well in theory and practice.
- **Forgetting to rebuild after data changes** — adding to the source without adding to the filter creates "false negatives" (filter says no, source says yes). Either rebuild on change, use a counting filter, or accept the gap.
- **Tiny filter for huge n** — the FP rate degrades to near-1 as `n/m` grows. Size the filter for projected `n`, not current `n`.
- **Per-key FP isn't the same as overall hit rate** — if 99% of queries are for popular keys with low FP, but 1% are scans of nonexistent keys, your FP cost concentrates on the unimportant traffic. Measure it.

## Related

- [[cache_penetration_breakdown_avalanche]] — penetration is the canonical use case for a Bloom filter gate.
- [[cache_aside]] — sit a Bloom filter in front of the cache miss path.
- `redis_data_structures_advanced` *(planned)* — RedisBloom module, HyperLogLog, etc.

---

## References

- Bloom, "Space/Time Trade-offs in Hash Coding with Allowable Errors" (1970) — original paper
- Kirsch & Mitzenmacher, "Less Hashing, Same Performance" (2006) — the double-hash trick
- Fan et al., "Cuckoo Filter: Practically Better Than Bloom" (2014)

🗓️ 29042026 2000

# bloom_filter

A **Bloom filter** is a compact membership test. It answers **definitely absent** or **possibly present** for the set inserted into it.

It can reject nonexistent keys before expensive lookups in [[cache_penetration]] protection.

## Bit-array model

Start with an array of `m` zero bits. Each of `k` hash functions chooses a bit position.

Insertion sets all selected bits. A query checks them:

- Any zero: the element was never inserted.
- All ones: the element may have been inserted.

Example: inserting apple sets bits 3, 7, and 12. Apple then passes. Banana fails if one selected bit is zero. Another word can pass if its selected bits overlap existing ones.

That mistaken pass is a **false positive**. Queries for inserted elements have no false negatives, assuming correct hashing and no lost or cleared bits.

## Size and accuracy

For `n` inserted elements, the usual approximation is:

```text
false_positive_rate ≈ (1 - exp(-k*n/m))^k
optimal_k ≈ (m/n) * ln(2)
```

These assume approximately uniform, independent hashing. Choose an integer hash count near the optimum.

| Bits per element | Hash count | Approximate false positives |
| --- | --- | --- |
| 8 | 6 | 2.2% |
| 10 | 7 | 0.82% |
| 16 | 11 | 0.046% |

Overfilling a fixed filter increases false positives.

## Operational boundaries

A filter represents inserted elements, not automatically the live database. Missing an insertion can reject valid data. Update it before using absence as a gate, or bypass the gate during synchronization.

A standard filter cannot safely delete by clearing bits: other elements may share them. Counting filters support deletion with counters; scalable filters add subfilters as the set grows.

A positive answer still needs the real lookup. The filter neither returns values nor enumerates members.

## References

- [Redis: Bloom filter](https://redis.io/docs/latest/develop/data-types/probabilistic/bloom-filter/)
- [Kirsch and Mitzenmacher: Less Hashing, Same Performance](https://www.eecs.harvard.edu/~michaelm/postscripts/rsa2008.pdf)

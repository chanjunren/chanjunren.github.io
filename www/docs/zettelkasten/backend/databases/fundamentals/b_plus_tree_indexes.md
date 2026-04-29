🗓️ 29042026 1615
📎 #database #indexing

# b_plus_tree_indexes

> The default index structure in every relational DB. The shape — not just "balanced tree" — determines how queries perform, how indexes consume disk, and why range scans are cheap.

## Structure

```ad-abstract
A B+tree is a balanced multi-way search tree where:
- **Internal nodes** hold only keys + child pointers (navigation).
- **Leaf nodes** hold the actual data (or pointers to it) AND are linked left↔right in a doubly-linked list.
- All leaves at the same depth.
```

```
              [ 30 | 60 ]                      ← internal
             /    |     \
        [10|20] [40|50] [70|80]               ← leaves
        ↔ ↔ ↔ ↔ ↔ ↔ ↔ ↔ ↔ ↔ ↔ ↔ (linked)
```

Each node = one disk page (typ. 16 KB in InnoDB). With ~1000 keys per page, a tree of depth 4 indexes a billion rows. Three or four disk reads per point lookup.

## B+tree vs B-tree vs Hash vs LSM

| Structure  | Point lookup | Range scan | Write throughput | Used in                        |
|------------|--------------|------------|------------------|--------------------------------|
| Hash       | O(1)         | impossible | high             | Memcached, Redis, hash indexes |
| B-tree     | O(log n)     | OK (walk back up) | medium    | Older systems, FS              |
| **B+tree** | O(log n)     | **fast (linked leaves)** | medium | InnoDB, Postgres btree, Oracle |
| LSM tree   | O(log n)     | OK         | **high (sequential writes)** | Cassandra, RocksDB, LevelDB |

**Why B+tree wins for OLTP**: range scans are common (`WHERE id BETWEEN 100 AND 200`, `ORDER BY created_at`), and the linked leaves walk in order without bouncing back to internal nodes.

**Why LSM wins for write-heavy**: appends to sorted memtables, batches to disk → sequential I/O. Cost: read amplification + compaction.

## Clustered vs Secondary (InnoDB specifics)

InnoDB tables ARE B+trees, keyed by the primary key:

- **Clustered index** = primary key. Leaves hold the **full row**. So a PK lookup is one tree walk.
- **Secondary index** = on some other column. Leaves hold the **primary key**, not a row pointer.
  - Lookup: walk secondary index → get PK → walk clustered index → get row. Two tree walks.
  - This is why **PK column choice matters**: changing PK rewrites all secondary index leaves.

PostgreSQL is different — heap tables + indexes that hold tuple identifiers (TID). No clustered index by default.

## Why Disk-Friendly

- Each node = one page → one I/O.
- High fan-out → shallow tree → few I/Os per lookup.
- Sequential leaf scan → leverages OS read-ahead.
- Mostly-full pages → good space utilisation (~70% with default fill factor).

## Common Pitfalls

- **B+tree vs B-tree** — range scans are the reason. B-tree leaves aren't linked; range walks must climb back up internal nodes, paying extra I/O at every step.
- **Hash isn't a substitute for everything** — no range queries, no `ORDER BY`, no `<` / `>` operators. Hash indexes also degrade with skewed keys.
- **Tree depth math** — 3–4 levels with 1000 fan-out covers a billion rows. Disk I/O cost per lookup is bounded by depth, which is why fan-out matters.
- **Index footprint** — a secondary index costs roughly `(key size + PK size) × rows`. A 64-bit PK plus a 32-byte string column over 100M rows is ~4 GB. Useful for capacity planning.
- **InnoDB clustered = data** — dropping the PK is cheap; *changing* the PK rewrites every secondary index because each leaf stores the PK as the row pointer.
- **Sorted order is free** — leaves are sorted by key, so `ORDER BY indexed_col` adds no work. Easy to overlook when designing query plans.

## Related

- [[composite_index_leftmost_prefix]] — how multi-column B+tree indexes are matched.
- [[innodb_locks]] — gap and next-key locks live on B+tree intervals.
- [[mvcc_innodb_read_view]] — versioning sits on top of the B+tree via undo log pointers.

---

## References

- "Database System Concepts" (Silberschatz, ch. 14)
- InnoDB internals: [https://dev.mysql.com/doc/refman/8.0/en/innodb-physical-structure.html](https://dev.mysql.com/doc/refman/8.0/en/innodb-physical-structure.html)

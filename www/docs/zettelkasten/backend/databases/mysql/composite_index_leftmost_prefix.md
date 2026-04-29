🗓️ 29042026 1630
📎 #database #indexing #mysql

# composite_index_leftmost_prefix

> The rule that decides whether a `WHERE` clause uses an index or falls back to a full table scan. Misapplying it is the single most common cause of "the query was fast yesterday, slow today" after a schema change.

## The Rule

```ad-abstract
For a composite index `(a, b, c)`, the optimiser can use it only when the WHERE clause includes a **leftmost contiguous prefix**: `a`, or `a+b`, or `a+b+c`. Skipping a column breaks the chain.
```

| Query                                | Uses `(a,b,c)`? |
|--------------------------------------|-----------------|
| `WHERE a = 1`                        | Yes (prefix `a`)|
| `WHERE a = 1 AND b = 2`              | Yes             |
| `WHERE a = 1 AND b = 2 AND c = 3`    | Yes (full)      |
| `WHERE a = 1 AND c = 3`              | Partial — `a` only; `c` filter applied after |
| `WHERE b = 2`                        | No — `a` missing |
| `WHERE b = 2 AND c = 3`              | No              |
| `WHERE a = 1 AND b > 2 AND c = 3`    | `a + b` only — range on `b` stops `c` from using the index |
| `WHERE a = 1 ORDER BY b`             | Yes — sort uses index |

## Why "Leftmost"

Index leaves sort by `(a, b, c)` lexicographically:

```
(1, 1, 1) → (1, 1, 2) → (1, 2, 1) → (1, 2, 2) → (2, 1, 1) → ...
```

Without `a` pinned, you can't binary-search to a starting point. Filtering `b=2` alone would require scanning all `a` values' subtrees. That's a full index scan, often equivalent to a table scan.

## Range Stops the Prefix

`WHERE a = 1 AND b > 5 AND c = 3`:

- Index narrows to `a=1` block, then walks `b > 5` rows.
- Within that range, `b` and `c` are *not jointly sorted* in a useful way (you've crossed multiple `b` values, each with their own ordered `c`).
- So `c = 3` becomes a **filter**, not an index seek. Rows are read from the index, then `c` is checked in memory.

Rule: **equality columns first, range column last**. Reorder the index if your hot query has range early.

## Index Condition Pushdown (ICP)

Without ICP: MySQL fetches rows that match the prefix, then filters by remaining conditions back at the server.

With ICP (default in InnoDB since 5.6): the storage engine pushes the residual conditions down and skips rows in the index layer, before fetching. Less I/O.

`EXPLAIN` shows `Using index condition` when ICP fires.

## Covering Index

If every column in `SELECT` is present in the index, the engine doesn't need to walk the clustered index for the row. The index alone "covers" the query.

```sql
-- index: (user_id, created_at, status)
SELECT user_id, created_at, status FROM events WHERE user_id = 42;
```

`EXPLAIN` shows `Using index` (no `condition`) → covering. Pure index reads, no row fetch.

When a query is hot but slow even with the matching index, the next move is to add SELECT columns to the index so it becomes covering — saves the full row fetch back to the clustered index.

## Common Pitfalls

- **WHERE clause order doesn't matter** — `WHERE b = 2 AND a = 1` is equivalent to `WHERE a = 1 AND b = 2`. The optimiser reorders predicates. What matters is the order in the index *definition*.
- **`OR` between indexed columns** can defeat indexing — falls back to index merge or full scan. Often slower than `UNION` of two indexed queries. Profile with `EXPLAIN`.
- **Functions on indexed columns disable the index** — `WHERE DATE(created_at) = '2024-01-01'` cannot use it. Rewrite as `created_at >= '2024-01-01' AND created_at < '2024-01-02'`.
- **Leading wildcard kills it** — `WHERE name LIKE '%abc'` cannot use the index (no prefix to seek). `LIKE 'abc%'` can.
- **Implicit type conversion** kills the index — `WHERE varchar_col = 123` (int literal) makes MySQL cast every row's column → full scan. Match the literal's type to the column.
- **Equality first, range last** — `(status, created_at)` is better than `(created_at, status)` for `WHERE status = 1 ORDER BY created_at` because equality on `status` seeks to the block; `created_at` within that block is already sorted, so no filesort.
- **Cardinality matters** for column ordering when both are equality — put the more-selective column first to shrink the candidate set after the first seek.

## Related

- [[b_plus_tree_indexes]] — why "leftmost" is a structural consequence, not a config choice.
- [[innodb_locks]] — gap locks fire on the index range your query touched.
- `query_explain_optimization` *(planned)* — reading EXPLAIN output systematically.
- `covering_index_index_pushdown` *(planned)* — deeper dive on the optimisations.

---

## References

- MySQL docs: [Multiple-Column Indexes](https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html)
- MySQL docs: [Index Condition Pushdown Optimization](https://dev.mysql.com/doc/refman/8.0/en/index-condition-pushdown-optimization.html)

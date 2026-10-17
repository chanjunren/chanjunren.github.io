🗓️ 29042026 1615

# b_plus_tree_indexes

A B+ tree index keeps keys ordered across pages. Its height is usually small because each page can direct a search to many child pages. This makes point lookups and range scans efficient when the query can use the index.

## How a lookup works

1. The database reads an internal page and follows the child pointer for the key range.
2. It repeats until it reaches the leaf page.
3. The leaf entry identifies the row or the next index entry to scan.

Linked leaf pages make ordered scans efficient. Page size, fan-out, cache state, and tree occupancy vary, so there is no fixed number of disk reads for every lookup.

## Index variants

| Structure | Strength | Boundary |
|---|---|---|
| B+ tree | Ordered lookup and range scan | Updates may split, merge, or rebalance pages. |
| Hash index | Equality lookup | Does not provide ordered range traversal. |
| LSM tree | Batches writes across sorted files | Reads may check several levels; compaction adds background work. |

The best structure depends on the database engine and workload. See [[b_trees_comparisons]] and [[lsm_trees]].

## InnoDB clustered and secondary indexes

In InnoDB, the clustered index stores the table rows in primary-key order. If no primary key is declared, InnoDB selects a suitable unique non-null index or creates a hidden clustered key.

A secondary index stores its indexed columns and the primary-key columns needed to find the row in the clustered index. A lookup that needs other columns may therefore visit both indexes. A long primary key increases the size of secondary indexes.

These details are InnoDB-specific. PostgreSQL, for example, stores table rows in a heap and uses index entries that point to heap tuples.

## Query implications

- A composite index can support a leftmost prefix of its key columns; see [[composite_index_leftmost_prefix]].
- A covering index can answer a query from index entries without fetching the table row.
- InnoDB locking may use index records and gaps; see [[innodb_locks]].
- MVCC visibility is coordinated with row versions and read views; see [[mvcc_innodb_read_view]].

## References

- [MySQL 8.4: InnoDB clustered and secondary indexes](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html)
- [MySQL 8.4: Optimizing InnoDB queries](https://dev.mysql.com/doc/refman/8.4/en/optimizing-innodb-queries.html)
- [MySQL 8.4: InnoDB introduction](https://dev.mysql.com/doc/refman/8.4/en/innodb-introduction.html)

🗓️ 13082024 1600
📎

# innodb_gap_locks

- Lock on a gap between index records
	- or a lock on the gap before the first or after the last index record
	
```ad-example
`SELECT c1 FROM t WHERE c1 BETWEEN 10 and 20 FOR UPDATE;` 

- prevents other transactions from inserting a value of `15` into column `t.c1`
- Regardless of whether there is an existing value in the column
- Gaps between all existing values in the range are locked

```

## Gap
A gap might span a single index value, multiple index values, or even be empty.

- Part of the tradeoff between performance and concurrency, and are used in some transaction isolation levels and not others.
- Gap locking is not needed for statements that lock rows using a unique index to search for a unique row
- (This does not include the case that the search condition includes only some columns of a multiple-column unique index; in that case, gap locking does occur.)
- For example, if the `id` column has a unique index, the following statement uses only an index-record lock for the row having `id` value 100 and it does not matter whether other sessions insert rows in the preceding gap:


```sql
SELECT * FROM child WHERE id = 100;
```

If `id` is not indexed or has a nonunique index, the statement does lock the preceding gap.

It is also worth noting here that conflicting locks can be held on a gap by different transactions. For example, transaction A can hold a shared gap lock (gap S-lock) on a gap while transaction B holds an exclusive gap lock (gap X-lock) on the same gap. The reason conflicting gap locks are allowed is that if a record is purged from an index, the gap locks held on the record by different transactions must be merged.

Gap locks in `InnoDB` are “purely inhibitive”, which means that their only purpose is to prevent other transactions from inserting to the gap. Gap locks can co-exist. A gap lock taken by one transaction does not prevent another transaction from taking a gap lock on the same gap. There is no difference between shared and exclusive gap locks. They do not conflict with each other, and they perform the same function.

Gap locking can be disabled explicitly. This occurs if you change the transaction isolation level to [`READ COMMITTED`](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html#isolevel_read-committed). In this case, gap locking is disabled for searches and index scans and is used only for foreign-key constraint checking and duplicate-key checking.

There are also other effects of using the [`READ COMMITTED`](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html#isolevel_read-committed) isolation level. Record locks for nonmatching rows are released after MySQL has evaluated the `WHERE` condition. For `UPDATE` statements, `InnoDB` does a “semi-consistent” read, such that it returns the latest committed version to MySQL so that MySQL can determine whether the row matches the `WHERE` condition of the [`UPDATE`](https://dev.mysql.com/doc/refman/8.4/en/update.html "15.2.17 UPDATE Statement").

---

# References

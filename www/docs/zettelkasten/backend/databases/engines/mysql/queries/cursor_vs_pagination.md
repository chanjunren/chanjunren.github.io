🗓️ 30092024 1516

# cursor_vs_pagination

For APIs, “cursor pagination” often means keyset pagination: the response returns a continuation token based on the last row's sort key. It does not necessarily keep a database cursor open.

## Offset pagination

```sql
SELECT id, created_at
FROM orders
ORDER BY created_at, id
LIMIT 50 OFFSET 10000;
```

The database may need to find and discard the preceding rows. Deep offsets can become costly, and inserts or deletes before the offset can shift page boundaries.

## Keyset pagination

```sql
SELECT id, created_at
FROM orders
WHERE (created_at, id) > (:last_created_at, :last_id)
ORDER BY created_at, id
LIMIT 50;
```

This seeks after the last returned sort key. Use a stable total ordering, a unique tie-breaker, and an index that supports the filter and ordering. See [[keyset_cursor]].

## Choosing

- Use offset when users need direct page numbers and result sets are modest or stable.
- Use keyset when clients move sequentially through large or changing result sets.
- Use a database cursor for one server-side workflow that needs an open result position; see [[cursor]] and [[database_cursor]].

Neither pagination strategy automatically provides a consistent snapshot across requests. Define the desired behavior for concurrent inserts and updates.

## References

- [[keyset_cursor]]
- [[cursor]]
- [[database_cursor]]

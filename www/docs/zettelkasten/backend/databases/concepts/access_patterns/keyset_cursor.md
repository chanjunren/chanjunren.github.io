🗓️ 06072026 1200

# keyset_cursor

**Keyset pagination** continues after the last row's sort key. The client can carry those key values in an opaque cursor token; the database does not need to retain a cursor object between requests.

```mermaid
flowchart LR
    A[Last seen sort key] --> Q[WHERE key > last key]
    Q --> O[ORDER BY stable key]
    O --> L[Fetch next LIMIT rows]
    L --> N[Save final key for next page]
```

## Example

For a unique ordering on `(created_at, id)`, the next page can seek beyond the last returned row:

```sql
SELECT id, created_at
FROM orders
WHERE (created_at, id) > (:last_created_at, :last_id)
ORDER BY created_at, id
LIMIT :page_size;
```

Tuple comparison syntax and NULL ordering vary by database. The ordering must be deterministic, include a unique tie-breaker, and match an index when efficient seeks are required.

## Trade-offs

- Work is tied to the page size and index seek, rather than the number of skipped rows.
- Inserts before the cursor do not shift later pages as they do with offset pagination.
- It does not support jumping directly to an arbitrary page number.
- Updates to sort keys can move rows across the cursor boundary; snapshot guarantees depend on transaction design.
- The token should be validated and may need signing or encryption.

Elasticsearch's `search_after` uses the same continuation idea for sorted search hits; see [[search_after]]. A keyset cursor differs from a [[database_cursor]], which may keep server-side state.

## References

- [[b_plus_tree_indexes]]
- [[cursor_vs_pagination]]
- database cursor
- search after

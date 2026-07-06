🗓️ 06072026 1200

# keyset_cursor

```ad-note
A keyset cursor isn't a database object at all — it's an application-level convention. The "cursor" is just the last row's sort-key values, encoded and handed back to the client.
```

## What It Is

- Client sends back `(last_seen_id, last_seen_created_at)` — or an opaque token that encodes the same thing
- Next page: `WHERE (created_at, id) > (:last_created_at, :last_id) ORDER BY created_at, id LIMIT :n`
- No server-side state at all — the "position" lives entirely in the token, so it's stateless and shareable across requests, servers, even days apart
- Requires an index on the sort-key columns to stay fast (see [[b_plus_tree_indexes]]) — the `WHERE` clause seeks directly via the index instead of scanning

```ad-info
Also called **seek pagination** or the **seek method** in the wild — "keyset" refers to the indexed column(s) that make the seek fast.
```

## Why It Replaces Offset Pagination

`LIMIT`/`OFFSET` pagination forces the database to skip over every discarded row before reaching the requested page — the deeper the page, the slower the query. A keyset cursor seeks directly to the next row via the index, so cost stays flat regardless of page depth. See [[mysql_cursor_vs_pagination]] for the full comparison.

Elasticsearch's `search_after` is the same idea applied to search results — sort values from the last document become the seek point for the next page. See [[es_search_after]].

```ad-example
When people say an API is "cursor-paginated" (Stripe, GitHub, Relay's `after`/`before`), they mean a keyset cursor — an opaque string encoding the last row's sort key. No database cursor (see [[database_cursor]]) is open anywhere in that request.
```

## Trade-offs

- Can only move forward/backward relative to a known row — no "jump to page 50" like offset pagination allows
- Requires a stable, indexed sort order (usually a unique or tie-broken key) so the seek is unambiguous
- Slightly more work to implement than `OFFSET`, but the performance and consistency gains dominate at scale

---

## References
- [[database_cursor]]
- [[mysql_cursor_vs_pagination]]
- [[es_search_after]]
- [[b_plus_tree_indexes]]

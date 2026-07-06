🗓️ 06072026 1200

# database_cursor

```ad-note
A database cursor is a server-side object that holds an open, stateful pointer into a result set, allowing row-by-row traversal instead of operating on the set all at once.
```

## What It Is

- Declared with `DECLARE CURSOR`, then driven with `OPEN` / `FETCH` / `CLOSE`
- The database allocates resources to track your position — memory, and sometimes locks, for as long as the cursor is open
- Lives for the duration of a single session or transaction — not shareable across requests
- Built for **row-by-row procedural processing** inside a stored procedure or batch job, where the logic can't be expressed as a single set-based query

See [[mysql_cursor]] for the concrete syntax and lifecycle in MySQL.

## When to Use

- Iterating a result set row-by-row to apply procedural logic per row
- Multi-step transformations that can't be expressed in a single SQL statement
- Processing large datasets in smaller chunks without loading everything into memory

## When to Avoid

Set-based operations are almost always faster and simpler. Prefer cursors only when the per-row logic genuinely can't be expressed as a `JOIN`, subquery, or batched `UPDATE`/`INSERT`/`DELETE`.

```ad-warning
An open database cursor holds server-side state. If a web request opens one and the client never comes back (closed tab, dropped connection), that state leaks until it times out. This is why database cursors are the wrong tool for API pagination — see [[keyset_cursor]] for the pattern actually used there.
```

---

## References
- [[mysql_cursor]]
- [[keyset_cursor]]

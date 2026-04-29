🗓️ 29042026 1645
📎 #database #mysql #concurrency

# mvcc_innodb_read_view

> How InnoDB lets readers and writers run concurrently without blocking each other. The mechanism behind "non-locking reads" — and the reason `SELECT ... FOR UPDATE` exists when MVCC isn't strong enough on its own.

## The Problem MVCC Solves

Without MVCC: a SELECT either takes a shared lock (blocks writers) or reads dirty uncommitted data. Neither is good.

With MVCC: every row carries enough metadata to reconstruct **the version visible to a specific transaction's snapshot**. Readers never block, never see uncommitted data.

## Per-Row Hidden Columns

InnoDB adds three hidden columns to every row:

```ad-abstract
**DB_TRX_ID** — transaction ID that last modified this row.
**DB_ROLL_PTR** — pointer to the previous version of this row in the **undo log**.
**DB_ROW_ID** — internal row ID (only when no PK defined).
```

Updating a row writes a new version inline + chains the previous version into the undo log via `DB_ROLL_PTR`. Each row becomes a versioned linked list.

```
row "id=42" (current)
  ├─ DB_TRX_ID=105
  ├─ DB_ROLL_PTR ──► undo: balance=80, trx_id=103
                            └─ undo: balance=50, trx_id=100
```

## Read View

When a transaction starts a snapshot read, InnoDB builds a **Read View**:

```ad-abstract
**m_ids**           — list of transaction IDs active at snapshot creation time.
**min_trx_id**      — smallest active trx_id (lowest in m_ids).
**max_trx_id**      — next trx_id to be assigned (upper bound).
**creator_trx_id**  — your own transaction's ID.
```

## Visibility Algorithm

To decide if a row version (with `trx_id = T`) is visible to your read view:

1. `T == creator_trx_id` → visible (your own writes).
2. `T < min_trx_id` → visible (committed before your snapshot).
3. `T >= max_trx_id` → invisible (started after your snapshot).
4. `T in m_ids` → invisible (was active when your snapshot was taken).
5. `T not in m_ids` (and `min_trx_id ≤ T < max_trx_id`) → visible (committed by snapshot time).

If invisible, follow `DB_ROLL_PTR` to the previous version, repeat. Walk the undo chain until a visible version is found, or the chain ends (the row didn't exist).

## Read Committed vs Repeatable Read

| Level | When is the Read View created?           | Effect                                                      |
|-------|------------------------------------------|-------------------------------------------------------------|
| RC    | Per-statement (refreshed on every SELECT) | Each query sees the latest committed state. Non-repeatable. |
| RR    | Per-transaction (created at first SELECT) | Whole txn sees one consistent snapshot. Repeatable reads.   |

This is the *only* difference in InnoDB's MVCC behaviour between RC and RR — when the read view gets built.

## What MVCC Does NOT Cover

- **Phantom reads** under RR for current reads (`SELECT ... FOR UPDATE`, `INSERT`). MVCC's snapshot reads are phantom-free, but locking reads use **gap + next-key locks** to prevent phantoms — see [[innodb_locks]].
- **Write skew** — two transactions read overlapping data and write back, both based on stale views. RR allows this; only Serializable forbids it.
- **Lost updates** — if you SELECT-modify-UPDATE without a lock, two txns can stomp each other. Use `SELECT ... FOR UPDATE` or optimistic versioning. See [[concurrency_control]].

## Costs and Gotchas

- **Long-running txns bloat the undo log** — InnoDB can't purge undo records still visible to *some* active read view. A 1-hour reporting query holds undo for the entire duration.
- **Undo growth → tablespace bloat → slower lookups** as the version chain lengthens.
- **`information_schema.innodb_trx`** — find long-running txns hogging undo.
- **DDL invalidates snapshots** — schema change inside a snapshot read can produce surprising errors.

## Common Pitfalls

- **RR and phantom reads** — InnoDB RR blocks phantoms for *snapshot* reads via MVCC, and for *locking* reads via gap + next-key locks. Two mechanisms, same observable effect; people often conflate them.
- **RR is not serializable** — write skew is permitted. InnoDB RR ≈ snapshot isolation, not the SQL standard's strict RR.
- **An uncommitted row carries the writing txn's id** — the visibility check sees it in `m_ids` and rejects the version, walking the undo chain to an older one.
- **Your own uncommitted writes are visible** — `creator_trx_id` check (rule 1) makes you always see your own writes regardless of snapshot timing.
- **RC is sometimes preferred in production** — less undo retention, less lock contention from gap locks (RC doesn't take them in many cases). Trade-off: non-repeatable reads in long transactions.

## Related

- [[ACID]] — MVCC implements I (isolation).
- [[concurrency_control]] — MVCC is one approach; pessimistic locking is the other.
- [[innodb_locks]] — gap + next-key locks for current reads.
- `transaction_isolation_levels` *(planned)* — full anomaly matrix per level.

---

## References

- "High Performance MySQL" 4th ed., ch. 1 + 8
- MySQL docs: [InnoDB Multi-Versioning](https://dev.mysql.com/doc/refman/8.0/en/innodb-multi-versioning.html)

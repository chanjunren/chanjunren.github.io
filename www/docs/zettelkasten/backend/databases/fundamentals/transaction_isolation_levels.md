🗓️ 29042026 1700
📎 #database #concurrency

# transaction_isolation_levels

> The four levels in the SQL standard, the anomalies they each forbid, and the awkward fact that "Repeatable Read" means different things in MySQL InnoDB vs PostgreSQL. Picking the wrong level produces silent correctness bugs you only see in production.

## The Anomalies (read these first)

```ad-abstract
**Dirty read** — read a value written by an uncommitted txn that may roll back.
**Non-repeatable read** — same SELECT in one txn returns different values because another txn committed in between.
**Phantom read** — same range query returns different *rows* (new ones inserted, deleted) by another committed txn.
**Lost update** — two txns read same value, both modify it, second commit wipes first's change.
**Write skew** — two txns read overlapping data, write disjoint rows; result violates an invariant neither txn alone could violate.
```

## The Standard Four Levels

| Level                | Dirty read | Non-repeatable | Phantom | Lost update | Write skew |
|----------------------|------------|----------------|---------|-------------|------------|
| Read Uncommitted     | Allowed    | Allowed        | Allowed | Allowed     | Allowed    |
| Read Committed (RC)  | Forbidden  | Allowed        | Allowed | Allowed     | Allowed    |
| Repeatable Read (RR) | Forbidden  | Forbidden      | Allowed | Allowed*    | Allowed    |
| Serializable         | Forbidden  | Forbidden      | Forbidden | Forbidden | Forbidden  |

\* Lost update prevention is implementation-specific. PostgreSQL RR detects and aborts lost updates ("first committer wins"); MySQL InnoDB does not without explicit `SELECT ... FOR UPDATE`.

## Where Each Level Sits in Practice

| DB              | Default level | "RR" implementation                              |
|-----------------|---------------|--------------------------------------------------|
| MySQL InnoDB    | **RR**        | Snapshot read (MVCC) + gap+next-key locks for current reads → **phantom-free in practice** |
| PostgreSQL      | **RC**        | RR is "Snapshot Isolation"; phantom-free but allows write skew |
| SQL Server      | RC            | RR is true RR (lock-based); separate "Snapshot" level for SI |
| Oracle          | RC            | "Serializable" is actually Snapshot Isolation    |

The takeaway: **"RR" is not a fixed thing across DBs**. Always pin down which engine before reasoning about behaviour.

## Snapshot Isolation (the elephant in the room)

Postgres RR (and Oracle "Serializable") give Snapshot Isolation:

- Each txn sees a consistent snapshot of committed data at its start.
- No dirty reads, no non-repeatable reads, no phantoms.
- **Write skew still possible** — see classic example below.

The SQL standard doesn't define SI. So vendors slot it into "RR" or "Serializable" depending on marketing.

## Write Skew Worked Example

Two doctors on call. Constraint: at least one must be on call. Both query "is anyone else on call?" — both see another doctor still on call. Both decide they can go off-call. Both UPDATE. Both succeed under SI/RR. Now zero doctors on call. Constraint violated.

Only true Serializable (Postgres SSI, MySQL `SERIALIZABLE` with full locking) prevents this.

## How Each Level Is Implemented

| Level | Typical mechanism                                                           |
|-------|-----------------------------------------------------------------------------|
| RU    | No read locks; reads are unprotected.                                       |
| RC    | Short read locks (released at end of statement); MVCC reads in InnoDB/PG.   |
| RR    | Long read locks held to txn end (lock-based) **or** snapshot per txn (MVCC).|
| Serializable | True 2PL or SSI (Serializable Snapshot Isolation in Postgres).        |

## Common Pitfalls

- **The SQL standard says RR allows phantoms** — but MySQL InnoDB RR blocks them via gap locks, and PostgreSQL RR blocks them via snapshot. The standard underspecifies; vendors went further.
- **MySQL RR vs PostgreSQL RR** — MySQL takes gap locks for current reads (`SELECT ... FOR UPDATE`); PG uses pure snapshot. PG RR allows write skew; MySQL RR's locking pattern depends on the read mode.
- **RC as a production default** — less locking, fewer deadlocks, smaller undo footprint. Application code handles concurrency via optimistic versioning or explicit `FOR UPDATE`.
- **Snapshot Isolation is not Serializable** — write skew slips through SI. PostgreSQL SSI was added specifically to plug this.
- **Serializable is expensive** — can effectively serialise execution under contention. Used sparingly for invariants that cannot be enforced via constraints, locks, or app-level versioning.

## Choosing a Level

- Default to RC unless you have a reason. Explicit `SELECT ... FOR UPDATE` for cases that need stricter guarantees.
- Use RR if your app assumes consistent reads across multiple statements (reporting, snapshot queries).
- Use Serializable only when invariants can't be enforced via constraints, locks, or application-level versioning.

## Related

- [[ACID]] — I = Isolation, parameterised by these levels.
- [[mvcc_innodb_read_view]] — how InnoDB implements RC and RR via snapshots.
- [[innodb_locks]] — gap and next-key locks for phantom prevention.
- [[concurrency_control]] — pessimistic vs optimistic; this zettel is the concrete instantiation.

---

## References

- Berenson et al., "A Critique of ANSI SQL Isolation Levels" (1995) — origin of the anomaly framing
- "Designing Data-Intensive Applications" ch. 7
- PostgreSQL docs: [Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

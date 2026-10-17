🗓️ 01112024 2123

# ACID
## Atomic
 **Atomicity** makes a transaction commit as one unit or abort without committing its partial changes.

> If any steps between the transactions fail, all other steps must also fail or be reverted 

| Term     | Description                            |
| -------- | -------------------------------------- |
| `commit` | successful completion of a transaction |
| `abort`  | failure of a transaction               |
## Consistent
 **Consistency** means a committed transaction preserves the database's declared constraints and invariants.

> If you execute the transaction all by itself on a database that’s initially consistent, then when the transaction finishes executing the database is again consistent


## Isolated
 **Isolation** controls which effects concurrent transactions can observe. The guarantee depends on the isolation level; not every level is equivalent to serial execution.


| Term              | Description                                                               |
| ----------------- | ------------------------------------------------------------------------- |
| `serializability` | Concurrent transactions have results equivalent to some serial order. |
| `isolation level` | A named contract describing visibility and concurrency behavior for transactions. |

## Durable
 **Durability** means committed results survive failures covered by the database's durability guarantees.

---

## References
- https://www.oracle.com/sg/database/what-is-oltp/

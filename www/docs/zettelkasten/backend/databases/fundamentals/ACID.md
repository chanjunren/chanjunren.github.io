🗓️ 01112024 2123

# ACID
## Atomic
 Atomicity controls guarantee that all the steps in a transaction are **completed successfully as a group**

> If any steps between the transactions fail, all other steps must also fail or be reverted 

| Term     | Description                            |
| -------- | -------------------------------------- |
| `commit` | successful completion of a transaction |
| `abort`  | failure of a transaction               |
## Consistent
The transaction preserves the **internal consistency** of the database

> If you execute the transaction all by itself on a database that’s initially consistent, then when the transaction finishes executing the database is again consistent


## Isolated
The transaction executes as if it were running alone, with no other transactions


| Term              | Description                                                               |
| ----------------- | ------------------------------------------------------------------------- |
| `serializability` | effect of running a set of transactions is the same as running them alone |
> Usually implemented by locking specific rows in the table

## Durable
The transaction’s results will not be lost in a failure

---

## References
- https://www.oracle.com/sg/database/what-is-oltp/

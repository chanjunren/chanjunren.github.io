🗓️ 13082024 1203
📎 #inno_db 

# innodb_transaction_isolation_levels

Define the degree to which a transaction is isolated from the effects of other concurrent transactions

Higher isolation levels offer stronger guarantees of data consistency but can also lead to increased locking and the potential for deadlocks.

## Isolation Levels

### READ UNCOMMITTED
Transactions can read uncommitted changes made by other transactions.
- Lowest isolation level 
- Offers **no protection** against
	- dirty reads
	- non-repeatable reads
	- phantom reads

> Rarely used in practice due to its lack of data consistency guarantees
### READ COMMITTED
Transactions can only read committed data from other transactions.
    - Protects against dirty reads but not against non-repeatable reads or phantom reads.
    - Commonly used when some level of inconsistency is acceptable.
	
### REPEATABLE READ 
- Inno_DB's default 
- Transactions see a consistent snapshot of the data as it existed at the start of the transaction.
- Protects against 
	- dirty reads 
	- non-repeatable reads 
- Doesn't protect against
	- phantom reads (unless using `gap locking` or `SELECT ... FOR UPDATE`)
- A good balance between **consistency** and **concurrency** for many applications

### SERIALIZABLE
    
- Transactions executed as if they were running serially
- Provides the **highest** level of consistency 
- Protects against all concurrency issues.
- Can **significantly impact performance** due to 
	- Increased locking 
	- Potential for deadlocks

### How Isolation Levels Affect Deadlocks
- **Higher Isolation Levels:** 
	- Generally lead to more locking
	- Increased likelihood of deadlocks
> Because transactions hold locks for longer durations to ensure consistency

- **Lower Isolation Levels:** 
	- Reduce the likelihood of deadlocks  (i.e. allow transactions to read without acquiring exclusive locks)
	- Reduced data consistency guarantees

---

# References
- Gemini
- TO READ: https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html

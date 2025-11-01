🗓️ 13082024 1100
📎 #wip #inno_db

# innodb_deadlocks

## Logs study
```
------------------------
LATEST DETECTED DEADLOCK
------------------------
2024-08-13 09:36:09 0x7fae7ee8a700
*** (1) TRANSACTION:
TRANSACTION 8912811226, ACTIVE 0 sec starting index read
mysql tables in use 1, locked 1
LOCK WAIT 9 lock struct(s), heap size 1136, 5 row lock(s), undo log entries 4
MySQL thread id 1118382, OS thread handle 140387448583936, query id 286359804 10.254.104.178 okcoin updating
update
    otc_merchant_audit
SET modify_date = '2024-08-13 09:36:09.684' ,
    deleted = 1
WHERE (  user_id = 7000000000123103
    and deleted = 0
    and id <> 2541 )

*** (1) WAITING FOR THIS LOCK TO BE GRANTED:
RECORD LOCKS space id 26094 page no 48 n bits 784 index idx_uid of table `okcoin_c2c_open`.`otc_merchant_audit` trx id 8912811226 lock_mode X waiting
Record lock, heap no 713 PHYSICAL RECORD: n_fields 2; compact format; info bits 0
 0: len 8; hex 8018de76816f60e0; asc    v o` ;;
 1: len 8; hex 80000000000009ec; asc         ;;

*** (2) TRANSACTION:
TRANSACTION 8912811219, ACTIVE 0 sec starting index read
mysql tables in use 1, locked 1
7 lock struct(s), heap size 1136, 3 row lock(s), undo log entries 4
MySQL thread id 1118752, OS thread handle 140387430213376, query id 286360090 10.254.104.178 okcoin updating
update
		 otc_merchant_audit
		 SET modify_date = '2024-08-13 09:36:09.876' ,
		deleted = 1
		 WHERE (  user_id = 7000000000123104
									and deleted = 0
									and id <> 2540 )
*** (2) HOLDS THE LOCK(S):
RECORD LOCKS space id 26094 page no 48 n bits 784 index idx_uid of table `okcoin_c2c_open`.`otc_merchant_audit` trx id 8912811219 lock_mode X locks rec but not gap
Record lock, heap no 713 PHYSICAL RECORD: n_fields 2; compact format; info bits 0
 0: len 8; hex 8018de76816f60e0; asc    v o` ;;
1: len 8; hex 80000000000009ec; asc         ;;

*** (2) WAITING FOR THIS LOCK TO BE GRANTED:
RECORD LOCKS space id 26094 page no 48 n bits 784 index idx_uid of table `okcoin_c2c_open`.`otc_merchant_audit` trx id 8912811219 lock_mode X waiting
Record lock, heap no 713 PHYSICAL RECORD: n_fields 2; compact format; info bits 0
 0: len 8; hex 8018de76816f60e0; asc    v o` ;;
 1: len 8; hex 80000000000009ec; asc         ;;

*** WE ROLL BACK TRANSACTION (2)
```

**Overall Situation**

The output describes a deadlock scenario involving two transactions (identified as 8912811226 and 8912811219). Both transactions were attempting to update the `otc_merchant_audit` table, leading to a conflict and ultimately a deadlock. MySQL resolved this by rolling back transaction (2).

**Breakdown of Each Transaction**

**TRANSACTION (1)**

- It was in the process of starting an index read operation.
- It was using 1 table and had locked 1 table.
- It was waiting for 9 lock structures and had 5 row locks.
- The SQL query it was executing was an `UPDATE` statement on the `otc_merchant_audit` table, setting `modify_date` and `deleted` for a specific row (where `user_id = 7000000000123103` and `deleted = 0` and `id <> 2541`).
- It was waiting for an exclusive lock (lock_mode X) on a record in the `idx_uid` index of the `otc_merchant_audit` table.

**TRANSACTION (2)**

- It was also in the process of starting an index read operation
- It was using 1 table and had locked 1 table
- It held 7 lock structures and had 3 row locks
- The SQL query it was executing was also an `UPDATE` statement on the `otc_merchant_audit` table, setting `modify_date` and `deleted` for a specific row (where `user_id = 7000000000123104` and `deleted = 0` and `id <> 2540`).
- It held an exclusive lock on the same record in the `idx_uid` index that transaction (1) was waiting for.
- It was also waiting for an exclusive lock on the same record, creating a circular wait condition (deadlock).

**Resolution**

MySQL detected the deadlock and decided to roll back TRANSACTION (2) to break the deadlock. This allows TRANSACTION (1) to proceed and acquire the lock it was waiting for.

**Key Points & Insights**

- Both transactions were trying to update the same record (or at least records that fall within the same index range) in the `otc_merchant_audit` table, leading to the lock conflict
- The `idx_uid` index seems to be crucial in this deadlock scenario
- MySQL's deadlock detection mechanism successfully identified and resolved the deadlock
- Rolling back a transaction is a common way to resolve deadlocks, but it can lead to application-level errors if not handled properly

**Potential Next Steps**

- Review the application logic that leads to these concurrent updates on the same record(s)
- Consider optimizing the queries or using different transaction isolation levels to reduce the likelihood of deadlocks.
- Ensure that the application can gracefully handle transaction rollbacks caused by deadlocks

If you want, you can share other sections of the InnoDB Status output or provide more context about your application and database schema, and I'll be happy to offer further insights.


You're absolutely right to question this! Let's clarify the situation.

**What's Happening**

The deadlock message indicates that both transactions are waiting for an exclusive lock on the _same physical record_ within the `idx_uid` index. Even though the `user_id` values in the `WHERE` clauses of the two `UPDATE` statements are different, it's possible for them to lead to contention on the same index record.

Here's how:

- **Index Structure:** The `idx_uid` index is a B-tree index on the `user_id` column. B-tree indexes store data in a sorted manner, allowing for efficient searching and range scans.
- **Range Locks:** InnoDB often uses _range locks_ on indexes to prevent phantom reads (a phenomenon where new rows that satisfy a search condition appear within a transaction). These range locks can cover multiple index records, even if the query itself only affects a single row.
- **Deadlock Scenario:** In your case, it's likely that the `user_id` values 7000000000123103 and 7000000000123104 are close enough in the index that the range locks acquired by the two transactions overlap. This overlap causes the deadlock because each transaction is waiting for the other to release its lock.

**Visual Representation**

Imagine the `idx_uid` index as a sorted list of `user_id` values:

```
...
7000000000123100
7000000000123102
7000000000123103  <-- Transaction 1 wants to update this row
7000000000123104  <-- Transaction 2 wants to update this row
7000000000123105
...
```

Even though each transaction targets a different `user_id`, their range locks might look something like this:

```
...
7000000000123100
[===================]  <-- Transaction 1's range lock
          [===================]  <-- Transaction 2's range lock
7000000000123105
...
```

The overlap in the range locks causes the deadlock.

**Key Takeaway**

Even if your queries target different rows based on unique values, deadlocks can still occur if those values are close together in an index, leading to overlapping range locks.

**Further Investigation & Mitigation**

- **Analyze Query Plans:** Use `EXPLAIN` to see the exact locking behavior of your queries.
- **Consider Isolation Levels:** If your application can tolerate some level of inconsistency, you might consider using a lower isolation level (like `READ COMMITTED`) to reduce the likelihood of deadlocks. However, carefully weigh the trade-offs before making such a change.
- **Optimize Queries:** If possible, restructure your queries or application logic to minimize contention on the same index ranges.

Feel free to ask if you have more questions or want to explore specific mitigation strategies!

---

## References

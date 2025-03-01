🗓️ 02032025 0119
📎

# innodb_locks

## row level
Locking mechanisms help ensure consistency, prevent conflicts, and control concurrency in transactions. Here's an enhanced breakdown including **why each lock is used**.

| **Lock Type**               | **Description**                                                 | **Why It’s Used (Purpose)**                                                                                      | **Example**                                             |
| --------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Shared Lock (S Lock)**    | Allows multiple transactions to read a row but prevents writes. | Ensures **consistent reads** while preventing modifications.                                                     | `SELECT * FROM orders WHERE id = 1 LOCK IN SHARE MODE;` |
| **Exclusive Lock (X Lock)** | Prevents both reads and writes by other transactions.           | Ensures **atomic updates** by preventing any other transaction from reading or modifying the row.                | `UPDATE orders SET amount = 500 WHERE id = 1;`          |
| **Record Lock**             | Locks a single row in an indexed column.                        | Prevents **other transactions from modifying the locked row**, ensuring **data integrity** in concurrent writes. | `UPDATE employees SET salary = 5000 WHERE id = 1;`      |


## row level (index based)

| **Lock Type**     | **Description**                                                                                                     | **Why It’s Used (Purpose)**                                                                                          | **Example**                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Gap Lock**      | Prevents inserts into a range of values between existing rows. Used to prevent **phantom reads**.                   | Ensures **repeatable reads** by preventing new records from being inserted in a scanned range.                       | `SELECT * FROM users WHERE age > 30 FOR UPDATE;` |
| **Next-Key Lock** | Combination of a record lock and a gap lock, preventing both modifications to a row and inserts into adjacent gaps. | Prevents [[phantom_reads]] and ensures **consistent transactions** by locking the selected row and surrounding gaps. | Used in `REPEATABLE READ` isolation.             |

## table level

| **Lock Type**                          | **Description**                                                        | **Why It’s Used (Purpose)**                                                                                                  | **Example**                                          |
| -------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Intention Shared Lock (IS Lock)**    | Indicates intent to acquire a shared lock on specific rows.            | Allows **multiple transactions to read** different rows without locking the entire table.                                    | Acquired when using `SELECT ... LOCK IN SHARE MODE;` |
| **Intention Exclusive Lock (IX Lock)** | Indicates intent to acquire an exclusive lock on some rows.            | Ensures that a **transaction can modify rows** while allowing other transactions to modify different rows in the same table. | Acquired when using `UPDATE`, `DELETE`, or `INSERT`. |
| **Table Lock**                         | Locks the entire table, blocking all reads and writes.                 | Used when **bulk operations** need to be performed without interference from other transactions.                             | `LOCK TABLES orders WRITE;`                          |
| **Auto-Increment Lock**                | Special lock used for incrementing values in `AUTO_INCREMENT` columns. | Ensures that **each new row gets a unique auto-increment value** in high-concurrency scenarios.                              | Happens when inserting rows with `AUTO_INCREMENT`.   |

---

### **Key Takeaways**

- **Record Locks** → Used for **modifying** specific rows.
- **Gap Locks & Next-Key Locks** → Prevent **phantom reads** in `REPEATABLE READ`.
- **Table Locks** → Used for **bulk updates** but can cause performance bottlenecks.
- **Auto-Increment Locks** → Prevents duplicate **ID assignments**.
---
# References

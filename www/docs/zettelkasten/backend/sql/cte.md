🗓️ 02092025 1020

# cte

A **common table expression (CTE)** names intermediate query results, making complex queries easier to organize.

## CTE definition

It is defined with `WITH` and scoped to one statement. A named CTE can improve readability and reuse.

`WITH recent_orders AS (   SELECT id, user_id, created_at   FROM orders   WHERE created_at > NOW() - INTERVAL '30 days' ) SELECT user_id, COUNT(*) AS total_orders FROM recent_orders GROUP BY user_id;`

### Key traits

- Defined **once**, referenced **many times**.
- Scope = **the main query only**.
- Can chain multiple CTEs in one `WITH` block.

## CTE benefits

|**Use Case**|**Why CTEs Help**|
|---|---|
|**Readability**|Break complex queries into logical steps|
|**Reusability**|Avoid repeating the same subquery multiple times|
|**Composability**|Chain transformations easily|
|**Recursive traversal**|Useful for trees, hierarchies, and graphs|

## Non-recursive CTEs

A non-recursive CTE does not refer to itself. Its execution strategy depends on the database engine and query.

`WITH top_customers AS (   SELECT user_id, SUM(amount) AS total_spent   FROM orders   GROUP BY user_id   HAVING SUM(amount) > 5000 ) SELECT u.name, t.total_spent FROM users u JOIN top_customers t ON u.id = t.user_id;`

### Execution

- Engines may materialize a CTE or inline it when eligible.
- PostgreSQL can inline eligible non-recursive CTEs.
- MySQL materializes recursive CTEs.
- Acts like a temporary view.

## Recursive CTEs

A CTE becomes **recursive** when it **references itself** in its definition.  
Used for **hierarchical data**, **graphs**, **paths**, **ancestor/descendant trees**.

### Structure

`WITH RECURSIVE cte_name AS (     -- Anchor (base case)     SELECT ...     FROM ...     WHERE ...      UNION ALL      -- Recursive member (self-referencing step)     SELECT ...     FROM ...     JOIN cte_name c ON ... ) SELECT * FROM cte_name;`

### Key points

- Requires `WITH RECURSIVE` (in Postgres/MySQL 8+).
- **Anchor** = starting rows.
- **Recursive step** = generates the “next level”.
- Stops when a step returns no rows or an engine limit applies.

## Recursive traversal example

### Example problem

Get all employees reporting under a specific manager.

`WITH RECURSIVE subordinates AS (     -- Anchor: start from the given manager     SELECT id, name, manager_id     FROM employees     WHERE id = 1  -- CEO      UNION ALL      -- Recursive step: find direct reports     SELECT e.id, e.name, e.manager_id     FROM employees e     JOIN subordinates s ON e.manager_id = s.id ) SELECT * FROM subordinates;`

### Execution steps

1. Start with `id=1` (anchor row).
2. Find employees where `manager_id=1`.
3. For each result, repeat the process.
4. Stops when there are no more reports.

## Recursive CTE execution

- An engine **splits** recursive evaluation into:
  - **Anchor member** → initial result set.
  - **Recursive member** → applied repeatedly.
- Maintains a **working table** for “new rows”.
- Iterates until no more rows are added.

`Iteration 1 → Anchor rows Iteration 2 → Anchor + Recursive step 1 Iteration 3 → Previous + Recursive step 2 ... Stops when Recursive step returns 0 rows.`

## Performance

|**Tip**|**Why**|
|---|---|
|Use `UNION ALL` instead of `UNION`|Avoids unnecessary de-duplication work|
|Deduplicate early (`DISTINCT`)|Prevents exponential growth|
|Carry fewer columns|Smaller working sets = less memory|
|Add indexes on join keys|Recursive joins become faster|
|Limit recursion depth if needed|Prevent runaway loops|

## Quick summary

|**Type**|**Keyword**|**Self-Reference**|**Evaluated**|**Use Case**|
|---|---|---|---|---|
|Non-recursive|`WITH`|❌ No|Once|Simplify queries|
|Recursive|`WITH RECURSIVE`|✅ Yes|Iteratively|Trees, graphs|

## References

- [PostgreSQL `WITH` queries](https://www.postgresql.org/docs/current/queries-with.html)
- [MySQL `WITH` clause](https://dev.mysql.com/doc/refman/8.0/en/with.html)
- [MySQL CTE materialization](https://dev.mysql.com/doc/refman/8.4/en/derived-table-optimization.html)

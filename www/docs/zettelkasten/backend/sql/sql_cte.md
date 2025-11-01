🗓️ 02092025 1020

# sql_cte

# 📝 SQL CTE Cheatsheet

## **1. What is a CTE?**

A **Common Table Expression (CTE)** is a **temporary result set** defined using `WITH` and used within a single query.  
Think of it like creating a **named subquery** that improves **readability** and **reusability**.

`WITH recent_orders AS (   SELECT id, user_id, created_at   FROM orders   WHERE created_at > NOW() - INTERVAL '30 days' ) SELECT user_id, COUNT(*) AS total_orders FROM recent_orders GROUP BY user_id;`

**Key traits** ✅
- Defined **once**, referenced **many times**.
- Scope = **the main query only**.
- Can chain multiple CTEs in one `WITH` block.

## **2. Why Use a CTE?**

|**Use Case**|**Why CTEs Help**|
|---|---|
|**Readability**|Break complex queries into logical steps|
|**Reusability**|Avoid repeating the same subquery multiple times|
|**Composability**|Chain transformations easily|
|**Recursive traversal**|Perfect for trees, hierarchies, and graphs|
## **3. Non-Recursive CTEs**

Most CTEs are **non-recursive** → evaluated **once** like a normal subquery.

`WITH top_customers AS (   SELECT user_id, SUM(amount) AS total_spent   FROM orders   GROUP BY user_id   HAVING SUM(amount) > 5000 ) SELECT u.name, t.total_spent FROM users u JOIN top_customers t ON u.id = t.user_id;`

**Execution** 🧠
- CTE is materialized **once**.
- The query planner **inlines** it in many engines (Postgres, MySQL 8+).
- Acts like a temporary view.

## **4. Recursive CTEs**

A CTE becomes **recursive** when it **references itself** in its definition.  
Used for **hierarchical data**, **graphs**, **paths**, **ancestor/descendant trees**.

### Structure

`WITH RECURSIVE cte_name AS (     -- Anchor (base case)     SELECT ...     FROM ...     WHERE ...      UNION ALL      -- Recursive member (self-referencing step)     SELECT ...     FROM ...     JOIN cte_name c ON ... ) SELECT * FROM cte_name;`

**Key points** ✅
- Requires `WITH RECURSIVE` (in Postgres/MySQL 8+).
- **Anchor** = starting rows.
- **Recursive step** = generates the “next level”.
- Stops when the recursive step returns **0 new rows**.

## **5. Simple Recursive Example**
**Problem**: Get all employees reporting under a specific manager.

`WITH RECURSIVE subordinates AS (     -- Anchor: start from the given manager     SELECT id, name, manager_id     FROM employees     WHERE id = 1  -- CEO      UNION ALL      -- Recursive step: find direct reports     SELECT e.id, e.name, e.manager_id     FROM employees e     JOIN subordinates s ON e.manager_id = s.id ) SELECT * FROM subordinates;`

**How it works** 🧠
1. Start with `id=1` (anchor row).
2. Find employees where `manager_id=1`.
3. For each result, repeat the process.
4. Stops when there are no more reports.

## **6. How the Engine Executes Recursive CTEs**
- Engine **splits** the recursive CTE into:
    - **Anchor member** → initial result set.
    - **Recursive member** → applied repeatedly.
- Maintains a **working table** for “new rows”.
- Iterates until no more rows are added.

`Iteration 1 → Anchor rows Iteration 2 → Anchor + Recursive step 1 Iteration 3 → Previous + Recursive step 2 ... Stops when Recursive step returns 0 rows.`

## **7. Performance Tips**

|**Tip**|**Why**|
|---|---|
|Use `UNION ALL` instead of `UNION`|Avoids unnecessary de-duplication work|
|Deduplicate early (`DISTINCT`)|Prevents exponential growth|
|Carry fewer columns|Smaller working sets = less memory|
|Add indexes on join keys|Recursive joins become faster|
|Limit recursion depth if needed|Prevent runaway loops|

## **8. Quick Summary Table**

|**Type**|**Keyword**|**Self-Reference**|**Evaluated**|**Use Case**|
|---|---|---|---|---|
|Non-recursive|`WITH`|❌ No|Once|Simplify queries|
|Recursive|`WITH RECURSIVE`|✅ Yes|Iteratively|Trees, graphs|

---

Do you want me to also make a **visual diagram** showing:

---
## References

🗓️ 31082025 1113

# sql_recursion
## How Recursive CTEs Work

Recursive CTEs (`WITH RECURSIVE`) are commonly used for **hierarchies** and **graphs**.  
Think of them like a controlled loop.

|Step|What happens|Example in concept|
|---|---|---|
|**Seed / Anchor**|Start with a **base set** of rows.|`SELECT id, parent_id FROM table_edges WHERE depth=0`|
|**Recursive step**|Join previous results back to the table to get next-level rows.|`JOIN table_edges e ON e.id = a.parent_id`|
|**Termination**|Stops when no new rows are returned.|Implicit|
|**Materialization**|The engine stores all “visited” rows in a **working table** to avoid infinite loops.|Stored in memory or spilled to disk if big|

## Why Memory Usage Spikes

Recursive CTEs can be expensive because **each iteration accumulates rows**.  
Memory pressure builds up due to these factors:

| Cause                        | Why it’s heavy                                           | Example scenario                                                             |
| ---------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Large recursion frontier** | Each iteration multiplies rows.                          | Wide org chart, many ancestors.                                              |
| **Wide carried rows**        | More columns = larger working table.                     | Carrying `name`, `description`, `group_name` inside recursion unnecessarily. |
| **Early ORDER BY**           | Sorting intermediate results per iteration is expensive. | Sorting inside the recursion instead of at the end.                          |
| **Late filtering**           | Include irrelevant rows → filter later.                  | Join everything, then `WHERE group_name IS NOT NULL`.                        |
| **No deduplication**         | Same `(id, parent_id)` processed multiple times.         | No `DISTINCT` until very late.                                               |
| **Missing indexes**          | Each recursive step does a full table scan.              | No index on `id` or `parent_id`.                                             |

---
## References

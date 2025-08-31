🗓️ 31082025 1142
📎

# sql_joins

# 🗂 SQL Joins Cheatsheet

| **Join Type**       | **Keeps Rows From**                             | **When To Use**                                            | **Example Use Case**                               |
| ------------------- | ----------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------- |
| **INNER JOIN** ✅    | Matching rows in **both** tables                | When you **only need rows that exist in both** tables      | Get users **who have orders**                      |
| **LEFT JOIN**       | **All** rows from **left** + matches from right | When you need **all left rows**, even if no match on right | List all users + their orders (NULL if none)       |
| **RIGHT JOIN**      | **All** rows from **right** + matches from left | Rarely used; same as LEFT JOIN but reversed                | List all orders + user info (NULL if user deleted) |
| **FULL OUTER JOIN** | **All** rows from **both** tables               | When you want **everything**, matched or not               | Combine active + archived users                    |
| **CROSS JOIN**      | Cartesian product (all combinations)            | For **generating combinations** or test data               | Pair every product with every store                |
| **SELF JOIN**       | Table joins **itself**                          | Compare rows within the same table                         | Find employees who report to the same manager      |

---
# References

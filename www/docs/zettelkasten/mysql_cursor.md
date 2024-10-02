🗓️ 01102024 0944
📎 #mysql 

# mysql_cursor

## Overview

```ad-note
a database object used to **retrieve, manipulate, and traverse** over a set of rows resulting from a query
```

- Allow row-by-row processing of result sets, giving developers the ability to apply procedural logic to each row

| Standard SQL query                     | SQL Cursor                                                        |
| -------------------------------------- | ----------------------------------------------------------------- |
| Operate on entire sets of data at once | Allow more granular control over how data is accessed / processed |

## When to Use

SQL cursors are useful in situations where:
- You need to **iterate** through a result set row-by-row and apply specific logic to each row.
- Dealing with **procedural logic** 
	- Can't be easily expressed in a single SQL query (e.g., complex transformations, multi-step updates)
- Want to process the result set in **smaller chunks** 
- Avoid loading the entire dataset into memory, especially for large datasets

```ad-info
Refer to [[mysql_cursor_lifecycle]] for how to use a cursor
```

## Types

SQL supports various types of cursors

Differ based on how they handle the underlying data and whether they allow modifications

###  Implicit Cursors
- Automatically created by the SQL engine to handle single-row queries like `SELECT INTO`
- Used for **simple, single-row queries**
- Less control for the developer, but are lightweight and automatic

### Explicit Cursors

- Declared by the developer for **multi-row queries** where row-by-row processing is required.
- More control is given to the developer in terms of how to open, fetch, and close the cursor.

### Cursor Types Based on Scrollability and Sensitivity
| Type          | Description                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| Forward-Only  | Can only move forward through result set                                                                           |
| Scrollable    | Allows movement in both directions / jumping to specific rows                                                      |
| Static        | Create a snapshot of the result set at the time cursor is opened > **READ ONLY RESULT** > Result set is unaffected |
| Dynamic       | Reflect changes to data                                                                                            |
| Keyset-Driven | Set of rows fixed when cursor is opened, content of rows can reflect changes in DB                                 |

## Advantages 
- Row-by-Row Processing 
- Control over Data Processing - Can handle each row in a result set individually, applying complex logic or transformations to each row.
- Handles Large Data Sets 
	- Cursors can fetch smaller chunks of data 
	- one row or a batch at a time
	- preventing memory overload for very large result sets

## Disadvantages of Cursors
- **Performance Overhead** - Can be slower than set-based operations because they process rows one by one
- **Locks and Resource Usage**
	- May hold locks on rows
	- Consume memory while open > contention / resource exhaustion in systems with heavy concurrent use.
- **Code Complexity** 
	- Cursors add complexity to your SQL code
	- Harder to read and maintain compared to set-based queries.

## When to Avoid Cursors

In most cases, it's recommended to avoid cursors if possible and use **set-based operations**, which are more efficient. Common alternatives include:

- **Using JOINs and Subqueries**: If the logic can be expressed in SQL, you should prefer writing set-based queries that operate on multiple rows at once.
- **Batch Processing**: Instead of using a cursor to process each row individually, you can use SQL `UPDATE`, `INSERT`, or `DELETE` statements that operate on multiple rows at once.

---

# References
- ChatGPT

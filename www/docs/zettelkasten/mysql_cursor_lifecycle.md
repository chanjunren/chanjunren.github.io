🗓️ 02102024 1035
📎 #mysql #wip

# mysql_cursor_lifecycle

```ad-abstract
Step-by-step process that illustrates how cursors are typically used in SQL
```

## Declare the Cursor

Defines the query whose result set the cursor will traverse

```sql
DECLARE cursor_name CURSOR FOR SELECT column1, column2 FROM table_name WHERE condition;
```

## Open the Cursor

Allocates the memory for the cursor and populates it with the result set

```sql
OPEN cursor_name;
```

## Fetch Data from the Cursor

Can fetch one row at a time or multiple rows (depending on the cursor type [[mysql_cursor]])

```sql
FETCH NEXT FROM cursor_name INTO @variable1, @variable2;
```

| Command | Description                                             |
| ------- | ------------------------------------------------------- |
| `FETCH` | Retrieve individual rows from the cursor                |
| `NEXT`  | Retrieves next row in result set                        |
| `INTO`  | Specifies variables where fetched values will be stored |

> You can continue to fetch rows until no more rows are available.

## Process Each Row

As each row is fetched, you can process it using procedural logic (e.g., updating values, inserting into another table, or performing calculations).

## Close the Cursor

Release any locks or resources held by the cursor

```mysql
CLOSE cursor_name;
```

## Deallocate the Cursor

Optionally, after closing the cursor, you can deallocate it to remove the cursor from memory

```sql
DEALLOCATE cursor_name;
```


---

# References

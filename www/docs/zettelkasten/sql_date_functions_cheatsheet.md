🗓️ 19042024 1430
📎 #sql #backend

# sql_date_functions_cheatsheet

> Current date and time.

```sql
  SELECT NOW();
```

> Current Date

```sql
SELECT CURDATE();
```

> Adds a specified time interval to a date.

```sql
SELECT DATE_ADD(NOW(), INTERVAL 7 DAY);
```

> DATE_SUB(): Subtracts a specified time interval from a date.

```sql
SELECT DATE_SUB(NOW(), INTERVAL 7 DAY);
```

> Returns the number of days between two dates.

```sql
SELECT DATEDIFF(CURDATE(), '2024-04-01');
```

> Extract the day, month, and year from a date.

```sql
SELECT DAY(NOW()), MONTH(NOW()), YEAR(NOW());
```

> Returns the weekday index for a date.

```sql
SELECT DAYOFWEEK(NOW());
```

> Returns the day of the year for a date.

```sql
SELECT DAYOFYEAR(NOW());
```

> Returns the last day of the month for a given date.

```sql
SELECT LAST_DAY(NOW());
```

> Converts a string into a date.

```sql
SELECT STR_TO_DATE('April 19, 2024', '%M %d, %Y');
```

> Format a date value.

```sql
SELECT DATE_FORMAT(NOW(), '%W, %M %d, %Y');
```

---

# References

- Chat Gee Pee Tee

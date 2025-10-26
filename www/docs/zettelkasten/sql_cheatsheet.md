🗓️ 19042024 1430
📎 #sql #backend

## dump

```sql
SELECT * FROM users
WHERE JSON_EXTRACT(CAST(details AS JSON), '$.age') > 25;
```
> Extracting SQL

```sql
SELECT 
    DATE_FORMAT(FROM_UNIXTIME(task_submitted_time), '%Y-%m-%d %H:%i') AS minute, 
    COUNT(*) AS task_count
FROM segmentation_labeling_task_log
WHERE task_submitted_time >= UNIX_TIMESTAMP(NOW() - INTERVAL 2 HOUR)
GROUP BY minute
ORDER BY minute;

```
> Handling epochs

## date_functions


```sql
  SELECT NOW();
```
> Current date and time.


```sql
SELECT CURDATE();
```
> Current Date


```sql
SELECT DATE_ADD(NOW(), INTERVAL 7 DAY);
```
> Adds a specified time interval to a date.


```sql
SELECT DATE_SUB(NOW(), INTERVAL 7 DAY);
```
> DATE_SUB(): Subtracts a specified time interval from a date.


```sql
SELECT DATEDIFF(CURDATE(), '2024-04-01');
```
> Returns the number of days between two dates.


```sql
SELECT DAY(NOW()), MONTH(NOW()), YEAR(NOW());
```
> Extract the day, month, and year from a date.


```sql
SELECT DAYOFWEEK(NOW());
```
> Returns the weekday index for a date.


```sql
SELECT DAYOFYEAR(NOW());
```
> Returns the day of the year for a date.


```sql
SELECT LAST_DAY(NOW());
```
> Returns the last day of the month for a given date.


```sql
SELECT STR_TO_DATE('April 19, 2024', '%M %d, %Y');
```
> Converts a string into a date.


```sql
SELECT DATE_FORMAT(NOW(), '%W, %M %d, %Y');
```
> Format a date value.

---

## References

- Chat Gee Pee Tee

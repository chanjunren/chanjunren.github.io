🗓️ 03022025 1420
📎

# hologres_storage_modes

## Syntax
```sql
CREATE TABLE <table_name> (...) WITH (orientation = '[column | row | row,column]');

-- Syntax supported in all Hologres versions:
BEGIN;
CREATE TABLE <table_name> (...);
call set_table_property('<table_name>', 'orientation', '[column | row | row,column]');
COMMIT;
```

---
# References
- https://www.alibabacloud.com/help/en/hologres/user-guide/storage-models-of-tables
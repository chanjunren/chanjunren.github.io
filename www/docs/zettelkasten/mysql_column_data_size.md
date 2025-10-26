🗓️ 31012025 1512
📎  #wip 

# mysql_column_data_size
##  Numeric Types

| Data Type            | Size (MySQL)                  | Notes / Details                                  | Cross-Database Consideration                         |
| -------------------- | ----------------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| `TINYINT`            | 1 byte                        | Range: -128 to 127 (signed), 0 to 255 (unsigned) | Similar in PostgreSQL, SQL Server                    |
| `SMALLINT`           | 2 bytes                       | Range: -32,768 to 32,767 (signed)                | Same size in most RDBMS                              |
| `MEDIUMINT`          | 3 bytes                       | MySQL-specific; not common in other databases    | Rarely supported elsewhere                           |
| `INT` or `INTEGER`   | 4 bytes                       | Range: -2,147,483,648 to 2,147,483,647 (signed)  | Common size across databases                         |
| `BIGINT`             | 8 bytes                       | Range: -2⁶³ to 2⁶³-1 (signed)                    | Standard size in most RDBMS                          |
| `DECIMAL(p, s)`      | Varies based on precision `p` | Approx. `⌊p / 9⌋ × 4 bytes`                      | Can vary slightly; PostgreSQL and SQL Server similar |
| `FLOAT`              | 4 bytes                       | Single-precision floating-point                  | Same across databases                                |
| `DOUBLE` (or `REAL`) | 8 bytes                       | Double-precision floating-point                  | Standard across databases                            |

##  Character/String Types

| Data Type    | Size (MySQL)                                      | Notes / Details                                 | Cross-Database Consideration                                     |
| ------------ | ------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| `CHAR(n)`    | Fixed `n` bytes (padded)                          | Fixed-length string (padded with spaces)        | Same concept across databases                                    |
| `VARCHAR(n)` | Length of string + 1 or 2 bytes for length prefix | 1 byte prefix if `n ≤ 255`, otherwise 2 bytes   | Similar in most RDBMS; PostgreSQL uses 4-byte header             |
| `TINYTEXT`   | Up to 255 bytes + 1 byte length prefix            | Text stored separately; only a pointer in row   | MySQL-specific; other RDBMS use `TEXT` with varying storage      |
| `TEXT`       | Up to 65,535 bytes + 2-byte length prefix         | Allocated on separate page                      | Supported by most RDBMS, but PostgreSQL stores inline by default |
| `MEDIUMTEXT` | Up to 16,777,215 bytes + 3-byte length prefix     | Large text; external storage                    | MySQL-specific; PostgreSQL uses `TEXT` with no limit             |
| `LONGTEXT`   | Up to 4,294,967,295 bytes + 4-byte length prefix  | For massive text storage                        | MySQL-specific; alternative storage may be needed in other RDBMS |
| `ENUM`       | 1 or 2 bytes                                      | 1 byte for up to 255 values, 2 bytes for larger | MySQL-specific; PostgreSQL uses `CHECK` constraints              |

##  Date/Time Types

| Data Type   | Size (MySQL) | Notes / Details                             | Cross-Database Consideration                    |
| ----------- | ------------ | ------------------------------------------- | ----------------------------------------------- |
| `DATE`      | 3 bytes      | Stores year, month, and day                 | Standard across databases                       |
| `DATETIME`  | 8 bytes      | Stores date and time (accurate to seconds)  | Same size across databases                      |
| `TIMESTAMP` | 4 bytes      | Stores seconds since 1970 (UNIX epoch time) | Slight differences in handling across databases |
| `TIME`      | 3 bytes      | Stores time (accurate to seconds)           | Standard size across databases                  |
| `YEAR`      | 1 byte       | Stores year (1901 to 2155)                  | MySQL-specific, rarely supported elsewhere      |

##  Binary Data Types

|Data Type|Size (MySQL)|Notes / Details|Cross-Database Consideration|
|---|---|---|---|
|`BINARY(n)`|Fixed length, `n` bytes|Similar to `CHAR` but stores binary data|Supported by most RDBMS|
|`VARBINARY(n)`|Length of data + 1 or 2 bytes for length prefix|Similar to `VARCHAR`, for binary data|Supported in most databases|
|`TINYBLOB`|Up to 255 bytes + 1 byte prefix|Stores small binary data|MySQL-specific; PostgreSQL stores binary data as `BYTEA`|
|`BLOB`|Up to 65,535 bytes + 2-byte prefix|Binary large object|Supported by most databases (e.g., `BYTEA` in PostgreSQL)|
|`MEDIUMBLOB`|Up to 16,777,215 bytes + 3-byte prefix|For larger binary objects|MySQL-specific|
|`LONGBLOB`|Up to 4,294,967,295 bytes + 4-byte prefix|For very large binary objects|MySQL-specific|

##  Other Types

|Data Type|Size (MySQL)|Notes / Details|Cross-Database Consideration|
|---|---|---|---|
|`BIT(n)`|Varies, typically ⌈n / 8⌉ bytes|Compact storage for binary bits|Similar concept across databases; SQL Server uses `BIT`|
|`BOOLEAN` or `BOOL`|1 byte|Stored as `TINYINT(1)` internally|Different in PostgreSQL (`BOOLEAN`) and SQL Server (`BIT`)|
|`JSON`|Varies (depends on content)|Stored as text in MySQL|Supported as native type in PostgreSQL|

##  Row Overhead

| Overhead Type                   | Size (MySQL)               | Notes                                           |
| ------------------------------- | -------------------------- | ----------------------------------------------- |
| Row metadata overhead           | 7-23 bytes per row         | Includes transaction ID, rollback pointer, etc. |
| NULL storage overhead           | ~1 bit per nullable column | Stored in a bitmap in row metadata              |
| Variable-length column overhead | 1-2 bytes per column       | Length metadata for each variable-length column |

## Index storage

- Primary keys and secondary indexes also take up space.
- Estimate each index’s size using:
`index size = (index key size + pointer size) * number of rows`
    
The pointer size in InnoDB is typically **6 bytes**. For composite indexes, sum the sizes of all indexed columns.

TODO: Deeper dive into B tree / B+ Tree storage size

---

## References

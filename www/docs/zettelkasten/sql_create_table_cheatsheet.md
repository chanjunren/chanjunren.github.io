🗓️ 21082024 0945
📎 #mysql 

# sql_create_table_cheatsheet
```sql
CREATE TABLE IF NOT EXISTS `data_types_cheatsheet` 
(
    `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key - Unique identifier for each row, automatically increments',

    -- Numeric Data Types
    `tinyint_field` TINYINT COMMENT 'TINYINT - Very small integer (-128 to 127)',
    `smallint_field` SMALLINT COMMENT 'SMALLINT - Small integer (-32768 to 32767)',
    `mediumint_field` MEDIUMINT COMMENT 'MEDIUMINT - Medium integer (-8388608 to 8388607)',
    `int_field` INT COMMENT 'INT - Standard integer (-2147483648 to 2147483647)',
    `bigint_field` BIGINT COMMENT 'BIGINT - Large integer (-9223372036854775808 to 9223372036854775807)',
    `decimal_field` DECIMAL(10,2) COMMENT 'DECIMAL - Fixed-point decimal number (total digits, decimal places)',
    `float_field` FLOAT COMMENT 'FLOAT - Single-precision floating-point number',
    `double_field` DOUBLE COMMENT 'DOUBLE - Double-precision floating-point number',
    `bit_field` BIT(8) COMMENT 'BIT - Bit-field data (0 or 1)',

    -- Date and Time Data Types
    `date_field` DATE COMMENT 'DATE - Stores date (YYYY-MM-DD)',
    `time_field` TIME COMMENT 'TIME - Stores time (HH:MM:SS)',
    `datetime_field` DATETIME COMMENT 'DATETIME - Stores date and time (YYYY-MM-DD HH:MM:SS)',
    `timestamp_field` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'TIMESTAMP - Stores date and time (YYYY-MM-DD HH:MM:SS), automatically updated',
    `year_field` YEAR COMMENT 'YEAR - Stores year (YYYY or YY)',

    -- String Data Types
    `char_field` CHAR(20) COMMENT 'CHAR - Fixed-length string (up to 20 characters)',
    `varchar_field` VARCHAR(255) COMMENT 'VARCHAR - Variable-length string (up to 255 characters)',
    `tinytext_field` TINYTEXT COMMENT 'TINYTEXT - Small text field (up to 255 characters)',
    `text_field` TEXT COMMENT 'TEXT - Medium text field (up to 65,535 characters)',
    `mediumtext_field` MEDIUMTEXT COMMENT 'MEDIUMTEXT - Large text field (up to 16,777,215 characters)',
    `longtext_field` LONGTEXT COMMENT 'LONGTEXT - Very large text field (up to 4,294,967,295 characters)',
    `enum_field` ENUM('value1', 'value2') COMMENT 'ENUM - Stores one value from a predefined list',
    `set_field` SET('value1', 'value2') COMMENT 'SET - Stores zero or more values from a predefined list',

    -- Spatial Data Types (require MySQL 5.7 or later)
    -- `geometry_field` GEOMETRY COMMENT 'GEOMETRY - Stores geometric data (points, lines, polygons etc.)',
    -- `point_field` POINT COMMENT 'POINT - Stores a single point in space',
    -- `linestring_field` LINESTRING COMMENT 'LINESTRING - Stores a series of connected points',
    -- `polygon_field` POLYGON COMMENT 'POLYGON - Stores a closed shape with at least three points',
    -- `multipoint_field` MULTIPOINT COMMENT 'MULTIPOINT - Stores multiple points',
    -- `multilinestring_field` MULTILINESTRING COMMENT 'MULTILINESTRING - Stores multiple linestrings',
    -- `multipolygon_field` MULTIPOLYGON COMMENT 'MULTIPOLYGON - Stores multiple polygons',
    -- `geometrycollection_field` GEOMETRYCOLLECTION COMMENT 'GEOMETRYCOLLECTION - Stores a collection of different geometry types'

    -- JSON Data Type (require MySQL 5.7 or later)
    -- `json_field` JSON COMMENT 'JSON - Stores JSON (JavaScript Object Notation) data'

    -- Binary Data Types
    `binary_field` BINARY(16) COMMENT 'BINARY - Fixed-length binary data (up to 16 bytes)',
    `varbinary_field` VARBINARY(255) COMMENT 'VARBINARY - Variable-length binary data (up to 255 bytes)',
    `tinyblob_field` TINYBLOB COMMENT 'TINYBLOB - Small binary object (up to 255 bytes)',
    `blob_field` BLOB COMMENT 'BLOB - Medium binary object (up to 65,535 bytes)',
    `mediumblob_field` MEDIUMBLOB COMMENT 'MEDIUMBLOB - Large binary object (up to 16,777,215 bytes)',
    `longblob_field` LONGBLOB COMMENT 'LONGBLOB - Very large binary object (up to 4,294,967,295 bytes)',

    -- Indexes (examples)
    KEY `idx_varchar_field` (`varchar_field`) COMMENT 'Index on varchar_field for faster lookups',
    KEY `idx_int_field_desc` (`int_field` DESC) COMMENT 'Index on int_field in descending order',
    KEY `idx_date_field_varchar_field` (`date_field`, `varchar_field`) COMMENT 'Composite index on date_field and varchar_field'
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Cheatsheet for MySQL Data Types with Indexes';
```

---

# References

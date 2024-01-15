## Service Division
- Modularization of services.
- Prohibit direct database access across services.
- Data interaction across services must be done through API calls (or develop your own Flink tasks for data synchronization. This is advised if relying on historical data for large-scale processing is too costly in MySQL. Data team can provide support. [Sub-item 3] Cross-domain data solution).

## Database Selection
- Choose the appropriate type of database based on the usage scenario.
- Particularly, the use of Elasticsearch and Linodorm must match real application scenarios.
- Database Middleware Introduction
- OKX Elasticsearch Analysis

## Internal Service Table Model Design
- Use the correct storage engine, such as InnoDB recommended for MySQL.
- Table design should be simple; do not store multi-dimensional data in one table. Select the suitable table design model (1:1, 1:n, n:1) based on specific business scenarios.
    - Field design should be straightforward, with each column representing an independent attribute.
    - Store data clearly, simply, and independently. Avoid storing similar types of data in multiple places.
    - Do not store different types of data in the same table.
    - A table should not have too many fields, generally no more than 20. Consider splitting the table if there are too many fields.
    - Fields in the same table should be related. Split unrelated tables.
    - For 1:n, n:n table design models, ensure database consistency at the code level. Avoid using foreign keys in the database (due to performance issues and concurrency deadlocks).
- Tables must have a primary key (auto-increment, composite primary keys not recommended).
- Avoid Redundant Data Storage
    - [Mandatory] Strictly adhere to the first normal form when creating tables (ensure atomicity of each column) to avoid duplicate data.
    - Introduction to the Three Database Normal Forms
    - [Recommended] Tables should meet the second normal form (ensure every column in the table is related to the primary key) to avoid partial dependencies.
    - [Recommended] Tables should meet the third normal form (ensure each column is directly related to the primary key, not indirectly) to avoid transitive dependencies.
- Consider consistency and latency when setting up redundant fields for performance or usability reasons.
    - Denormalized field design can be considered if there is a significant improvement in performance.
    - Consider denormalized design if redundant fields facilitate storage.
    - However, prioritize data consistency and acceptable latency in denormalized designs.
- Avoid Storing the Same Data in Multiple Places
    - Developers should be clear about whether they are storing data from other internal services to avoid duplication.
    - Determine a unique external data source (such as IP) to ensure data accuracy. If uncertain, submit to the data committee for discussion.
    - Data warehouses should check and review based on actual usage.

## Field Standards
- [Mandatory] Tables, fields, etc., must have necessary English comments. If a field's numeric values represent different meanings, it should be clearly explained in the comments, e.g., state field: 1
: Not placed an order 2: Placing an order 3: Ordered 4: Order completion.
- [Mandatory] All columns storing the same data must have consistent names and types (e.g., user_id fields in different tables must have the same type).
- 
- [Mandatory] Use TIMESTAMP for storing millisecond-level time, not int type or strings (as they lack automatic update attributes).
- [Mandatory] Prefer the smallest data type suitable for your storage needs (e.g., prefer varchar over char).
- [Mandatory] Allocate field lengths as per actual needs; avoid arbitrarily large capacities.
- [Recommended] Define all fields as NOT NULL.
- [Recommended] Use DECIMAL for storing precise floating-point numbers, as float can sometimes lead to precision issues.
- [Recommended] Use large fields like blob, text sparingly.
- [Recommended] Allocate field lengths as per actual needs; avoid arbitrarily large capacities.
- [Recommended] Keep the number of fields in core tables as few as possible; consider splitting large fields.
- [Recommended] Use UNSIGNED for storing non-negative integers.
- Explanation: The same byte size can store a larger range of values.
- [Recommended] Use VARBINARY for storing case-sensitive variable-length strings or binary content.
- [Recommended] For VARCHAR(N), keep N as small as possible, as MySQL limits the total length of all VARCHAR fields in a table to 65535 bytes. Memory operations like sorting and creating temporary tables use the length of N for memory allocation.
- [Recommended] Store large fields and less frequently accessed fields in separate tables to separate cold and hot data.
- [Recommended] Ideally, keep the number of columns in a single table below 50.
- [Recommended] Default to creating timestamp fields for creation and modification times.

## Index Standards
- [Mandatory] Tables must have a primary key, which creates a primary key index. The primary key column should not be frequently updated and preferably not be a string type. Default to using a non-null and unique column. Ideally, the primary key should be auto_increment and not null.
- [Mandatory] Newly created unique indexes must not duplicate the primary key.
- [Mandatory] Choose columns with high distinctiveness as indexes. Avoid creating indexes on attributes that are frequently updated or have low distinctiveness.
- [Mandatory] Anticipate SQL queries and create indexes in advance, especially time field indexes for data warehouse
- pulls (it's advisable to add indexes for creation time and modification time).
- [Mandatory] Avoid performing mathematical and function operations on indexed columns to prevent the index from being filtered and unused.
- [Mandatory] When creating composite indexes, place columns with high distinctiveness first.
- [Mandatory] Ensure indexed fields are not NULL, considering default values. NULL occupies space and significantly impacts the efficiency of index queries.
- [Mandatory] Avoid creating an individual index for every column in a table.
- [Recommended] Limit the number of fields in a single index to 5 and the total number of indexes on a table to 5. Index design should follow the B+ Tree index leftmost prefix match principle.
- [Recommended] Avoid indexing large fields like blob/text, as they consume excessive storage space.
- [Recommended] Use prefix indexing for strings, with the prefix index length not exceeding 128 characters. Prefer prefix indexes and consider adding virtual columns for indexing if necessary.
- [Recommended] Ensure created indexes cover 80% of the main queries. Focus on solving the primary issues rather than covering all possibilities.
- [Recommended] Use unique indexes wherever possible to improve query efficiency.
- [Recommended] For repetitive SQL statements with multiple fields, modify the condition fields' order and create a combined index to reduce the number of indexes.
- [Recommended] Create appropriate indexes for DML, order by, and group by fields.
- [Recommended] Important SQL must be indexed, with priority given to covering indexes, especially for fields involved in multi-table joins.
- [Recommended] Avoid implicit index type conversion.
- [Recommended] Avoid redundant indexes (do not add unnecessary indexes).
- [Recommended] Avoid indexing frequently used small tables.
- [Recommended] Minimize the use of foreign keys. Implement referential integrity at the business end for more efficient indexing.
Explanation: Avoid operations on parent and child tables affecting each other, reducing usability.

## Database Development Standards
- [Mandatory] Do not store large data such as images and files in the database.
- [Mandatory] It is recommended to keep the data volume of a single table below 20 million rows. (Note that this is not a MySQL database limitation, but large sizes pose significant challenges in modifying table structures, backups, and recovery. MySQL does not limit storage, which depends on storage settings and file systems.)
- [Mandatory] Use InnoDB as the storage engine.
- [Mandatory] Table creation requires review and approval by the development team leader (TL).
- [Mandatory] Perform major table modifications during low business traffic periods.
- [Recommended] Use utf8mb4 as the database character set.
- [Recommended] Avoid using stored procedures, triggers, functions, etc., as they can lead to tight coupling with the database.
- [Recommended] Avoid using JOINs with large tables, as MySQL's optimizer has overly simplistic strategies for optimizing joins.
- [Recommended] Avoid performing calculations in the database; complex computations should be moved to the business application.
- [Recommended] Refuse large SQL statements, large transactions, and large batches; these can be handled at the business end.
- [Recommended] When designing databases, consider whether future scalability has been taken into account.
- [Recommended] Combine SQL statements, especially in DML, by merging multiple values to reduce interactions with the database.
- [Recommended] Avoid negative queries such as 'not in' or 'like', as they can lead to full table scans and reduce buffer pool utilization.
- [Recommended] Use 'union all' instead of 'union', as 'union' involves sorting operations for deduplication, leading to lower efficiency.
- [Recommended] Avoid subqueries; it's advisable to convert them into join queries.
- [Recommended] Avoid cross-database queries.
- [Recommended] Implement reasonable pagination, especially for large pagination.
- [Recommended] If UPDATE and DELETE statements do not use LIMIT and involve large data volumes, it can impact database performance and cause master-slave delays, possibly leading to inconsistencies.
- [Recommended] Be cautious when deleting database objects (including tables, indexes, fields, etc.).
- [Recommended] Use internal domain names instead of IPs to connect to databases.
- [Recommended] Consider horizontal partitioning of log-type tables based on creation time and periodically archive historical data.

## Naming Conventions
- [Mandatory] The permissible character range for names of tables, fields, etc., includes A-Z, a-z, 0-9, and underscore (_). No other characters are allowed. Principally, table names should not include numbers, and field names should not include numbers unless in special cases.
- [Mandatory] Database names, table names, and field names should be lowercase, follow the underscore style, not exceed 32 characters, be meaningful and intuitive, and preferably use nouns rather than verbs. The names should be related to business or product lines, and mixing of pinyin and English is prohibited.
- [Mandatory] Naming format for ordinary indexes: idx_tableName_indexFieldName (if there are multiple indexes starting with the first field name, add the second field name; abbreviate if too long). Unique index naming format: uk_tableName_indexFieldName (index names must be all lowercase, abbreviate if too long). Primary key index naming: pk_fieldName. Sequence naming format: seq_tablename.
- [Mandatory] Database names, table names, and field names must not use MySQL reserved words, such as desc, range, match, asc, index, etc.
- [Mandatory] Temporary table names must start with 'tmp' and end with a date suffix.
- [Mandatory] Backup table names must start with 'bak' and end with a date suffix.
- [Mandatory] Fields expressing a yes/no concept should be named using the format
is_xxx.
- [Recommended] Tables within the same module should use the same prefix as much as possible, and table names should be meaningful, for instance, all log tables starting with 'log_'.
- [Recommended] Foreign key fields (if any) should be named using the format tableName_fieldName to represent their relationships.
- [Recommended] Fields with the same meaning across different tables should have the same name. For fields with the same meaning across tables, use the naming format tableName_fieldName, omitting the module prefix.

## Security Standards
- [Mandatory] Prohibit storing plaintext passwords in the database; passwords must be encrypted before storage.
- [Mandatory] Developers are forbidden from directly exporting or querying data involving user-sensitive information for business colleagues. If necessary, such actions require approval from senior leadership.
- [Mandatory] Operations involving sensitive data interaction with the database must have audit logs, and alerts should be set up when necessary.
- [Mandatory] Implement a whitelist feature for IP addresses connecting to the database to prevent unauthorized IP access.
- [Recommended] Regularly change usernames and passwords for online database connections.
- [Recommended] Prohibit the plaintext storage of user-sensitive information, such as phone numbers, in the database.
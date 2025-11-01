🗓️ 03022025 1114

# hologres_clustering_key
## Overview

Hologres sorts data in files based on clustering keys. This accelerates range and filter queries on columns that are specified as clustering keys. You can configure a clustering key for a table only when you create the table. The following syntax is used to configure a clustering key:

```sql
-- Syntax supported by Hologres V2.1 and later
CREATE TABLE <table_name> (...) WITH (clustering_key = '[<columnName>[,...]]');

-- Syntax supported by all Hologres versions
BEGIN;
CREATE TABLE <table_name> (...);
CALL set_table_property('<table_name>', 'clustering_key', '[<columnName>{:asc} [,...]]');
COMMIT;
```

The following table describes parameters in the preceding syntax.

|               |                                                                         |
| ------------- | ----------------------------------------------------------------------- |
| **Parameter** | **Description**                                                         |
| table_name    | The name of the table for which you want to configure a clustering key. |
| columnName    | The name of the column that you want to specify as a clustering key.    |

## Suggestions

- A clustering key is suitable for point queries and range queries and optimizes the performance of filter operations. For example, a clustering key can accelerate a query that contains the condition `WHERE a = 1` or `WHERE a > 1 and a < 5`. You can specify a column as a clustering key and create a bitmap index for the column at the same time. This provides the best point query performance.
    
- Clustering key-based queries follow the leftmost matching principle. Therefore, we recommend that you specify no more than two columns to constitute a clustering key. Otherwise, clustering key-based queries cannot be accelerated in some scenarios. A clustering key is used for sorting, and the preceding column among the columns that constitute a clustering key has a higher priority than the following column.
    
- When you specify a column as a clustering key, you can append `:asc` to the column name to sort the data in the column in ascending order. By default, the `asc` order is used. In versions earlier than Hologres V2.1, the sorting method cannot be set to descending (`desc`) during index building. If the sorting method is set to descending, a clustering key cannot be hit, resulting in poor query performance. In Hologres V2.1 and later, you can set the sorting method for a clustering key to `desc` after the Global User Configuration (GUC) parameter hg_experimental_optimizer_enable_variable_length_desc_ck_filter is set to on. However, this sorting method is applicable only to the columns of the TEXT, CHAR, VARCHAR, BYTEA, and INT data types. The sorting method for a clustering key cannot be set to `desc` for other data types.
    
    ```sql
    set hg_experimental_optimizer_enable_variable_length_desc_ck_filter = on;
    ```
    
- By default, the primary key of a row-oriented table is a clustering key. In versions earlier than Hologres V0.9, no clustering key is specified for a table by default. If the clustering key of a table is not the primary key, Hologres generates two sets of sorted data for this table: one is sorted based on the primary key and the other is sorted based on the clustering key. This results in data redundancy.
    

## Limits

- If you want to modify a clustering key, create a table and import data to the table.
    
- A column that is specified as a clustering key or the columns that constitute a clustering key must meet the NOT NULL constraint. In Hologres V1.3.20 to V1.3.27, you can specify a column of the NULLABLE type as a clustering key. In Hologres V1.3.28 and later, you cannot specify a column of the NULLABLE type as a clustering key. This is because if you specify a column of the NULLABLE type as a clustering key, the data correctness may be affected. If you must specify a column of the NULLABLE type as a clustering key to meet business requirements, you can execute the following statement before you execute the SQL statement to define the clustering key:
    
    ```sql
    set hg_experimental_enable_nullable_clustering_key = true;
    ```
    
- The columns of the following data types cannot be used to constitute a clustering key: FLOAT, FLOAT4, FLOAT8, DOUBLE, DECIMAL(NUMERIC), JSON, JSONB, BIT, VARBIT, MONEY, TIME WITH TIME ZONE, and other complex data types.
    
- In versions earlier than Hologres V2.1, the sorting method cannot be set to descending (`desc`) during index building. If the sorting method is set to descending, a clustering key cannot be hit, resulting in poor query performance. In Hologres V2.1 and later, you can set the sorting method for a clustering key to `desc` after the GUC parameter hg_experimental_optimizer_enable_variable_length_desc_ck_filter is set to on. However, this sorting method is applicable only to the columns of the TEXT, CHAR, VARCHAR, BYTEA, and INT data types. The sorting method for a clustering key cannot be set to `desc` for the columns of other data types.
    
    ```sql
    set hg_experimental_optimizer_enable_variable_length_desc_ck_filter = on;
    ```
    
- By default, no clustering key is specified for a column-oriented table. In this case, you can explicitly specify a clustering key based on your business scenario.
    
- In Hologres, each table can have only one clustering key. You can specify columns to constitute the clustering key for a table by executing the `CALL` statement only once when you create the table.
    
    - Syntax supported by Hologres V2.1 and later:
        
        ```sql
        -- Example of valid statement usage
        CREATE TABLE tbl (
            a int NOT NULL,
            b text NOT NULL
        )
        WITH (
            clustering_key = 'a,b'
        );
        
        -- Example of invalid statement usage
        CREATE TABLE tbl (
            a int NOT NULL,
            b text NOT NULL
        )
        WITH (
            clustering_key = 'a',
            clustering_key = 'b'
        );
        ```
        
    - Syntax supported by all Hologres versions:
        
        ```sql
        -- Example of valid statement usage
        BEGIN;
        CREATE TABLE tbl (a int NOT NULL, b text NOT NULL);
        CALL set_table_property('tbl', 'clustering_key', 'a,b');
        COMMIT;
        
        -- Example of invalid statement usage
        BEGIN;
        CREATE TABLE tbl (a int NOT NULL, b text NOT NULL);
        CALL set_table_property('tbl', 'clustering_key', 'a');
        CALL set_table_property('tbl', 'clustering_key', 'b');
        
        COMMIT;
        ```
        
    

## How it works

A clustering key is used to sort data in a file in physical storage. By default, data is sorted in ascending order. The following figures can help you understand the logical layout of query results and the layout of physical storage based on a clustering key.

- Logical layout of query results based on a clustering key
    
    Clustering key-based queries follow the leftmost matching principle. If the queried fields do not match the clustering key fields, the queries cannot be accelerated by using the clustering key. The following example shows the logical layout of query results based on a clustering key in Hologres.
    
    In this example, a table is prepared. The table contains three columns: Name, Date, and Class.
    
    - If you specify the Date column as the clustering key, the data in the table is sorted based on the values of the Date column.
        
    - If you specify the Class and Date columns to constitute the clustering key, the data in the table is sorted first based on the values of the Class column and then based on the values of the Date column.
        
    
    If you specify different columns to constitute the clustering key, the sorting results are different. The following figure shows the results.![逻辑布局](https://help-static-aliyun-doc.aliyuncs.com/assets/img/en-US/1858476161/p239431.png)
    
- Layout of physical storage based on a clustering key
    
    The following figure shows the layout of physical storage based on a clustering key.![物理布局](https://help-static-aliyun-doc.aliyuncs.com/assets/img/en-US/1858476161/p239433.png)
    

Based on the layouts, you can draw the following conclusions:

- A clustering key is suitable for range queries. For example, a clustering key can accelerate a query that contains the condition `WHERE date= 1/1` or `WHERE a > 1/1 and a < 1/5`.
    
- Clustering key-based queries follow the leftmost matching principle. If the queried fields do not match the clustering key fields, the queries cannot be accelerated by using the clustering key. For example, if you specify columns `a, b, and c` to constitute the clustering key, the query of columns `a, b, and c` or columns `a and b` can hit the clustering key. If you query columns `a and c`, only the query of column `a` can hit the clustering key. The query of columns `b and c` cannot hit the clustering key.
    

In the following example, the `uid, class, and date` columns are specified to constitute the clustering key:

- Syntax supported by Hologres V2.1 and later:
    
    ```sql
    CREATE TABLE clustering_test (
        uid int NOT NULL,
        name text NOT NULL,
        class text NOT NULL,
        date text NOT NULL,
        PRIMARY KEY (uid)
    )
    WITH (
        clustering_key = 'uid,class,date'
    );
    
    INSERT INTO clustering_test VALUES
    (1,'Alice','1','2022-10-19'),
    (2,'Bob','3','2022-10-19'),
    (3,'Sam','2','2022-10-20'),
    (4,'Zhao Liu','2','2022-10-20'),
    (5,'Sun Qi','2','2022-10-18'),
    (6,'Zhou Ba','3','2022-10-17'),
    (7,'Wu Jiu','3','2022-10-20');
    ```
    
- Syntax supported by all Hologres versions:
    
    ```sql
    BEGIN;
    CREATE TABLE clustering_test (
      uid int NOT NULL,
      name text NOT NULL,
      class text NOT NULL,
      date text NOT NULL,
      PRIMARY KEY (uid)
    );
    CALL set_table_property('clustering_test', 'clustering_key', 'uid,class,date');
    COMMIT;
    
    INSERT INTO clustering_test VALUES
    (1,'Alice','1','2022-10-19'),
    (2,'Bob','3','2022-10-19'),
    (3,'Sam','2','2022-10-20'),
    (4,'Zhao Liu','2','2022-10-20'),
    (5,'Sun Qi','2','2022-10-18'),
    (6,'Zhou Ba','3','2022-10-17'),
    (7,'Wu Jiu','3','2022-10-20');
    ```
    

- If you query only the `uid` column, the query can hit the clustering key.
    
    ```sql
    SELECT * FROM clustering_test WHERE uid > '3';
    ```
    
    View the execution plan of the query by executing the EXPLAIN statement. The following figure shows that the execution plan contains the `Cluster Filter` operator. This indicates that the query hits the clustering key and is accelerated.![只查uid执行计划](https://help-static-aliyun-doc.aliyuncs.com/assets/img/en-US/0253035761/p530491.png)
    
- If you query the `uid and class` columns, the query can hit the clustering key.
    
    ```sql
    SELECT * FROM clustering_test WHERE uid = '3' AND class >'1' ;
    ```
    
    View the execution plan of the query by executing the EXPLAIN statement. The following figure shows that the execution plan contains the `Cluster Filter` operator. This indicates that the query hits the clustering key and is accelerated.
    
- If you query the `uid, class, and date` columns, the query can hit the clustering key.
    
    ```sql
    SELECT * FROM clustering_test WHERE uid = '3' AND class ='2' AND date > '2022-10-17';
    ```
    
    View the execution plan of the query by executing the EXPLAIN statement. The following figure shows that the execution plan contains the `Cluster Filter` operator. This indicates that the query hits the clustering key and is accelerated.
    
    ![image.png](https://help-static-aliyun-doc.aliyuncs.com/assets/img/en-US/7230663071/p751651.png)
    
- If you query the `uid and date` columns, the query does not follow the leftmost matching principle. Therefore, only the query of the `uid` column can hit the clustering key, whereas the `date` column is filtered by using a regular method.
    
    ```sql
    SELECT * FROM clustering_test WHERE uid = '3'  AND date > '2022-10-17';
    ```
    
    View the execution plan of the query by executing the EXPLAIN statement. The following figure shows that the execution plan contains the `Cluster Filter` operator only for the uid column.
    
    ![image.png](https://help-static-aliyun-doc.aliyuncs.com/assets/img/en-US/7230663071/p751654.png)
    
- If you query the `class and date` columns, the query does not follow the leftmost matching principle and cannot hit the clustering key.
    
    ```sql
    SELECT * FROM clustering_test WHERE class ='2' AND date > '2022-10-17';
    ```
    
    View the execution plan of the query by executing the EXPLAIN statement. The following figure shows that the execution plan does not contain the `Cluster Filter` operator. This indicates that the query does not hit the clustering key.
    
    ![image.png](https://help-static-aliyun-doc.aliyuncs.com/assets/img/en-US/7230663071/p751658.png)
    

## Examples

Example 1: A query can hit a clustering key.

- Syntax supported by Hologres V2.1 and later:
    
    ```sql
    CREATE TABLE table1 (
        col1 int NOT NULL,
        col2 text NOT NULL,
        col3 text NOT NULL,
        col4 text NOT NULL
    )
    WITH (
        clustering_key = 'col1,col2'
    );
    
    -- After you execute the preceding SQL statement to create a table, a query can be accelerated or not based on the queried columns.
    -- The query can be accelerated.
    select * from table1 where col1='abc';
    
    -- The query can be accelerated.
    select * from table1 where col1>'xxx' and col1<'abc';
    
    -- The query can be accelerated.
    select * from table1 where col1 in ('abc','def');
    
    -- The query can be accelerated.
    select * from table1 where col1='abc' and col2='def'; 
    
    -- The query cannot be accelerated.
    select col1,col4 from table1 where col2='def';
    ```
    
- Syntax supported by all Hologres versions:
    
    ```sql
    begin;
    create table table1 (
      col1 int not null,
      col2 text not null,
      col3 text not null,
      col4 text not null
    );
    call set_table_property('table1', 'clustering_key', 'col1,col2');
    commit;
    
    -- After you execute the preceding SQL statements to create a table, a query can be accelerated or not based on the queried columns.
    -- The query can be accelerated.
    select * from table1 where col1='abc';
    
    -- The query can be accelerated.
    select * from table1 where col1>'xxx' and col1<'abc';
    
    -- The query can be accelerated.
    select * from table1 where col1 in ('abc','def');
    
    -- The query can be accelerated.
    select * from table1 where col1='abc' and col2='def';
    
    -- The query cannot be accelerated.
    select col1,col4 from table1 where col2='def';
    ```
    

Example 2: Set the sorting method for a clustering key to `desc` for Column a and to asc for Column b.

- Syntax supported by Hologres V2.1 and later:
    
    ```sql
    CREATE TABLE tbl (
        a int NOT NULL,
        b text NOT NULL
    )
    WITH (
        clustering_key = 'a:desc,b:asc'
    );
    ```
    
- Syntax supported by all Hologres versions:
    
    ```sql
    BEGIN;
    CREATE TABLE tbl (
      a int NOT NULL, 
      b text NOT NULL
    );
    CALL set_table_property('tbl', 'clustering_key', 'a:desc,b:asc');
    COMMIT;
    ```
    

## Advanced optimization methods

A clustering key in Hologres is different from a clustered index in a MySQL database or an SQL Server database. A clustered index is used to sort the data of a whole table. A clustering key in Hologres is used to sort data in only a specific file. Therefore, performing `ORDER BY` operations on data based on clustering keys requires extra sorting.

Hologres V1.3 and later optimize the performance of using clustering keys in the following scenarios. If the version of your Hologres instance is earlier than V1.3, manually upgrade your Hologres instance in the Hologres console or join the Hologres DingTalk group to contact Hologres technical support. For more information about how to manually upgrade your Hologres instance in the Hologres console, see [Manual upgrade](https://www.alibabacloud.com/help/en/hologres/user-guide/instance-upgrades#section-32k-sdy-wpv). For more information about how to obtain technical support, see [Obtain online support for Hologres](https://www.alibabacloud.com/help/en/hologres/support/obtain-online-support-for-hologres).

- Perform ORDER BY operations based on clustering keys
    
    In Hologres, data in a file is sorted based on the clustering key specified for the file. In versions earlier than Hologres V1.3, the optimizer cannot generate an optimal execution plan based on ordered data in clustering key columns. In addition, data may become out of order during the shuffle process because data is not merged. This involves a larger amount of data to compute and consumes more time. Hologres V1.3 is optimized to resolve this issue. The optimization ensures that execution plans can be generated based on ordered data in clustering key columns and that data orders are retained during the shuffle process. This improves query performance. However, take note of the following items:
    
    - By default, the SeqScan method instead of the IndexScan method is used if the columns that are specified to constitute the clustering key of a table are not filtered. The IndexScan method is used only if clustering keys are utilized.
        
    - The optimizer does not always generate execution plans based on ordered data in clustering key columns. A clustering key ensures ordered data in a single file. However, data needs to be sorted again within the memory of your Hologres instance.
        
    
    Examples
    
    - DDL statements of a table
        
        Syntax supported by Hologres V2.1 and later:
        
        ```sql
        DROP TABLE IF EXISTS test_use_sort_info_of_clustering_keys;
        
        CREATE TABLE test_use_sort_info_of_clustering_keys (
            a int NOT NULL,
            b int NOT NULL,
            c text
        )
        WITH (
            distribution_key = 'a',
            clustering_key = 'a,b'
        );
        
        INSERT INTO test_use_sort_info_of_clustering_keys SELECT i%500, i%100, i::text FROM generate_series(1, 1000) as s(i);
        
        ANALYZE test_use_sort_info_of_clustering_keys;
        ```
        
        Syntax supported by all Hologres versions:
        
        ```sql
        DROP TABLE if exists test_use_sort_info_of_clustering_keys;
        BEGIN;
        CREATE TABLE test_use_sort_info_of_clustering_keys
        (
                  a int NOT NULL,
                  b int NOT NULL,
                  c text
        );
        CALL set_table_property('test_use_sort_info_of_clustering_keys', 'distribution_key', 'a');
        CALL set_table_property('test_use_sort_info_of_clustering_keys', 'clustering_key', 'a,b');
        COMMIT;
        
        INSERT INTO test_use_sort_info_of_clustering_keys SELECT i%500, i%100, i::text FROM generate_series(1, 1000) as s(i);
        
        ANALYZE test_use_sort_info_of_clustering_keys;
        ```
        
    - Query statement
        
        ```sql
        explain select * from test_use_sort_info_of_clustering_keys where a > 100  order by a, b;
        ```
        
    - Comparison of execution plans
        
        - The following sample code shows the execution plan of the query in versions earlier than Hologres V1.3. You can execute the `EXPLAIN` statement to view the execution plan. In this example, Hologres V1.1 is used.
            
            ```sql
             Sort  (cost=0.00..0.00 rows=797 width=11)
               ->  Gather  (cost=0.00..2.48 rows=797 width=11)
                     Sort Key: a, b
                     ->  Sort  (cost=0.00..2.44 rows=797 width=11)
                           Sort Key: a, b
                           ->  Exchange (Gather Exchange)  (cost=0.00..1.11 rows=797 width=11)
                                 ->  Decode  (cost=0.00..1.11 rows=797 width=11)
                                       ->  Index Scan using holo_index:[1] on test_use_sort_info_of_clustering_keys  (cost=0.00..1.00 rows=797 width=11)
                                             Cluster Filter: (a > 100)
            ```
            
        - The following sample code shows the execution plan of the query in Hologres V1.3:
            
            ```sql
             Gather  (cost=0.00..1.15 rows=797 width=11)
               Merge Key: a, b
               ->  Exchange (Gather Exchange)  (cost=0.00..1.11 rows=797 width=11)
                     Merge Key: a, b
                     ->  Decode  (cost=0.00..1.11 rows=797 width=11)
                           ->  Index Scan using holo_index:[1] on test_use_sort_info_of_clustering_keys  (cost=0.00..1.01 rows=797 width=11)
                                 Order by: a, b
                                 Cluster Filter: (a > 100)
            ```
            
        
        Compared with the execution plan generated in versions earlier than Hologres V1.3, the execution plan generated in Hologres V1.3 utilizes ordered data in clustering key columns for merging and output. This facilitates pipeline execution and accelerates the sorting process in scenarios where a large amount of data is involved. Hologres V1.3 generates a Groupagg operator during the execution. Compared with a Hashagg operator generated in versions earlier than Hologres V1.3, a Groupagg operator can process data more easily and deliver better performance.
        
    
- Perform JOIN operations based on clustering keys (beta)
    
    Hologres V1.3 supports sort-merge join operations to ensure that execution plans are generated based on ordered data in clustering key columns. This reduces the amount of data to compute and improves performance. However, take note of the following items:
    
    - This feature is in public preview and is disabled by default. To perform sort-merge join operations based on clustering keys, execute the following statement to enable this feature before you query data:
        
        ```sql
        -- Enable sort-merge join.
        set hg_experimental_enable_sort_merge_join=on;
        ```
        
    - By default, the SeqScan method instead of the IndexScan method is used if the columns that are specified to constitute the clustering key of a table are not filtered. The IndexScan method is used only if clustering keys are utilized.
        
    - The optimizer does not always generate execution plans based on ordered data in clustering key columns. A clustering key ensures ordered data in a single file. However, data needs to be sorted again within the memory of your Hologres instance.
        
    
    Examples
    
    - DDL statements of a table
        
        Syntax supported by Hologres V2.1 and later:
        
        ```sql
        DROP TABLE IF EXISTS test_use_sort_info_of_clustering_keys1;
        CREATE TABLE test_use_sort_info_of_clustering_keys1 (
            a int,
            b int,
            c text
        )
        WITH (
            distribution_key = 'a',
            clustering_key = 'a,b'
        );
        
        INSERT INTO test_use_sort_info_of_clustering_keys1 SELECT i % 500, i % 100, i::text FROM generate_series(1, 10000) AS s(i);
        ANALYZE test_use_sort_info_of_clustering_keys1;
        
        DROP TABLE IF EXISTS test_use_sort_info_of_clustering_keys2;
        CREATE TABLE test_use_sort_info_of_clustering_keys2 (
            a int,
            b int,
            c text
        )
        WITH (
            distribution_key = 'a',
            clustering_key = 'a,b'
        );
        
        INSERT INTO test_use_sort_info_of_clustering_keys2 SELECT i % 600, i % 200, i::text FROM generate_series(1, 10000) AS s(i);
        ANALYZE test_use_sort_info_of_clustering_keys2;
        ```
        
        Syntax supported by all Hologres versions:
        
        ```sql
        drop table if exists test_use_sort_info_of_clustering_keys1;
        begin;
        create table test_use_sort_info_of_clustering_keys1
        (
          a int,
          b int,
          c text
        );
        call set_table_property('test_use_sort_info_of_clustering_keys1', 'distribution_key', 'a');
        call set_table_property('test_use_sort_info_of_clustering_keys1', 'clustering_key', 'a,b');
        commit;
        insert into test_use_sort_info_of_clustering_keys1 select i%500, i%100, i::text from generate_series(1, 10000) as s(i);
        analyze test_use_sort_info_of_clustering_keys1;
        
        drop table if exists test_use_sort_info_of_clustering_keys2;
        begin;
        create table test_use_sort_info_of_clustering_keys2
        (
          a int,
          b int,
          c text
        );
        call set_table_property('test_use_sort_info_of_clustering_keys2', 'distribution_key', 'a');
        call set_table_property('test_use_sort_info_of_clustering_keys2', 'clustering_key', 'a,b');
        commit;
        insert into test_use_sort_info_of_clustering_keys2 select i%600, i%200, i::text from generate_series(1, 10000) as s(i);
        analyze test_use_sort_info_of_clustering_keys2;
                                        
        ```
        
    - Query statement
        
        ```sql
        explain select * from test_use_sort_info_of_clustering_keys1 a join test_use_sort_info_of_clustering_keys2 b on a.a = b.a and a.b=b.b where a.a > 100 and b.a < 300;
        ```
        
    - Comparison of execution plans
        
        - The following sample code shows the execution plan of the query in versions earlier than Hologres V1.3. In this example, Hologres V1.1 is used.
            
            ```sql
             Gather  (cost=0.00..3.09 rows=4762 width=24)
               ->  Hash Join  (cost=0.00..2.67 rows=4762 width=24)
                     Hash Cond: ((test_use_sort_info_of_clustering_keys1.a = test_use_sort_info_of_clustering_keys2.a) AND (test_use_sort_info_of_clustering_keys1.b = test_use_sort_info_of_clustering_keys2.b))
                     ->  Exchange (Gather Exchange)  (cost=0.00..1.14 rows=3993 width=12)
                           ->  Decode  (cost=0.00..1.14 rows=3993 width=12)
                                 ->  Index Scan using holo_index:[1] on test_use_sort_info_of_clustering_keys1  (cost=0.00..1.01 rows=3993 width=12)
                                       Cluster Filter: ((a > 100) AND (a < 300))
                     ->  Hash  (cost=1.13..1.13 rows=3386 width=12)
                           ->  Exchange (Gather Exchange)  (cost=0.00..1.13 rows=3386 width=12)
                                 ->  Decode  (cost=0.00..1.13 rows=3386 width=12)
                                       ->  Index Scan using holo_index:[1] on test_use_sort_info_of_clustering_keys2  (cost=0.00..1.01 rows=3386 width=12)
                                             Cluster Filter: ((a > 100) AND (a < 300))
            ```
            
        - The following sample code shows the execution plan of the query in Hologres V1.3:
            
            ```sql
              Gather  (cost=0.00..2.88 rows=4762 width=24)
               ->  Merge Join  (cost=0.00..2.46 rows=4762 width=24)
                     Merge Cond: ((test_use_sort_info_of_clustering_keys2.a = test_use_sort_info_of_clustering_keys1.a) AND (test_use_sort_info_of_clustering_keys2.b = test_use_sort_info_of_clustering_keys1.b))
                     ->  Exchange (Gather Exchange)  (cost=0.00..1.14 rows=3386 width=12)
                           Merge Key: test_use_sort_info_of_clustering_keys2.a, test_use_sort_info_of_clustering_keys2.b
                           ->  Decode  (cost=0.00..1.14 rows=3386 width=12)
                                 ->  Index Scan using holo_index:[1] on test_use_sort_info_of_clustering_keys2  (cost=0.00..1.01 rows=3386 width=12)
                                       Order by: test_use_sort_info_of_clustering_keys2.a, test_use_sort_info_of_clustering_keys2.b
                                       Cluster Filter: ((a > 100) AND (a < 300))
                     ->  Exchange (Gather Exchange)  (cost=0.00..1.14 rows=3993 width=12)
                           Merge Key: test_use_sort_info_of_clustering_keys1.a, test_use_sort_info_of_clustering_keys1.b
                           ->  Decode  (cost=0.00..1.14 rows=3993 width=12)
                                 ->  Index Scan using holo_index:[1] on test_use_sort_info_of_clustering_keys1  (cost=0.00..1.01 rows=3993 width=12)
                                       Order by: test_use_sort_info_of_clustering_keys1.a, test_use_sort_info_of_clustering_keys1.b
                                       Cluster Filter: ((a > 100) AND (a < 300))
            ```
            
        
        Compared with the execution plan generated in versions earlier than Hologres V1.3, the execution plan generated in Hologres V1.3 utilizes ordered data in clustering key columns, merges and sorts data within shards, and then performs sort-merge join operations. This facilitates pipeline execution. This also prevents out of memory (OOM) errors that may be caused by the process of filling the hash side into the instance memory during a hash join operation in scenarios where a large amount of data is involved.
        
    

### References

For more information about the DDL statements for Hologres internal tables, see the following topics:

- [CREATE TABLE](https://www.alibabacloud.com/help/en/hologres/developer-reference/create-tables)
- [CREATE TABLE AS](https://www.alibabacloud.com/help/en/hologres/developer-reference/create-table-as)
- [CREATE TABLE LIKE](https://www.alibabacloud.com/help/en/hologres/developer-reference/create-table-like)
- [ALTER TABLE](https://www.alibabacloud.com/help/en/hologres/developer-reference/alter-table)
- [DROP TABLE](https://www.alibabacloud.com/help/en/hologres/developer-reference/drop-table)

---
## References
- https://www.alibabacloud.com/help/en/hologres/user-guide/clustering-key
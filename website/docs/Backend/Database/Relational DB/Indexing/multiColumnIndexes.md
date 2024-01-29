---
sidebar_position: 3
sidebar_label: Multi Column Indexes
---

# Multi-Column Indexes

## Index Key Concatenation
- In a multi-column index, the index key is formed by **concatenating** the values of the columns in the order they are defined in the index
- Example: An index on (column1, column2, column3) will have index entries like `column1_value|column2_value|column3_value`

## Sorted Order
- Concatenated keys are sorted in ascending order
- This sorting impacts the efficiency of query operations, as it dictates the order in which records are stored and retrieved

## Leftmost Principle
> In a B-Tree, the leftmost principle refers to the ordering of keys and pointers within each node
>
> The pointers to child nodes are arranged such that the leftmost pointer points to child nodes containing keys lesser than the first key in the parent node

- Queries that utilize the leftmost columns of the index can leverage the index efficiently
    - Example: A search on `column1` or both `column1` and `column2` can effectively use the index

## Range Queries
- The index is most efficient for range queries on the leftmost column defined in the index
- When a range query is performed on `column1`, the B-Tree can quickly locate the start point of the range and then _sequentially scan_ through the index

:::warning Partial Index Use Warning
If a query doesn't use the leftmost column, but one of the subsequent columns in the index, the B-Tree index is less efficient

 In such cases, the database might have to scan the entire index or resort to a different index or a full table scan
:::

## General Guidelines
```sql
CREATE INDEX idx_example ON table_name (most_searched_col, range_col, ...);
```

- **Understand Query Patterns** 
    - Analyze your application's query patterns to determine which columns are frequently involved in searches and filters
- **Selective Indexing** 
    - Focus on columns with _high selectivity_ (unique or near-unique values) for more efficient indexing
- **Avoid Over-Indexing** 
    - Excessive indexing can degrade write performance
    - Balance the need for fast reads against write efficiency

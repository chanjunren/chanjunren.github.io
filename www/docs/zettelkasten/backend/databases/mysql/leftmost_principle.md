🗓️ 06112024 0023

# leftmost_principle

```ad-abstract
Refers to the behavior of **tree-based indexes** ([[b_tree]] and [[b_plus_tree]], regarding how they handle multi-column indexes
```


```ad-important
This principle states that when an **index is created on multiple columns**, queries can **efficiently utilize** the index only if they reference the **leftmost** column or a **combination of the leftmost** column with subsequent columns.
```

## How It Works

```ad-example
Index Structure: (col1
```

Efficient searches for
1. (col1)
2. (col1, col2)
3. (col1, col2, col3)

Searches that start with any column other than the leftmost one will not benefit from this index


Usage of B-Trees in Relational Databases
B-Trees are not exclusive to MySQL or SQL databases; they are a fundamental data structure used across various . Here’s how they are generally employed:
General Use: Most relational databases, including Oracle, SQL Server, PostgreSQL, and SQLite, utilize B-Trees or their variants (like B+ Trees) for indexing. This choice is due to their efficiency in handling large datasets and maintaining balanced structures for quick access.
Indexing Mechanism: In these systems, B-Trees facilitate efficient search operations, insertions, deletions, and range queries. The balanced nature of these trees ensures that operations remain efficient even as data grows.
In summary, both B-Trees and B+ Trees utilize the leftmost principle to optimize multi-column indexing in relational databases. Their implementation is widespread across various RDBMS platforms, making them a standard choice for managing indexed data efficiently.

---

## References

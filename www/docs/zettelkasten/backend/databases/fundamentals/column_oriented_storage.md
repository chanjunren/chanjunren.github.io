🗓️ 31012025 1721
📎 #wip 

# column_oriented_storage

```ad-tldr
Column-oriented storage stores data by columns rather than by rows

Values of the same column are stored sequentially, making it highly optimized for reading large amounts of columnar data
```

## How It Works

| ID  | Name  | Age | Salary |
| --- | ----- | --- | ------ |
| 1   | Alice | 30  | 100k   |
| 2   | Bob   | 35  | 120k   |
| 3   | Carol | 28  | 95k    |
> Table of data to be stored


`[1, 2, 3], [Alice, Bob, Carol], [30, 35, 28], [100k, 120k, 95k]`
> How data is stored on disk
## Pros

- **Efficient for OLAP workloads:**  
    Columnar storage is optimal for **analytics queries** (e.g., `SELECT AVG(salary)`) since it can read only the necessary columns without fetching unrelated ones.
    
- **Compression-friendly:**  
    Because columnar data often has repeating values, it can be highly compressed, reducing storage requirements and improving I/O performance.
    
- **Better I/O throughput:**  
    Columnar storage reads only the required columns, which leads to reduced disk I/O and faster query execution compared to row storage.
    

## Cons
- **Inefficient for row-based operations:**  
    Since rows are scattered across multiple column segments, accessing or updating an entire row is expensive and requires gathering data from different locations.
    
- **High cost for frequent updates:**  
    Modifying a row (e.g., changing a salary) requires rewriting large chunks of column data, making it suboptimal for frequent updates.
    

## Best Use Cases
- **OLAP workloads** where queries aggregate or filter large datasets across specific columns (e.g., `SUM(sales)` or `GROUP BY region`).
- **Data warehouses** or **BI systems** where most workloads involve read-heavy analytical queries.

---

## References

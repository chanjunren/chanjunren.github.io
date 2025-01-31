🗓️ 31012025 1637
📎 #wip 

# row_oriented_storage

```ad-tldr
Row-oriented storage stores entire rows of a table sequentially on disk or memory

In this model, all columns belonging to a particular row are stored together
```

## How It Works

| ID  | Name  | Age | Salary |
| --- | ----- | --- | ------ |
| 1   | Alice | 30  | 100k   |
| 2   | Bob   | 35  | 120k   |
| 3   | Carol | 28  | 95k    |
> Table of data to be stored

`[1, Alice, 30, 100k], [2, Bob, 35, 120k], [3, Carol, 28, 95k]`
> How data is stored on disk
## Pros
- Efficient for [[oltp]] workloads
	- Best suited for **transactional systems** where queries typically access one or a small number of rows at a time (e.g., retrieving user profiles or updating orders).
    
- **Fast for point queries and updates:**  
    Accessing or updating a specific row (e.g., based on a primary key) is faster because the data is stored contiguously.
    

## Cons

- **Not ideal for analytics:**  
    Analytics queries often access only a few columns (e.g., aggregating salaries). With row storage, reading the entire row introduces unnecessary I/O overhead.
    
- **Larger disk usage for sparse data:**  
    If many columns contain nulls or zeros, row-oriented storage can lead to inefficient space utilization compared to columnar storage.
    

## Best Use Cases:
- **OLTP workloads** where frequent inserts, updates, or deletes are common (e.g., user transactions, bank systems).
- **Point queries** like "find employee details by ID."

---

# References

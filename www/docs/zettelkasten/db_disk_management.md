🗓️ 22012025 2351
📎

# db_disk_management



 ```ad-abstract
Chapter 3 of DDIA talks about the details of how databases manage data on the disk - with the goal of making **reads and writes efficient**, even with **large amounts of data**

This is important because you need to know:
- how to select a storage engine that is appropriate for your application, from the many that are available
- storage engine tuning > so that DB can perform well on your kind of workload
```


> To break it down into smaller notes

1. **Hash Indexes**
    
    - A simple way to map keys to their values using a hash table.
    - Works well for fast lookups but struggles with range queries (e.g., "find all keys between X and Y").
2. **SSTables (Sorted String Tables)**
    
    - A data structure where key-value pairs are **sorted** and stored in files on disk.
    - Because the data is sorted, SSTables are efficient for **range queries** and **merge operations**.
3. **LSM Trees (Log-Structured Merge Trees)**
    
    - A write-optimized data structure that uses **SSTables** in a layered, hierarchical way.
    - Writes are first stored in memory (e.g., in a **memtable**) and periodically flushed to disk as **sorted SSTables**.
    - Efficiently handles writes and compacts data over time to optimize reads.

### **How They All Connect**

1. **Hash Indexes** are basic but fast for key-value lookups. They’re good for simple use cases but lack advanced features like range queries.
2. **SSTables** solve range query issues by storing sorted data on disk. However, you need to handle compaction and merging.
3. **LSM Trees** build on SSTables, organizing them into levels or tiers, enabling highly efficient writes while keeping reads manageable.

---

### **Key Takeaways**

- **Hash Indexes:** Fast, simple, but not flexible.
- **SSTables:** Efficient range queries with immutable, sorted storage.
- **LSM Trees:** Write-optimized solution that combines SSTables with compaction and layering.


---

# References
- DDIA Chapter 3
- ChatGPT

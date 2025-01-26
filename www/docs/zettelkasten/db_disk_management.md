🗓️ 22012025 2351
📎

# db_disk_management



 ```ad-abstract
Chapter 3 of DDIA talks about the details of how databases manage data on the disk - with the goal of making **reads and writes efficient**, even with **large amounts of data**

This is important because you need to know:
- how to select a storage engine that is appropriate for your application, from the many that are available
- storage engine tuning > so that DB can perform well on your kind of workload
```


## [[oltp]]

## [[olap]]

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

---

### **Diving Into the Details**

#### 1. **Hash Indexes**

- **What it is:**  
    A hash table stored on disk (or in memory) where a hash function maps a key to a location in a file.
- **Strengths:**
    - Fast key-value lookups (O(1)).
    - Easy to implement.
- **Weaknesses:**
    - Not good for **range queries** (e.g., finding all keys between 1 and 100 requires scanning the whole table).
    - Can waste space due to hash collisions (though techniques like chaining or open addressing help).
- **Example Usage:**
    - Used in simple key-value stores where range queries aren't important.

---

#### 2. **SSTables**

- **What it is:**  
    A file format where data is stored as **sorted key-value pairs**.  
    Example:
    
    csharp
    
    CopyEdit
    
    `[apple, banana, cherry, grape]`
    
- **Key Characteristics:**
    - **Sorted order** makes range queries (e.g., keys between "banana" and "grape") efficient.
    - Immutable once written (to avoid random writes and fragmentation).
- **How It Works:**
    - New data is written to a **write-ahead log (WAL)** and a **memtable** in memory.
    - When the **memtable** is full, it is flushed to disk as a new **SSTable file**.
- **Merging SSTables:**
    - To avoid having too many small SSTables, **compaction** merges and re-sorts SSTables periodically.
- **Example Usage:**
    - Foundations of databases like Apache Cassandra and LevelDB.

---

#### 3. **LSM Trees**

- **What it is:**  
    A data structure that organizes **SSTables** into levels or tiers for write efficiency.
    
    - **Log-Structured**: Optimized for sequential writes (avoids random writes).
    - **Merge Trees**: Periodically merges smaller files into larger ones for read efficiency.
- **How It Works:**
    
    1. **Writes**:
        - Data is first written to a **write-ahead log** (WAL) for durability.
        - Then, it’s stored in memory in a **memtable**.
        - When the memtable is full, it’s flushed to disk as a **sorted SSTable**.
    2. **Compaction**:
        - Periodically merges multiple SSTables into fewer, larger SSTables.
        - Removes duplicate keys and stale data (e.g., updates or deletes).
    3. **Reads**:
        - Look up the most recent data from memory (memtable) and older data from disk (SSTables).
- **Strengths:**
    
    - Excellent write performance (writes are batched in memory and written sequentially to disk).
    - Scales well for high-throughput systems.
- **Weaknesses:**
    
    - Reads can be slower due to multiple SSTables (this is mitigated by bloom filters and compaction).
- **Example Usage:**
    
    - Core of systems like LevelDB, RocksDB, and HBase.

---

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

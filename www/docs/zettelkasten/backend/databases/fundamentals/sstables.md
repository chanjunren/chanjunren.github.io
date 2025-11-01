🗓️ 27012025 0108

# sstables

> File format where data is stored as sorted **key-value pairs**
   
```
[apple, banana, cherry, grape]
```
  
### Key Characteristics
- **Sorted order** makes range queries (e.g., keys between "banana" and "grape") efficient.
- Immutable once written (to avoid random writes and fragmentation).
### How It Works
- New data is written to a **write-ahead log (WAL)** and a **memtable** in memory.
- When the **memtable** is full, it is flushed to disk as a new **SSTable file**.
### Merging SSTables
- To avoid having too many small SSTables, **compaction** merges and re-sorts SSTables periodically.
### Example Usage
- Foundations of databases like Apache Cassandra and LevelDB.

### **1. Write-Ahead Log (WAL)**

#### **What is it?**

- The **WAL** is a sequential log file where all incoming writes are **first recorded** before they are applied to in-memory structures (like the **memtable**) or written to disk.
- The primary purpose is **durability**: If a crash occurs, the WAL ensures no data is lost because every write operation has been logged persistently.

#### **How it Works**

1. **Write Operation**:
    - When a client writes data, it’s first appended to the WAL (a simple sequential write to a file).
    - This is much faster than performing random writes on disk.
2. **Sync to Disk**:
    - The WAL is flushed to disk to ensure durability.
    - If the system crashes, the WAL can be replayed to recover the latest state.
3. **Memtable Update**:
    - The same data is also written into the **memtable** (in-memory data structure).
    - The WAL is effectively a safety net for the memtable.

#### **Key Characteristics**

- **Sequential Writes**: Very efficient on disk since writes are always appended.
- **Crash Recovery**: If the database crashes, it replays the WAL to rebuild the memtable and recover lost data.

---

### **2. Memtable**

#### **What is it?**

- The **memtable** is an in-memory, write-friendly data structure (often a balanced tree like a **Red-Black Tree** or **Skip List**) that stores key-value pairs in **sorted order**.
- It acts as a buffer for writes before data is flushed to disk as a **SSTable**.

#### **How it Works**

1. **Write Operation**:
    - When data is written to the database, it is added to the memtable after being logged in the WAL.
    - The memtable keeps data **sorted in memory**, making it efficient for range queries and lookups.
2. **Threshold Trigger**:
    - When the memtable reaches a size threshold (e.g., 64MB), it is flushed to disk as an immutable **SSTable**.
3. **Flushing**:
    - During the flush, the data is written to a new SSTable in **sorted order**, and the WAL for that memtable is discarded.

#### **Key Characteristics**

- **Sorted Data**: Makes range queries fast because data is organized as it’s written.
- **Write Buffer**: Reduces the number of direct disk writes by batching them in memory.
- **Transient**: The memtable exists only in memory and is lost on a crash unless the WAL is used for recovery.

---

### **Relationship Between WAL and Memtable**

- **WAL ensures durability**, while the **memtable ensures efficiency**:
    
    1. **Durability**: WAL guarantees that writes are not lost during a crash.
    2. **Efficiency**: Memtable minimizes the frequency of disk writes by batching writes in memory.
- During a **flush**:
    
    - Data in the memtable is written to disk as a sorted SSTable.
    - Once the memtable is flushed, the corresponding WAL file can be deleted because the data is now safely persisted in the SSTable.

---

### **Flow of a Write Operation**

1. **Client Write**:
    
    - The database writes the operation to the WAL (sequential write).
    - The data is then written to the memtable (in memory, sorted).
2. **Memtable Reaches Threshold**:
    
    - When the memtable is full, it is flushed to disk as a sorted SSTable.
    - The corresponding WAL is deleted since it’s no longer needed.
3. **Crash Recovery**:
    
    - If the database crashes, the WAL is replayed to rebuild the memtable and ensure no data is lost.

---

### **Why Use Both?**

- **Durability (WAL)**: Ensures that no data is lost even in the event of a crash.
- **Write Efficiency (Memtable)**: Reduces frequent small writes to disk, improving performance by batching operations.

---

### **Example in Practice**

In a system like **LevelDB** or **RocksDB**:

- Incoming writes are logged in the WAL.
- Data is also added to the memtable.
- Periodically, the memtable is flushed to disk as a new SSTable.

This approach balances **write durability, efficiency, and eventual read performance**.

Let me know if you'd like an example or deeper explanation of anything!


---

## References

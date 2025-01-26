🗓️ 27012025 0117
📎

# lsm_trees
> A data structure that organizes **SSTables** into levels or tiers for write efficiency.
    
- **Log-Structured**: Optimized for sequential writes (avoids random writes).
- **Merge Trees**: Periodically merges smaller files into larger ones for read efficiency.

## How It Works
### Writes
- Data is first written to a **write-ahead log** (WAL) for durability.
- Then, it’s stored in memory in a **memtable**.
- When the memtable is full, it’s flushed to disk as a **sorted SSTable**.

### Compaction
- Periodically merges multiple SSTables into fewer, larger SSTables
- Removes duplicate keys and stale data (e.g., updates or deletes)
### Reads
Look up the most recent data from memory (memtable) and older data from disk (SSTables).

### Strengths
- Excellent write performance (writes are batched in memory and written sequentially to disk).
- Scales well for high-throughput systems.
### Weaknesses
- Reads can be slower due to multiple SSTables (this is mitigated by bloom filters and compaction).
### Example Usage
- Core of systems like LevelDB, RocksDB, and HBase.

---

# References
- DDIA Chapter 3
- ChatGPT
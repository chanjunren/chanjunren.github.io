🗓️ 19082025 1445

# segmented_locking
## 🔐 Traditional Locking Problem
Single Lock Approach:
- Entire data structure protected by ONE lock
- All threads must wait for ANY write operation
- Only one thread can write at a time, anywhere in the structure
- Massive bottleneck for concurrent writes
## ⚡ Segmented Locking Solution
- Multiple Lock Approach:
	-	Data structure divided into segments (buckets)
	-	Each segment has its own independent lock
	-	Multiple threads can write simultaneously to different segments
	-	Only threads accessing the same segment need to wait
## 🗂️ How ConcurrentHashMap Uses Segments
- Internal Structure:
	- Hash table divided into ~16-64 segments (configurable)
	- Each segment = subset of hash buckets
	- Hash function determines which segment a key belongs to
- Write Operations:
	- Thread 1 writes to Segment A → locks only Segment A
	- Thread 2 writes to Segment B → locks only Segment B
	- Thread 3 writes to Segment A → waits for Thread 1
	- Thread 4 writes to Segment C → proceeds immediately
- Read Operations:
	- No locking required at all
	- Reads can happen while writes occur in other segments
	- Even during writes to the same segment (with volatile guarantees)
## 📊 Performance Impact
- Concurrency Level:
	- Traditional: 1 writer at a time
	- Segmented: Up to N writers simultaneously (N = number of segments)
- Contention Reduction:
	- Probability of lock contention = 1/N where N = segments
	- More segments = less contention = higher throughput
- Read Performance:
	- Completely unaffected by write operations
	- Lock-free reads regardless of ongoing writes

## 🎯 Key Benefits
- Scalability: Performance improves with more CPU cores
- Reduced Blocking: Writers only block other writers in same segment
- Read Optimization: Reads never wait for writes
- Fine-Grained Control: Minimizes critical sections

---
## References
- Cursor
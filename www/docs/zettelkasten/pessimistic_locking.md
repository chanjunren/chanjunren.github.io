🗓️ 07082025 1052

# pessimistic_locking

> **“Assume conflict will happen. Lock early.”**

### 🧰 Mechanism:
- Acquire **lock** before accessing data
- Other transactions **block** until lock is released

### 🟢 Pros:
- Safe: avoids conflicts
- Good for **high-contention** systems

### 🔴 Cons:
- Can lead to **deadlocks**
- **Lower concurrency**
- Blocking = slower performance
### 🛠️ Common in:
- Traditional RDBMS (e.g., `SELECT ... FOR UPDATE`)
- Critical sections in threads (`synchronized`, `ReentrantLock`)

---
## References
- ChatGPT
🗓️ 07082025 1049
📎

# concurrency_control

> Concurrency control ensures **correctness and consistency** when **multiple transactions** or **threads** access shared resources **at the same time**.

### 🔥 Goals:
- **Prevent conflicts** (e.g., dirty reads, lost updates)
- **Ensure isolation** (ACID property)
- **Maintain performance and throughput**

## 🧱 Types of Concurrency Problems

| Problem                 | Description                               | Example                                                      |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------------ |
| **Lost Update**         | Two writes overwrite each other           | T1 and T2 read the same record and both update it            |
| **Dirty Read**          | Read uncommitted changes                  | T1 writes, T2 reads before T1 commits                        |
| **Non-repeatable Read** | Same read returns different results       | T1 reads, T2 modifies and commits, T1 reads again            |
| **Phantom Read**        | Rows appear/disappear in repeated queries | T1: `SELECT *`, T2 inserts, T1 re-queries and sees more rows |

## 🧠 Summary Table

|              | [[optimistic_locking]]    | [[pessimistic_locking]]   |
| ------------ | ------------------------- | ------------------------- |
| Assumption   | Low contention            | High contention           |
| Concurrency  | High                      | Low                       |
| Risk         | Retry on failure          | Blocking, deadlocks       |
| Overhead     | Lightweight               | Heavyweight               |
| Common Usage | Web apps, distributed sys | Databases, legacy systems |

---
# References
- ChatGPT
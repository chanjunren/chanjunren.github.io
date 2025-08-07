🗓️ 07082025 1051
📎

# optimistic_locking
> **“Assume no conflict. Check at the end.”**
### 🧰 Mechanism:
- Allow multiple transactions to **proceed in parallel**
- Use **versioning** or **timestamps**
- At commit, verify no one else changed the data
### 🟢 Pros:
- Better concurrency
- No blocking → more performant under **low contention**
### 🔴 Cons:
- Can fail often under **high contention**
- Requires **conflict detection + retry logic**
### 🛠️ Common in:
- ORMs (e.g., JPA `@Version`)
- Web apps / distributed systems

---
# References
- ChatGPT
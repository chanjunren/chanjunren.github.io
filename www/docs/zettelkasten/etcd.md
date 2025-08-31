🗓️ 27082025 2343
📎

# etcd

```ad-abstract
a distributed, consistent, and highly available key-value store
```

- Commonly used in distributed systems to store configuration, metadata, and state
- [[kubernetes]] uses etcd to store:
	- Cluster state
	- Node information
	- Secrets, ConfigMaps
	- Role bindings, CRDs, etc.

## Key Features:
- Strong consistency ✅ (linearizable reads/writes)
- High availability ✅ (replicated across nodes)
- Watch support ✅ (clients can subscribe to updates)
- Based on [[raft]] consensus algorithm ✅ (ensures cluster-wide agreement)


## etcd + Raft in Action
When you use etcd:
- Every write request:
    1. Goes to the **leader**.
    2. Leader **replicates** the write to followers via Raft.
    3. Waits for **majority acknowledgment**.
    4. Commits the change > responds to client.
- Every read can be:
    - **Linearizable** > from the leader for **strong consistency**
    - **Stale** > from a follower for **better performance**


## Why This Matters

| Use Case                   | etcd’s Role            | Raft’s Role                            |
| -------------------------- | ---------------------- | -------------------------------------- |
| **Kubernetes**             | Stores cluster state   | Ensures cluster-wide state consistency |
| **Service Discovery**      | Stores endpoints       | Guarantees updates are atomic          |
| **Feature Flags / Config** | Stores dynamic configs | Keeps all replicas in sync             |
| **Leader Election**        | Stores leader info     | Ensures only **one true leader**       |


---
# References

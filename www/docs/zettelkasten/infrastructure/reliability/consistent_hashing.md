🗓️ 29042026 1515
📎 #distributed_systems #sharding

# consistent_hashing

> Sharding scheme that minimises data movement when nodes join or leave the cluster. The basis for distributed caches and Dynamo-style stores — the alternative ("just `hash mod N`") falls apart on the first capacity change.

## The Problem It Solves

Naive sharding: `node = hash(key) mod N`. Works fine — until N changes.

Add or remove one node, **almost every key** rehashes to a new node. For a cache, that's a stampede onto the origin. For a stateful store, that's TB-scale data movement.

You want: when N changes by 1, only ~`1/N` of keys move.

## The Mechanism

```ad-abstract
Map both keys and nodes to the same hash space (typically `[0, 2^32)`), arranged as a ring. Each key is owned by the **first node clockwise** from its hash position.
```

```
hash space (ring, 0 → 2^32 → 0)
        ┌─────────────────┐
        │  ●nodeA          │
        │       ●keyX      │
        │           ●nodeB │
        │   ●keyY          │
        │              ●nodeC
        └─────────────────┘

keyX → walk clockwise → nodeB
keyY → walk clockwise → nodeA
```

When nodeB leaves: only keys in the arc `(nodeA, nodeB]` reassign — they walk further clockwise to nodeC. Keys owned by nodeA and nodeC are untouched.

Add a node anywhere on the ring: it steals an arc from one neighbour. Same locality property.

## Virtual Nodes (vnodes)

Naive ring placement gives uneven arcs → uneven load. With only 3 nodes, one node may own 60% of the ring by chance.

Fix: each physical node registers **many virtual positions** on the ring (e.g. 100–200 vnodes per physical node). Hash `node_id || replica_index` for each. With enough vnodes, arc sizes converge to roughly equal.

Bonus: when a node fails, its load distributes across *all* remaining nodes (because its vnodes are scattered), not piled onto its single clockwise neighbour.

## Where It's Used

| System          | Notes                                                                                |
|-----------------|--------------------------------------------------------------------------------------|
| DynamoDB        | Original Dynamo paper popularised it. Vnodes called "tokens".                         |
| Cassandra       | Same lineage. Default `num_tokens=16` per node (was 256 in older versions).          |
| Memcached (clients) | Client-side consistent hashing (e.g. ketama) routes keys to servers without coordination. |
| Riak            | 64-bit ring divided into fixed partitions assigned to nodes.                         |

**Redis Cluster does NOT use consistent hashing** — it uses 16384 fixed slots assigned to nodes (see [[redis_cluster]]). Different scheme, similar goal: bounded data movement on resharding.

## Common Pitfalls

- **Data movement when adding a node** is `~1/(N+1)` of keys, not `1/N`. The exact fraction matters for capacity planning.
- **Replication on the ring** — after finding the owner, replicas live on the next R-1 nodes clockwise. This is how Dynamo-style systems get N=3 replication "for free".
- **Hot keys still hot** — consistent hashing balances *key distribution*, not *access frequency*. A celebrity's user_id still hammers one node. Mitigation: separate hot-key handling layer or per-key replication.
- **Hash function quality matters** — MD5/MurmurHash3 are fine; a weak hash gives clumpy rings even with vnodes.
- **`hash mod N` is the wrong default**, since adding one node remaps `(N-1)/N` of keys, not `1/N`. The naive scheme is the alternative this exists to replace.

## Related

- [[redis_cluster]] — fixed-slot variant of the same problem.
- [[quorum_reads_writes]] — replication on the ring with N/W/R.
- [[cap_theorem]] — Dynamo-style systems built on consistent hashing are typically AP.

---

## References

- Karger et al., "Consistent Hashing and Random Trees" (1997)
- DeCandia et al., "Dynamo: Amazon's Highly Available Key-value Store" (SOSP 2007)

🗓️ 29042026 1545
📎 #distributed_systems #consistency

# consistency_models

> The hierarchy of "what the next read is allowed to see". Without precise definitions here, "strong consistency" and "eventual consistency" are just marketing words — and the wrong choice produces real correctness bugs.

## The Hierarchy (strong → weak)

```ad-abstract
Stronger models forbid more anomalies but cost more (latency, availability, coordination).
Weaker models permit more reorderings but scale better.
```

```
Linearizable
    ↓ (drops real-time ordering)
Sequential consistency
    ↓ (drops global total order)
Causal consistency
    ↓ (drops causal links)
Eventual consistency
```

Session guarantees (read-your-writes, monotonic reads, etc.) layer on top of the above as user-level promises.

## Linearizability

Every operation appears to take effect **instantaneously at some point between its invocation and response**, and that point order matches real-time order across clients.

- Strongest single-object model.
- "Single-copy semantics" — clients can pretend the system is one node.
- Required for: locks, leader election, anything with mutual exclusion.
- Cost: every read needs to confirm it's not stale → consensus or quorum + sequencing.
- Examples: ZooKeeper, etcd, single-key ops in Spanner.

```
Client A: write x=1 ────────────►
Client B:                ────► read x  (must see 1, not 0, because B started after A returned)
```

## Sequential Consistency

There exists *some* total order of operations consistent with each client's program order, but it doesn't have to match real-time across clients.

- Weaker than linearizable: B can read x=0 even after A's write returned, as long as some valid total order exists.
- Programs see a consistent shared view but not a "wall-clock" one.
- Rare in distributed databases; common in CPU memory models (e.g. classic SC for shared-memory threads).

## Causal Consistency

Operations that are causally related (one *happens-before* the other) are seen in the same order by everyone. Concurrent operations can be seen in any order.

- Tracks causality with `vector_clocks_lamport_clocks` *(planned)*.
- Common in collaborative editing, social media feeds, comment threads.
- Example: if Alice posts then Bob comments, every reader sees post → comment. If Alice and Carol post independently, readers may see them in either order.

## Eventual Consistency

If writes stop, all replicas eventually converge to the same value. **No promise about when, or what intermediate states reads see.**

- Weakest commonly-named model.
- Maximum availability; ideal for systems where staleness is OK (DNS, CDN caches, shopping cart adds).
- Conflict resolution required: last-write-wins (timestamp), or CRDTs, or app-level merge.
- Examples: Cassandra default, DynamoDB eventual reads, DNS.

## Session Guarantees (orthogonal layer)

Make eventual consistency tolerable for a single user/client by adding per-session promises:

| Guarantee            | Meaning                                                                |
|----------------------|------------------------------------------------------------------------|
| Read-your-writes     | After you write x, your subsequent reads of x reflect that write.      |
| Monotonic reads      | If you read v=2, you'll never subsequently read v=1.                  |
| Monotonic writes     | Your writes are applied in the order you issued them.                  |
| Writes-follow-reads  | If you read v then write v', other clients see v before v'.            |

Often implemented by **sticky sessions** (route same client to same replica) or **client-side version tracking**.

## Linearizability vs Serializability

Different concepts that are easy to conflate.

- **Linearizability**: single-object, real-time ordering of operations.
- **Serializability**: multi-object transactions schedule equivalent to *some* serial order — no real-time requirement.
- **Strict serializability** = serializable + linearizable. Spanner targets this; most "Serializable" SQL DBs do not (they allow some real-time reordering).

## Worked Examples

| Need                                  | Minimum model              |
|---------------------------------------|----------------------------|
| Distributed lock / leader election    | Linearizability            |
| Bank account balance read             | Linearizability (or strict serializability if multi-row) |
| Social media timeline                 | Causal (or eventual + session guarantees) |
| Shopping cart                         | Eventual + monotonic reads |
| DNS resolution                        | Eventual                   |
| Multi-row transfer (debit + credit)   | Serializability (transactions, not single-object) |

## Common Pitfalls

- **"Strong consistency" is ambiguous** — sometimes means linearizable, sometimes serializable, sometimes both. Always pin down which is meant before designing around it.
- **Eventual consistency ≠ "broken"** — it's a deliberate trade for availability. The right fix is often not "make it stronger" but "layer session guarantees on top".
- **Quorum reads + writes (`W+R>N`) is not linearizable by itself** — it gives strong consistency for the last completed write, but a concurrent read can still observe an older value. Linearizability requires sequencing (consensus) on top of quorum.
- **Causal consistency is the highest available model under partition** (per Mahajan et al.) — useful as the ceiling for AP-leaning designs. [[cap_theorem]].
- **Sessions are cheap, models are expensive** — sticky sessions and client-side version tracking solve most "eventual store feels inconsistent to one user" problems without needing to upgrade the underlying model.

## Related

- [[cap_theorem]] — under partition, you trade C (linearizability/sequential) for A.
- [[quorum_reads_writes]] — strong consistency knob, but not linearizability alone.
- [[raft]] — gives you linearizability via consensus.
- `vector_clocks_lamport_clocks` *(planned)* — mechanism for causal tracking.

---

## References

- Herlihy & Wing, "Linearizability: A Correctness Condition for Concurrent Objects" (1990)
- Lamport, "How to Make a Multiprocessor Computer That Correctly Executes Multiprocess Programs" (1979) — sequential consistency
- Terry et al., "Session Guarantees for Weakly Consistent Replicated Data" (1994)
- Mahajan, Alvisi, Dahlin, "Consistency, Availability, and Convergence" (2011)

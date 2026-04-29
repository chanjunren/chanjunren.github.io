🗓️ 29042026 1530
📎 #distributed_systems #consistency

# quorum_reads_writes

> The N/W/R tuning knob that lets a Dynamo-style system slide between strong consistency and high availability — per operation, not per system. The math (`W + R > N`) is the lever; the trade-offs are the reason it exists.

## The Three Numbers

```ad-abstract
**N** — replication factor. Number of nodes that store a copy of each key.
**W** — write quorum. Number of nodes that must ack a write before it's considered successful.
**R** — read quorum. Number of nodes a read must contact before returning.
```

The client (or coordinator) talks to all N replicas in parallel and returns once W (or R) of them respond.

## The Magic Inequality

```
W + R > N   ⇒   read and write quorums always overlap
```

If every read quorum and every write quorum share at least one node, the read is guaranteed to see the latest acknowledged write (assuming proper version tagging — vector clocks or timestamps).

| Setting          | Effect                                                                |
|------------------|-----------------------------------------------------------------------|
| N=3, W=3, R=1    | Slow writes, fast reads. Any node failure blocks writes.              |
| N=3, W=1, R=3    | Fast writes, slow reads. Any node failure blocks reads.               |
| N=3, W=2, R=2    | Balanced. Tolerates 1 node failure for reads AND writes. Most common. |
| N=3, W=1, R=1    | Eventual consistency. Fast everything, but reads may be stale.        |

## Worked Example

`N=3, W=2, R=2`. Replicas: A, B, C.

Client writes `key=X v=42`:
- Coordinator sends write to A, B, C.
- A and B ack → W=2 met → write returns success. C may have missed it.

Client reads `key=X`:
- Coordinator queries A, B, C.
- Two responses suffice. Possible pairs: `{A,B}`, `{A,C}`, `{B,C}`.
  - `{A,B}` → both have v=42 ✓
  - `{A,C}` → A has v=42, C has v=41 → coordinator picks v=42 (highest version) ✓
  - `{B,C}` → same — B has v=42 wins ✓

Every read pair includes at least one node that saw the write. That's `W + R > N` in action.

## What Breaks It

- **W + R ≤ N** — overlap not guaranteed → eventual consistency only.
- **No version tagging** — coordinator can't tell which response is "newer" without timestamps or vector clocks. `vector_clocks_lamport_clocks` *(planned)*.
- **Sloppy quorums + hinted handoff** — Dynamo lets writes succeed against the *first W reachable nodes* (not necessarily the canonical N). A "hint" stores the write for the offline canonical node and replays later. Improves availability, weakens the W+R>N guarantee until hints drain.
- **Read repair** — when a read finds replicas disagree, the coordinator pushes the winning value back to stale replicas. Doesn't change consistency math, but heals the cluster passively.

## Tunability Per Request

In Cassandra, consistency level (CL) is per-statement:
- `CL=ONE` → R=1, fast read.
- `CL=QUORUM` → R=⌈N/2⌉+1, strong read if matched with W=QUORUM.
- `CL=ALL` → R=N, slowest, no failure tolerance.

This is how [[cap_theorem]]-style decisions become per-operation knobs rather than system-wide stances.

## Common Pitfalls

- **Strict overlap math** — minimum `W + R` for strong consistency on N=5 is 6, so `{W=3, R=4}` or `{W=4, R=3}` work; `{W=3, R=3}` does not.
- **Why `W=2, R=2, N=3` is the common default** — tolerates one node failure on both paths while keeping latency reasonable.
- **W=N is not linearizable on its own** — even all-replicas writes can race with a concurrent read that started before the write completed. Linearizability requires additional sequencing (consensus, e.g. [[raft]]).
- **Hot replica problem** — quorum reads spread load, but the coordinator's "first R to respond" pattern can leave one replica handling almost no reads. Speculative retries help.
- **Watch the write path** — coordinator usually sends to all N (not just W) to keep replicas in sync; W is the *ack threshold*, not the *contact set*.

## Related

- [[cap_theorem]] — quorum-tunable systems (Cassandra) are AP by default but can run as CP per-op.
- [[consistency_models]] — quorum reads give "strong consistency" but only linearizability when paired with consensus.
- [[consistent_hashing]] — how the N replicas are chosen on the ring.
- `vector_clocks_lamport_clocks` *(planned)* — version tagging that lets the coordinator pick the winner.

---

## References

- DeCandia et al., "Dynamo: Amazon's Highly Available Key-value Store" (SOSP 2007)
- Cassandra docs: [Consistency Levels](https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html)

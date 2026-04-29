🗓️ 29042026 1500
📎 #distributed_systems #consistency

# cap_theorem

> The trilemma every distributed-data-store designer hits: under network partition, you must trade consistency for availability. The "pick 2 of 3" reading misleads — partition tolerance is not optional in real networks.

## The Three Letters

```ad-abstract
**C** Consistency — every read sees the latest committed write (linearizability, in the strict CAP sense).
**A** Availability — every request to a non-failed node gets a non-error response.
**P** Partition tolerance — the system keeps operating when the network drops messages between nodes.
```

## The Theorem (Brewer, formalised by Gilbert–Lynch)

In an asynchronous network, when a partition happens, a system can guarantee **at most one of C or A**, never both.

The phrasing "pick 2 of 3" is misleading. In any real distributed system you cannot opt out of P — the network *will* partition. The actual choice is:

- **CP** — when a partition happens, refuse requests on the minority side to preserve consistency.
- **AP** — when a partition happens, keep serving on both sides and reconcile later (eventual consistency).

If there's no partition, both C and A are achievable. CAP is a statement about behaviour **during** failure, not steady-state.

## Worked Examples

| System                 | Stance | What it does on partition                                            |
|------------------------|--------|----------------------------------------------------------------------|
| ZooKeeper / etcd       | CP     | Minority side rejects writes; uses [[raft]] / Zab to require quorum. |
| Cassandra (default)    | AP     | All nodes accept writes; resolves with last-write-wins / hinted handoff. |
| DynamoDB (eventual)    | AP     | Same — accept writes everywhere, reconcile on read.                  |
| MongoDB (majority writeConcern) | CP | Writes need majority ack — minority side blocks.                  |
| Single-node Postgres   | CA     | Vacuously — no partition possible inside one process.                 |

## Common Pitfalls

- **"Pick 2 of 3"** — wrong framing. P is not optional; the choice is C-vs-A *under* P.
- **Latency confusion** — CAP says nothing about latency. A "consistent" read can still be slow. The latency story is `pacelc_theorem` *(planned)*.
- **C in CAP ≠ C in ACID** — CAP-C means linearizability across replicas. ACID-C means the DB doesn't violate constraints. Different concept entirely.
- **A in CAP ≠ "highly available"** — CAP-A means *every* non-failed node responds. A 99.99% uptime system can still be CP (it just had a few minutes of unavailability during a partition).
- **Tunable consistency** — Cassandra lets you pick CL=QUORUM per request, which moves the system toward CP for that operation. CAP applies per-operation, not per-system.
- **"What happens if W + R > N?"** — bridges into [[quorum_reads_writes]]. Be ready to do that math.

## Why It Matters in Practice

CAP shapes the architectural posture of every replicated store. Decisions like *"do we use etcd for service discovery, or Consul, or DynamoDB?"* are CAP decisions in disguise. Etcd refuses writes on a minority side because Raft requires quorum — silently accepting them would let the partition heal into a split-brain. DynamoDB instead lets every node accept writes because availability is the higher-priority property for the workloads it targets. Both are correct given their stance.

## Related

- `pacelc_theorem` *(planned)* — the CAP extension that adds latency-vs-consistency in steady state.
- [[consistency_models]] — what "C" actually means at finer granularity.
- [[quorum_reads_writes]] — N/W/R as the lever to slide between CP and AP.
- [[raft]] — a CP consensus protocol; concrete instance of the trade-off.

---

## References

- Gilbert & Lynch, "Brewer's conjecture and the feasibility of consistent, available, partition-tolerant web services" (2002)
- Brewer, "CAP Twelve Years Later: How the 'Rules' Have Changed" (IEEE Computer, 2012)

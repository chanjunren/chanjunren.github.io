🗓️ 29042026 1745
📎 #database #distributed_systems #transactions

# two_phase_commit

> The textbook protocol for atomic commit across multiple participants. Worth understanding mainly so you know *why teams avoid it* in production — and what they reach for instead ([[saga_pattern]], [[outbox_pattern]]).

## The Protocol

```ad-abstract
A coordinator drives all participants through two phases:
1. **Prepare** — coordinator asks "can you commit?". Participants write a tentative log entry, lock affected rows, reply YES or NO.
2. **Commit / Abort** — if all said YES, coordinator decides COMMIT and tells everyone. If any said NO (or timed out), coordinator decides ABORT.
```

```
Coordinator                Participant A         Participant B
    │ ── prepare ────────►     │                     │
    │                          │ ── lock + log ──    │
    │ ◄───── YES ──────────    │                     │
    │ ── prepare ─────────────────────────────►      │
    │                          │                     │ ── lock + log ──
    │ ◄───── YES ────────────────────────────────────│
    │ ── commit ────────►      │                     │
    │ ── commit ─────────────────────────────►       │
    │ ◄───── ack ──────────    │ ── apply ─          │
    │ ◄───── ack ────────────────────────────────────│
                                                     │ ── apply ─
```

Once a participant says YES, it must be **prepared to commit even if it crashes** — durably logged to disk. This is the price of the guarantee.

## What It Buys You

Atomicity across multiple participants:

- All commit, or all abort. No partial commit.
- Works across DBs (XA standard), services, queues that support it.

## Why Teams Avoid It

### Blocking on Coordinator Failure

If the coordinator crashes after some participants got "commit" and others didn't, the remaining participants are **stuck holding locks** waiting to learn the decision. They can't unilaterally commit (might violate atomicity) or abort (someone else may have committed).

A new coordinator takes over from the log, but during the gap, participants are blocked. This is the famous **2PC blocking problem**.

### Latency

Two RTTs minimum (prepare + commit), plus durable log writes at each step. A geographically-distributed 2PC adds tens of ms of latency per participant.

### Throughput Hit

Locks held across the prepare phase serialise contended transactions. If two 2PC txns touch the same row, the second blocks until the first finishes phase 2.

### Heuristic Decisions

Operators sometimes manually "force commit" or "force abort" stuck participants. These **heuristic decisions can violate atomicity** — different participants may end up with different outcomes. XA defines this in the standard ("heuristic mixed" outcome) and it's exactly as bad as it sounds.

## Three-Phase Commit (3PC) — Doesn't Save You

3PC adds a "pre-commit" phase between prepare and commit. The intent: even if the coordinator crashes, participants can recover deterministically.

Why it's not used in practice: 3PC assumes a **synchronous network with bounded delays**. Real networks have unbounded delays under partition (FLP impossibility result). 3PC is correct in theory under its model, broken in practice.

## XA Transactions

XA is the standard interface for 2PC across heterogeneous resource managers (RDBMS + JMS broker, etc.). Java has `javax.transaction.xa.XAResource`. Spring has JTA support.

In modern stacks: rare. Nobody runs XA across MySQL + Kafka in production. The operational overhead is too high. The industry settled on **eventual consistency + saga / outbox** instead. See [[saga_pattern]], [[outbox_pattern]].

## Where 2PC Still Lives

- **Distributed databases internally** (TiDB, CockroachDB, Spanner all use 2PC variants over Paxos/Raft for cross-shard txns).
- **Specific high-stakes ledger systems** where atomicity is non-negotiable and the operational cost is acceptable.
- **Single-DB cross-table transactions** — not 2PC, just normal local transactions; people sometimes confuse the two.

## Common Pitfalls

- **The main downside of 2PC is coordinator failure blocks participants** — latency and throughput are secondary problems compared to stuck locks during recovery.
- **Raft does not solve participant blocking** — it makes the *coordinator* fault-tolerant via consensus, but participants still block waiting for the decision. Modern Spanner-style systems combine 2PC (cross-shard atomicity) with Paxos (coordinator durability).
- **3PC is a theoretical fix, practical no-op** — assumes bounded delays, which real networks violate. Doesn't survive partitions.
- **Practical alternatives** are [[saga_pattern]] (compensating actions, eventual consistency) and [[outbox_pattern]] (transactional event publishing for cross-service workflows). Both sacrifice strict atomicity for availability.
- **When 2PC still earns its keep** — financial/regulatory contexts where atomicity is required and the latency cost is acceptable. Otherwise saga is the default.
- **FLP Impossibility** is the formal underpinning — in an asynchronous network with even one possible faulty process, no deterministic consensus protocol can guarantee termination. 2PC's blocking behaviour is a concrete instance.

## Related

- [[saga_pattern]] — eventual-consistency alternative for cross-service business txns.
- [[outbox_pattern]] — atomic DB write + reliable event publish without 2PC.
- [[raft]] — consensus for replicating coordinator state.
- [[cap_theorem]] — 2PC is CP; chooses consistency, gives up availability under partition.

---

## References

- Gray & Reuter, "Transaction Processing: Concepts and Techniques" ch. 12
- Fischer, Lynch, Paterson, "Impossibility of Distributed Consensus with One Faulty Process" (1985)
- "Designing Data-Intensive Applications" ch. 9

🗓️ 29042026 1600
📎 #distributed_systems #moc

# moc_distributed_systems

> Map of Content for the distributed-systems concept cluster. Walk top-to-bottom; if a concept resists self-explanation in two minutes, re-read the zettel.

## Concept Order

### Foundations
1. [[cap_theorem]] — the trilemma framing for trade-offs under partition.
2. [[consistency_models]] — what "C" actually means at finer granularity.
3. [[quorum_reads_writes]] — N/W/R as the lever between CP and AP.
4. [[consistent_hashing]] — sharding scheme that minimises movement on N changes.
5. [[raft]] — consensus protocol; concrete instance of a CP system.

### Extensions (planned)
- `pacelc_theorem` — adds latency-vs-consistency to the steady-state picture.
- `paxos_basics` — peer to Raft, harder to implement, foundational to ZAB.
- `linearizability_vs_serializability` — single-object real-time vs multi-object schedule equivalence.
- `vector_clocks_lamport_clocks` — causal tracking and monotonic IDs.

### Edge cases (planned)
- `gossip_protocol` — eventually-consistent membership / state dissemination.
- `crdt_basics` — conflict-free replicated data types for AP-leaning merges.

## How to Use This MOC

- **First pass**: read each zettel back-to-back, take no notes, just absorb.
- **Second pass**: walk this index, write a 3-bullet recall for each entry from memory, then compare to the zettel. Gaps point to where the concept hasn't landed.
- **Application drill**: take a system design prompt (e.g. *"design a globally-replicated KV store"*) and try to weave 5+ of these zettels into the answer naturally. The connections matter as much as the individual concepts.
- **Tag hygiene**: zettels here are tagged by topic (`#distributed_systems`, `#consistency`, `#sharding`). Drop `#wip` once a zettel is revised and stable.

## Bridges to Other Domains

- → DB internals: [[ACID]], [[concurrency_control]], [[mvcc_innodb_read_view]], [[transaction_isolation_levels]].
- → Caching: [[redis_cluster]], `redis_distributed_lock` *(planned)*.
- → Messaging: [[exactly_once_semantics]], `kafka_architecture` *(planned)*.
- → System design templates: `system_design_framework` *(planned)*, `back_of_envelope_estimation` *(planned)*.

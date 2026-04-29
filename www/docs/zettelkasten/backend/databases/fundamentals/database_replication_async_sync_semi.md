🗓️ 29042026 1715
📎 #database #replication

# database_replication_async_sync_semi

> The three replication acknowledgement modes. The difference between them is whether recently-committed data survives the next leader crash — and how much latency you trade for that guarantee.

## The Three Modes

```ad-abstract
**Asynchronous** — leader commits + acks the client. Replicas catch up later.
**Synchronous** — leader waits for **all** replicas to ack before responding to the client.
**Semi-synchronous** — leader waits for **at least one** replica to ack before responding.
```

| Mode             | Leader-side latency       | Data loss on leader crash    | Throughput                |
|------------------|---------------------------|------------------------------|---------------------------|
| Async            | RTT(leader→disk)          | Up to *replication lag* of writes | Highest              |
| Semi-sync        | RTT(leader→disk) + RTT(replica) | Bounded — at least one replica has it | Medium      |
| Sync (all)       | RTT(slowest replica)      | Zero                         | Lowest, slowest replica caps you |

## When Each Is Used

- **MySQL default**: async. Simple, fast, accepts data-loss risk on failover.
- **MySQL `rpl_semi_sync`**: opt-in semi-sync. Used by many production deployments wanting bounded loss without all-replica wait.
- **PostgreSQL `synchronous_standby_names`**: configurable list, supports `ANY n` (semi-sync-style) and `FIRST n` (priority-based).
- **Spanner / CockroachDB**: synchronous via Paxos/Raft quorum (W = majority).
- **Galera / InnoDB Cluster**: synchronous multi-write via group communication.

## What "Synchronous" Actually Means

Pure all-replica sync is rare in practice — one slow replica drags down the entire cluster. Real "sync" usually means **quorum sync** (e.g. majority via [[raft]] or Paxos). [[quorum_reads_writes]] is the formal model.

Calling MySQL `rpl_semi_sync` "synchronous" is loose: it ensures one replica got the write, not that the replica has applied it. There's a window between "ack received" and "applied" where reading from that replica is still stale.

## Replication Lag

Async + semi-sync replicas apply changes after they're received. The delay = **replication lag**. Sources:

- Network RTT between leader and replica.
- Replica's apply throughput (single-threaded SQL apply was MySQL's classic bottleneck — fixed somewhat by parallel apply since 5.7).
- Replica is also serving reads — apply gets queued.

Lag → **read-after-write inconsistency**: write to leader, read from replica, don't see your own write. Mitigations:

- Read your own writes from leader.
- Wait for replica to confirm position (`MASTER_POS_WAIT` in MySQL).
- Stick the user to one replica (sticky sessions).
- Use synchronous reads from leader for sensitive paths.

## Logical vs Physical

- **Physical** (Postgres WAL streaming, MySQL row-based binlog): bytes-level replay. Tight coupling between versions; replicas are byte-identical.
- **Logical** (statement-based, or logical decoding output): replays high-level changes. Loose coupling; can replicate across major versions or different schemas. Used for CDC tools (Debezium reads MySQL row-based binlog; Postgres logical decoding feeds it).

MySQL binlog has three formats: STATEMENT, ROW, MIXED. ROW is the production default — deterministic, no nondeterministic-function issues.

## Replication Topologies

| Topology         | Description                                          | Used in                  |
|------------------|------------------------------------------------------|--------------------------|
| Single-leader    | One writer, N readers. Most common.                   | MySQL/Postgres default   |
| Multi-leader     | Multiple writers, conflict resolution required.       | Multi-region setups, BDR |
| Leaderless       | All nodes accept writes; quorum reads/writes.         | Cassandra, Dynamo        |

## Failover

- **Async + leader crash** → some recently-committed-on-leader writes are gone. Acceptable for many use cases (tolerate 1–10s of lost writes during failover).
- **Semi-sync + crash** → at least one replica had the write. Promote that one. Zero loss IF the right replica is promoted.
- **Sync (quorum) + crash** → majority has the write. Always-correct failover. This is the pitch for Raft-backed systems.

Split brain risk during failover: old leader doesn't know it lost the role and accepts writes. Mitigations: fencing tokens, lease timeouts, STONITH ("shoot the other node in the head").

## Common Pitfalls

- **Async is MySQL's default for throughput** — most workloads tolerate the small data-loss window during a rare failover.
- **Semi-sync is best-effort, not a hard guarantee** — if all replicas are unreachable, MySQL falls back to async after a configurable timeout. The replica-acked-write guarantee disappears in that window.
- **Pure synchronous all-replicas blocks forever if one replica is slow** — which is why real systems use semi-sync or quorum-based sync, not all-replicas sync.
- **Reading your own writes from a replica** has no zero-cost answer — wait for the replica to catch up to the leader's position, read from the leader, or pin the session to one replica.
- **Parallel apply is tricky** — out-of-order replay can violate constraints. MySQL keys parallelism on schema or per-database to bound the race.

## Related

- [[raft]] — quorum-based "synchronous" replication done right.
- [[quorum_reads_writes]] — N/W/R formalism.
- [[cap_theorem]] — async = AP-leaning, sync-quorum = CP-leaning.
- `read_write_splitting_replication_lag` *(planned)* — application-side patterns.

---

## References

- "Designing Data-Intensive Applications" ch. 5
- MySQL docs: [Replication Modes](https://dev.mysql.com/doc/refman/8.0/en/replication-semisync.html)
- PostgreSQL docs: [Synchronous Replication](https://www.postgresql.org/docs/current/warm-standby.html#SYNCHRONOUS-REPLICATION)

🗓️ 29042026 2015
📎 #redis #distributed_systems #concurrency

# redis_distributed_lock

> The pattern for "only one process holds this resource at a time" using Redis as the coordinator. Simple-looking, surprisingly subtle — and the subject of one of the most-cited debates in distributed systems (Kleppmann vs antirez over Redlock).

## The Naive Lock

```
SETNX lock:resource 1     # set if not exists, returns 1 if acquired, 0 if held
DEL lock:resource         # release
```

Two problems immediately:
1. If the holder crashes, the lock is held forever. → add **TTL**.
2. If holder A's TTL expires and B acquires, A's eventual `DEL` releases B's lock. → add a **token** (unique per holder).

## The Correct Single-Node Lock

### Acquire

```
SET lock:resource <unique-token> NX PX 30000
```

- `NX` — only set if not exists (atomic).
- `PX 30000` — auto-expire after 30 seconds.
- `<unique-token>` — UUID or similar, unique to this acquisition.

If the response is `OK`, you have the lock. Otherwise, retry with backoff or fail.

### Release (atomic check-and-delete)

```lua
-- Lua script run on Redis
if redis.call("GET", KEYS[1]) == ARGV[1] then
  return redis.call("DEL", KEYS[1])
else
  return 0
end
```

Released atomically: only delete if the value still matches our token. Prevents the "I deleted someone else's lock" bug after my TTL expired.

This is the **safe single-Redis lock**. For most use cases it's enough.

## Why Single-Node Has Limits

A single Redis is a single point of failure. If it goes down, no one can lock or unlock. Failover to a replica produces a window where:

- The replica may not have the lock entry yet (async replication).
- Process A holds the lock against the old primary.
- Process B asks the new primary, sees no lock, acquires it.
- Both A and B think they hold the lock. **Mutual exclusion violated.**

This is the same async-replication failure mode as [[database_replication_async_sync_semi]].

## Redlock — Multi-Node Algorithm

To survive single-node failure, antirez (Redis author) proposed **Redlock**:

```
1. Get current time t_start.
2. Try to acquire the lock on N independent Redis instances (e.g. N=5) in sequence,
   each with a small per-attempt timeout.
3. If acquired on majority (≥ 3 of 5) AND total elapsed time < TTL, you hold the lock.
   Effective TTL = configured_TTL - elapsed_time.
4. Otherwise, release on all instances and retry.
5. Release: send DEL to all N instances regardless.
```

**Goal**: tolerate up to ⌊N/2⌋ Redis failures. Faster than running consensus (Raft) for the lock.

## The Kleppmann Critique

Martin Kleppmann published "[How to do distributed locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)" arguing **Redlock is unsafe** in two scenarios:

### 1. GC Pause / Process Stall

```
A acquires lock at t=0 (TTL 30s)
A starts critical section
A pauses for 35s (long GC, swap, network stall)
TTL expires at t=30, lock released
B acquires lock at t=31
A wakes at t=35, still believes it holds the lock
A and B both write → corruption
```

The lock's TTL is wall-clock; the process's "I hold the lock" belief is decoupled from any external truth. The lock alone cannot prevent A's stale write.

### 2. Network Asymmetry / Clock Drift

Redlock relies on the timing of acquisition across N nodes being roughly comparable. Pauses, slow networks, or clock skew can let two processes both believe they have majority.

### Kleppmann's Fix: Fencing Tokens

Instead of "do I hold the lock?", the resource being protected (DB, file, service) checks **monotonically increasing tokens**:

```
A acquires lock, gets token=33
B acquires lock later, gets token=34
A's stale write to DB carries token=33
B's write carries token=34
DB rejects any write with token < highest seen
```

The DB enforces ordering, not the lock. Locks are advisory; tokens are authoritative. To produce monotonic tokens reliably you need a consensus system (ZooKeeper / etcd / a sequencer) — at which point you might as well use that system's locking primitives.

### antirez's Response

antirez's [counter](http://antirez.com/news/101): Redlock is correct *given its assumptions* (bounded clock drift, no infinite pauses). For most workloads where these assumptions hold, it's safe. Kleppmann's failure modes apply equally to many other distributed-locking schemes.

The practical reality:

- **For correctness-critical work** (financial ledgers, exclusive ownership of DB writes), use a **consensus-backed lock** ([[raft]]-based etcd / ZooKeeper) **plus fencing tokens** at the resource layer.
- **For best-effort coordination** (cache stampede prevention, opportunistic batch jobs), single-Redis lock with token + Lua release is fine.
- **Redlock specifically** is an awkward middle ground — operationally heavier than single-node, less safe than consensus. Most teams either pick simpler or stronger.

## When to Use What

| Need                                            | Choice                                         |
|-------------------------------------------------|------------------------------------------------|
| Cache stampede prevention                       | Single-Redis lock with token + Lua release     |
| One-of-N workers process a batch                | Single-Redis lock; idempotent work compensates if it fails |
| Leader election                                  | etcd / ZooKeeper / Consul — not Redis          |
| Exclusive write to a DB row                     | DB row lock (`SELECT ... FOR UPDATE`), not Redis |
| "Only one X can run at a time" with strong guarantees | Consensus + fencing tokens                |

## Common Pitfalls

- **No TTL** → lock leaks on holder crash.
- **TTL too short** → lock expires mid-critical-section, second holder acquires, double execution.
- **Releasing without token check** → you delete someone else's lock. Always use the Lua check-and-delete.
- **Acquiring then doing slow I/O** → trust the lock too much. Build idempotency into the work itself.
- **Using Redlock as drop-in for consensus locks** → it isn't. Understand the trade-offs.
- **Reentrancy assumed** → Redis locks aren't reentrant by default. Implement explicitly (count + token) or use a library that does.
- **Forgetting clock skew** → don't assume elapsed time is exact across nodes; build slack into the TTL.

## Related

- [[redis_cluster]] — locking across cluster mode is more complex (slot-aware).
- [[lettuce]] — Java client; supports Lua eval for atomic release.
- [[raft]] — what consensus-backed locks are built on.
- [[cache_stampede_thundering_herd]] — most common practical use of Redis locks.
- [[two_phase_commit]] — for context on why distributed locks are hard.

---

## References

- antirez, ["Distributed locks with Redis"](https://redis.io/docs/latest/develop/use/patterns/distributed-locks/)
- Kleppmann, ["How to do distributed locking"](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)
- antirez, ["Is Redlock safe?"](http://antirez.com/news/101)

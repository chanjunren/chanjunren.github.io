🗓️ 25042026 1430
📎 #redis #distributed_systems #sharding

# redis_cluster

> How Redis spreads data across multiple nodes, and why multi-key commands get tricky.

## Why Cluster

A single Redis server has limits — RAM, CPU, network. Redis Cluster shards the keyspace across N nodes so the system scales horizontally.

## Slots

- Keyspace partitioned into **16384 slots** (`0`–`16383`).
- Each key maps to a slot via `CRC16(key) mod 16384`.
- Each node owns a **range of slots**.

```
key "userX" → CRC16 → slot 5234 → node B
key "userY" → CRC16 → slot 12101 → node D
```

The `{node → slots}` map = **cluster topology**. Clients cache it locally so they can route commands directly to the right node.

## Topology Changes

Topology shifts on:
- Failover (replica promoted to primary)
- Resharding (slots moved between nodes)
- Node join / leave

Server signals via `MOVED` / `ASK` redirect responses. Smart clients update their local topology cache when they see these.

## Multi-key Commands Across Nodes

`MGET key1 key2 key3` on a single Redis = one round-trip, one reply list.

On a cluster, keys can live on different nodes. Client must:

1. **Route**: look up which node owns each key
2. **Split**: partition into per-node sub-requests `[key1, key2]→A, [key3]→B`
3. **Fan out**: fire sub-requests in parallel
4. **Reassemble**: collect replies and re-order them to match the original key order

Step 4 assumes every sub-request returns. If one node's reply never arrives (timeout, half-open socket, dead peer), reassembly indexes off the end of a shorter-than-expected array → `IndexOutOfBoundsException` (in Lettuce specifically).

## Hash Tags — Forcing Co-location

Multi-key commands across slots are inherently brittle. Hash tags pin keys to the same slot:

```
SET {user:42}:profile  ...
SET {user:42}:cart     ...
```

Only the substring inside `{...}` is hashed → both keys land on the same node → `MGET {user:42}:profile {user:42}:cart` becomes a single-node call.

Use hash tags when keys are logically grouped and you want atomic / multi-key access without fan-out fragility.

## Key Takeaways

- Cluster ≠ single Redis. **Multi-key commands fan out** — fragility scales with the number of nodes touched.
- Topology is **client-cached**, not pulled live every call. Stale topology → wrong-node calls → `MOVED` storm or worse.
- **Hash tags** (`{...}`) are the escape hatch when you need same-slot guarantees.

---

## References

- [Redis Cluster spec](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)
- [[lettuce]] — client-side handling
- [[connection_wedge]] — what happens when one node goes silent

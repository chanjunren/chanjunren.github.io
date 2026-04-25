🗓️ 25042026 1432
📎 #java #redis #netty

# lettuce

> Java Redis client. Sits under Spring Data Redis. Persistent connection per node. Async by default.

## Position In The Stack

```
Controller / Service
     ↓
JwtCacheUtils (or any Redis-using component)
     ↓
ok-redis-core (in-house wrapper)
     ↓
Spring Data Redis
     ↓
Lettuce        ← this zettel
     ↓
Netty (TCP / event loop)
     ↓
Redis Cluster nodes
```

## Connection Model

- **One persistent TCP connection per Redis node** (not per request, not per thread).
- Connection is multiplexed — many concurrent ops pipeline through the same socket.
- Backed by Netty event loop → non-blocking, async.
- Connection lives for the lifetime of the JVM process unless explicitly closed or torn down by topology refresh.

This is great for throughput (no handshake-per-request) but bad for failure recovery — one wedged socket = every op routed to that node fails until something tears it down.

## Cluster Routing

- Lettuce caches the cluster topology locally.
- For single-key commands, looks up slot → node → writes to that node's connection.
- For multi-key commands like `MGET`, uses **`MultiNodeExecution`**:
  1. Group keys by owning node
  2. Fire sub-requests in parallel via each node's connection
  3. Reassemble replies into original key order
- Reassembly assumes **all sub-requests returned**. If one node's reply is missing (timeout, dropped, never came), `result.get(i)` for the missing index throws `IndexOutOfBoundsException`.

## Topology Refresh

Two modes — **both off by default** for cluster clients in older versions:

### Periodic
Re-pull topology every N seconds. Detects gradual drift. Cheap, predictable.

### Adaptive
Refresh on **trigger events**:
- `MOVED` redirects (slot moved)
- `ASK` redirects (resharding in progress)
- Reconnect attempts (connection died and bounced)
- Persistent reconnect failures
- Unknown node responses

Adaptive refresh is what catches the **wedge case**: a connection that looks alive at the socket level but produces failing ops. Once Lettuce sees enough trouble signals from one node, it tears down + rebuilds connections.

### Enabling

```java
ClusterTopologyRefreshOptions topologyRefreshOptions =
    ClusterTopologyRefreshOptions.builder()
        .enablePeriodicRefresh(Duration.ofSeconds(30))
        .enableAllAdaptiveRefreshTriggers()
        .build();

ClusterClientOptions clientOptions =
    ClusterClientOptions.builder()
        .topologyRefreshOptions(topologyRefreshOptions)
        .build();
```

## Failure Modes To Know

| Mode | Cause | Symptom |
|---|---|---|
| Connection wedge | Half-open TCP, node silent | `IndexOutOfBoundsException` on multi-key ops, ops hang to one node only |
| Topology stale | Failover happened, client didn't refresh | `MOVED` storm, ops to wrong node |
| Command timeout | Slow Redis, network latency | `RedisCommandTimeoutException` |
| Disconnected | Reconnect in progress | `RedisConnectionException` until reconnect succeeds |

## Key Takeaways

- **Persistent connections are a double-edged sword** — fast in steady state, brittle when sockets wedge.
- **Always enable adaptive topology refresh** for cluster deployments. Default-off was a footgun.
- `IndexOutOfBoundsException` from `MultiNodeExecution` ≈ "one shard is silently dead" — almost never a real bug in your code.

---

## References

- [Lettuce reference — Cluster](https://lettuce.io/core/release/reference/index.html#redis-cluster)
- [[redis_cluster]] — what Lettuce is talking to
- [[connection_wedge]] — the failure mode adaptive refresh exists to handle

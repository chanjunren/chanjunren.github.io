🗓️ 25042026 1438
📎 #reliability #failure_modes #tcp

# connection_wedge

> A live, open TCP connection that produces broken behavior. Usually the app/library view of an underlying half-open socket. A **quality** problem on a single connection.

## Mechanism

The TCP socket appears `ESTABLISHED` to the OS and the app, but it's actually broken — see [[tcp_half_open]] for why.

Library / app keeps routing operations through the wedged connection because it has no way to know it's dead:

- `write()` returns success (data went into kernel send buffer)
- `read()` blocks forever, or returns nothing, or returns a malformed reply
- App-level operation throws / hangs / returns garbage

If the connection is **persistent and per-peer** (e.g. Lettuce's connection-per-Redis-node), every op routed to that peer fails until something tears it down. **One bad connection takes out one peer's worth of traffic.**

## Symptoms

- **Cliff**, not ramp — error rate spikes from ~0 to "everything" at the trigger moment.
- Errors look weird at the library level — `IndexOutOfBoundsException` (Lettuce reassembly), `NullPointerException`, hangs, "missing reply".
- Scope is **process-local**: only the one client/pod is affected. Other replicas fine.
- Restart fixes instantly. The next wedge happens at a random time later.

## Detection

- Sudden cliff in error rate localized to one process.
- Errors target a specific peer (one Redis node, one DB host) — not all peers.
- `ss -i` on the wedged socket can show suspicious values: `unacked` packets accumulating, retransmits, etc. (often too late to catch live.)
- Pod-level metric: P99 latency to one peer spikes while others stay flat.

## Fix Strategies

| Strategy | What it does |
|---|---|
| Restart | Wipe all sockets, rebuild fresh. Effective, blunt. |
| App-level read timeout | Op errors out instead of hanging — bleeding stops, wedge persists. |
| TCP keepalive (aggressive) | Kernel notices wedge faster, closes socket → reconnect path triggers. |
| App-level heartbeat | PING → fail → reconnect. Lib-specific. |
| Adaptive healer | Library detects trouble signals (timeouts, missing replies, reconnect spam) and rebuilds proactively. **Lettuce adaptive topology refresh.** |
| Connection age limit | Recycle every N minutes regardless. Crude but works. |

The actual fix is always: **detect → tear down → rebuild**. Retrying the op is useless — same wedged socket.

## What Wedges Are NOT

- **Not** a connection leak ([[connection_leak]]) — leak is a quantity problem with healthy connections piling up unreturned.
- **Not** a Redis / DB outage — server is fine, other clients are fine, only **this** client → **this** peer is broken.
- **Not** something retries fix — retries land on the same wedged connection.

## Key Takeaways

- **Wedge = quality problem on one connection.** Leak = quantity problem in the pool.
- **Cliff timeline → state flip**, not capacity. Wedge is the canonical state-flip failure on long-lived sockets.
- **Persistent-connection clients need an active healer.** Without one, wedges persist until process restart.
- **Single-client scope is diagnostic gold** — narrows the hypothesis to client-local socket state.

---

## References

- [[tcp_half_open]] — the underlying TCP-layer cause
- [[connection_leak]] — the other "connection-related" failure mode, often confused with wedge
- [[lettuce]] — concrete example: per-node persistent connection + adaptive topology refresh
- [[error_timeline_shapes]] — cliff vs ramp diagnostic

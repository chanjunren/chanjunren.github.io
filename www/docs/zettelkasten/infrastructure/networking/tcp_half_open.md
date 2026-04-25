🗓️ 25042026 1434
📎 #tcp #networking #failure_modes

# tcp_half_open

> TCP connection where one side believes the link is alive, the other doesn't. Silent. No error fires. Devastating for long-lived connections.

## What "Half-Open" Means

Normal TCP close = both sides exchange `FIN` packets. Each side knows the connection is gone.

Half-open = one side's view of the connection diverges from the other:

- **Client side**: socket says `ESTABLISHED`, kernel buffer accepts writes, app sees a healthy fd.
- **Server side** (or path between): connection is gone, never existed, or peer can't be reached.

No `RST`, no `FIN`, no error. The OS doesn't know. The app doesn't know.

## How It Happens

| Cause | Mechanism |
|---|---|
| Network blip | Switch reboots, route flap, transient packet loss |
| NAT/firewall idle timeout | Middlebox drops state for "idle" connections, neither end notified |
| Peer crash without RST | Hard reboot, kernel panic — no `FIN` sent |
| Long GC pause / process freeze | Peer unresponsive long enough for path state to expire |
| Cloud LB / service mesh quirks | Sidecar terminates connection on its end without propagating |

## Why It's Silent

- TCP only signals failure on **active probing**: when you try to write enough that the peer should ACK.
- `write()` returns success once data is in the local kernel buffer, not when it's ACKed.
- Reads block forever (or until app-level timeout) — no kernel signal that "this read will never complete".
- Default `SO_KEEPALIVE` is **off**. Even when on, default interval is ~2 hours on Linux — useless for production timescales.

## Symptoms

- Persistent connection clients suddenly produce **timeouts on a subset of ops** (only ones routed to wedged peer).
- Reconnect-on-failure clients recover; persistent-connection clients don't.
- Pod / process restart fixes it instantly.
- Other replicas unaffected — scope is **client-side socket state**.

## Mitigations

### App-level read timeout
Set per-op timeout (e.g. Lettuce `commandTimeout`). Op errors out instead of hanging forever. Doesn't tear down the wedged socket but stops bleeding.

### TCP keepalive
```
net.ipv4.tcp_keepalive_time = 60     # idle seconds before first probe
net.ipv4.tcp_keepalive_intvl = 10    # seconds between probes
net.ipv4.tcp_keepalive_probes = 6    # probes before giving up
```
Kernel sends keepalive probes on idle. Wedge surfaces as connection close after `time + intvl * probes` seconds.

### App-level heartbeat
PING / no-op every N seconds. Failure trips a reconnect.

### External healer
Library detects trouble (timeouts, missing replies, reconnect spam) and rebuilds connections proactively. **Lettuce's adaptive topology refresh is exactly this.**

### Connection age limit
Cycle connections every N minutes regardless of health. Crude but effective when app-level signals are unreliable.

## Key Takeaways

- **Long-lived TCP connections need an external healer.** Default OS behavior gives you nothing useful at production timescales.
- **Half-open ≠ dead.** Dead = error fires somewhere. Half-open = nothing fires; everything looks fine.
- Fix is always: detect → tear down → rebuild. Never just "retry the op" — same wedged socket will fail again.

---

## References

- [TCP Keepalive HOWTO](https://tldp.org/HOWTO/TCP-Keepalive-HOWTO/)
- [[connection_wedge]] — what happens at the app/library layer when a TCP connection half-opens
- [[lettuce]] — concrete example of detect-and-rebuild via topology refresh

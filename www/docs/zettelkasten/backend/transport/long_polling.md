🗓️ 06062026 1500
📎 #api #realtime #protocols

# long_polling

> Hold the HTTP connection open until the server has something to say. A middle ground between wasteful short polling and the complexity of persistent connections.

## Short Polling (Baseline)

Client fires a request every N seconds, regardless of whether anything changed. Simple, but:

- Most responses are empty — wasted bandwidth and server cycles.
- Update latency = poll interval. Want sub-second? Poll sub-second. Server hates you.
- Scales poorly: 10k clients × 1 req/s = 10k req/s of mostly nothing.

## How Long Polling Works

1. Client sends a normal HTTP request.
2. Server checks for new data. If none, it **holds the connection open** instead of responding immediately.
3. When data arrives (or a timeout elapses), server responds.
4. Client processes the response and **immediately reconnects**.

```
Client                          Server
  │                               │
  ├──── GET /events?since=42 ────>│
  │                               │ (holds connection)
  │                               │ ... waiting ...
  │                               │ (new data arrives)
  │<──── 200 {event: 43, ...} ───┤
  │                               │
  ├──── GET /events?since=43 ────>│  ← immediate reconnect
  │                               │ (holds again)
  ...
```

The effect: near-real-time delivery with plain HTTP. No special protocol, no browser API beyond `fetch`.

## Server-Side Considerations

**Thread/connection cost.** Each waiting client holds an open connection. Thread-per-request servers (classic Tomcat) tie up a thread per client. Async/non-blocking servers (Netty, Node.js, Undertow) handle this cheaply — the connection exists but no thread is blocked.

**Timeout tuning.** The server must respond before intermediaries drop the connection:

| Layer | Typical idle timeout |
|---|---|
| Browser | 300s (varies) |
| NGINX proxy | 60s default (`proxy_read_timeout`) |
| AWS ALB | 60s default (configurable to 4000s) |
| Cloudflare | 100s |

Set the server hold time below the lowest intermediary timeout. 30–45s is a safe default. Client reconnects on timeout just like on data.

**Thundering herd.** If the server pushes a broadcast event, all clients get a response simultaneously and reconnect at the same instant — a spike of N new requests. Mitigate with jittered reconnect delays on the client.

## When to Use

- Maximum browser/client compatibility (works everywhere HTTP works)
- Simple server setup — no upgrade handshake, no special protocol
- Low-to-moderate frequency updates (seconds, not milliseconds)
- Environments where WebSocket/SSE are blocked by proxies or firewalls

## Common Pitfalls

```ad-warning
**Proxy idle timeouts.** Reverse proxies and load balancers kill idle connections. If the server holds longer than the proxy allows, the client sees a broken connection with no data. Always hold shorter than the shortest proxy in the chain.
```

```ad-danger
**HTTP/1.1 connection limits.** Browsers allow ~6 connections per domain on HTTP/1.1. Each long-poll tab eats one. Two tabs + other API calls = blocked requests. HTTP/2 multiplexing eliminates this, but long polling predates HTTP/2 and the pairing is uncommon.
```

- **No multiplexing.** One connection = one event stream. Need multiple independent channels? Multiple held connections, each burning a slot.
- **Head-of-line blocking.** If the server has events A, B, C while a client is reconnecting, it delivers them all in one batch. Fine for most cases, but ordering and partial delivery need thought.
- **Stateful servers.** The server needs to know "what has this client already seen" — typically via a cursor/offset in the request (`?since=42`). Stateless servers need an external store for pending events.

## Related

- [[server_sent_events]] — the protocol-native upgrade: persistent one-way stream with built-in reconnection.
- [[websocket_protocol]] — when you also need client-to-server streaming.
- [[realtime_patterns_comparison]] — decision guide across all four approaches.

---

## References

- MDN: [Server-sent events as alternative](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- RFC 6202: [Known Issues and Best Practices for the Use of Long Polling](https://datatracker.ietf.org/doc/html/rfc6202)

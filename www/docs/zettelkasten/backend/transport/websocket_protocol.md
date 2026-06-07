🗓️ 06062026 1500
📎 #api #realtime #protocols

# websocket_protocol

> A persistent, full-duplex communication channel over a single TCP connection. Both client and server can send messages at any time without waiting for the other. Starts as HTTP, then upgrades.

## The Upgrade Handshake

WebSocket piggybacks on HTTP to get through firewalls and proxies, then switches protocol:

```
Client                                    Server
  │                                         │
  ├── GET / HTTP/1.1                       │
  │   Upgrade: websocket                   │
  │   Connection: Upgrade                  │
  │   Sec-WebSocket-Key: dGhlIHN...        │
  │   Sec-WebSocket-Version: 13           ──>
  │                                         │
  │<── HTTP/1.1 101 Switching Protocols    │
  │    Upgrade: websocket                  │
  │    Connection: Upgrade                 │
  │    Sec-WebSocket-Accept: s3pP...       ─┤
  │                                         │
  │<========= WebSocket frames ==========>│
  │         (full-duplex from here)         │
```

`Sec-WebSocket-Key` is a random Base64 nonce. Server concatenates it with a magic GUID, SHA-1 hashes, Base64-encodes → `Sec-WebSocket-Accept`. This proves the server understands WebSocket, not just any HTTP server reflecting headers.

## Frame Types

After upgrade, communication is via **frames**, not HTTP requests:

| Opcode | Type | Purpose |
|--------|------|---------|
| `0x1` | Text | UTF-8 text message |
| `0x2` | Binary | Raw bytes (images, protobuf, etc.) |
| `0x8` | Close | Initiate graceful shutdown (status code + reason) |
| `0x9` | Ping | Heartbeat probe (server or client) |
| `0xA` | Pong | Response to ping |

Messages can be **fragmented** across multiple frames for streaming large payloads without buffering the whole thing in memory.

Client-to-server frames are always **masked** (XOR with a 4-byte key) — prevents cache poisoning attacks on intermediary proxies. Server-to-client frames are unmasked.

## Connection Lifecycle

```
[HTTP Handshake] → [Open] → [Messages ↔] → [Close Handshake] → [Closed]
                                                  │
                                            (close frame sent,
                                             wait for close frame back)
```

**Ping/pong** keeps the connection alive through idle-timeout proxies and detects dead peers. Either side can send a ping; the other must respond with a pong containing the same payload.

## Subprotocols

The `Sec-WebSocket-Protocol` header negotiates an application-level protocol on top of WebSocket:

```
Client: Sec-WebSocket-Protocol: graphql-ws, json
Server: Sec-WebSocket-Protocol: graphql-ws
```

Common subprotocols: `graphql-ws`, `wamp`, `stomp`, `mqtt`. The WebSocket spec defines the framing; the subprotocol defines message semantics.

## Browser API

```javascript
const ws = new WebSocket('wss://example.com/ws');

ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe', channel: 'prices' }));
ws.onmessage = (e) => console.log(JSON.parse(e.data));
ws.onclose = (e) => console.log(`closed: ${e.code} ${e.reason}`);
ws.onerror = (e) => console.error('ws error', e);
```

**No built-in reconnection.** Unlike [[server_sent_events]], you must implement reconnect logic yourself (backoff, jitter, re-subscribe).

## When to Use

- **Bidirectional streaming.** Chat, multiplayer games, collaborative editing, trading terminals.
- **Low-latency.** No HTTP overhead per message after the handshake. One TCP connection, minimal framing.
- **Binary data.** Native binary frames — protobuf, MessagePack, images — no Base64 encoding tax.
- **High-frequency messages.** Sub-100ms intervals where HTTP request overhead matters.

## Common Pitfalls

```ad-warning
**Load balancer configuration.** WebSocket connections are long-lived and stateful. Round-robin LBs break if a reconnect lands on a different backend. Solutions: sticky sessions (cookie/IP hash), or a pub/sub backbone (Redis, Kafka) so any backend can serve any client.
```

```ad-warning
**No built-in reconnection.** Connection drops silently on network changes (WiFi → cellular). Implement heartbeat + reconnect with exponential backoff. Libraries like `reconnecting-websocket` (JS) handle this.
```

- **Proxy/firewall issues.** Some corporate proxies block the `Upgrade` header or don't understand WebSocket. `wss://` (TLS) usually gets through because proxies can't inspect the upgrade inside the encrypted tunnel.
- **No HTTP caching or compression.** Each message is independent — no `ETag`, no `gzip` content-encoding. Compress at the application layer (permessage-deflate extension exists but has CPU cost and mixed support).
- **Resource exhaustion.** Each connection is a persistent socket. 100k concurrent users = 100k sockets. Monitor `file descriptor` limits, tune OS `ulimit`, and use non-blocking I/O.
- **Security.** `Origin` header validation is critical — WebSocket doesn't enforce same-origin policy. Without it, any page can open a connection to your server.

## Server Frameworks

| Language | Library/Framework |
|---|---|
| Java | Spring WebSocket (`@ServerEndpoint`), Netty |
| Node.js | `ws`, Socket.IO (adds fallback + rooms) |
| Go | `gorilla/websocket`, `nhooyr.io/websocket` |
| Python | `websockets`, FastAPI WebSocket |

## Related

- [[server_sent_events]] — simpler alternative when only server→client push is needed.
- [[long_polling]] — fallback when WebSocket is blocked.
- [[realtime_patterns_comparison]] — decision guide across all approaches.
- [[load_balancer]] — sticky sessions for WebSocket connections.

---

## References

- [RFC 6455 — The WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)
- [MDN: WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [MDN: Writing WebSocket servers](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers)

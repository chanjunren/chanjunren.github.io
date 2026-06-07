🗓️ 06062026 1500
📎 #api #realtime #protocols

# server_sent_events

> A browser-native protocol for one-way server push over a persistent HTTP connection. The server streams `text/event-stream` lines; the browser reconnects automatically if the connection drops.

## Wire Format

An SSE response is `Content-Type: text/event-stream` — a stream of newline-delimited fields:

```
event: price-update
data: {"symbol": "BTC", "price": 67421.50}
id: 1042
retry: 3000

event: price-update
data: {"symbol": "ETH", "price": 3891.20}
id: 1043

```

| Field | Purpose |
|---|---|
| `data:` | Payload. Multiple `data:` lines concatenate with `\n`. |
| `event:` | Event type. Client listens with `addEventListener(type)`. Omit → fires generic `message` event. |
| `id:` | Last-event ID. Sent back on reconnect via `Last-Event-ID` header. |
| `retry:` | Reconnection delay in ms. Browser default is typically 3000ms. |

Each event ends with a blank line (`\n\n`). Lines starting with `:` are comments (useful as keep-alive heartbeats).

```
: heartbeat
```

## Browser API

```javascript
const source = new EventSource('/events');

source.addEventListener('price-update', (e) => {
  const data = JSON.parse(e.data);
  // e.lastEventId available
});

source.onerror = (e) => {
  // browser auto-reconnects; this fires on each disconnect
  if (source.readyState === EventSource.CLOSED) {
    // server sent HTTP error or explicitly closed
  }
};
```

Three ready states: `CONNECTING (0)`, `OPEN (1)`, `CLOSED (2)`.

## Automatic Reconnection

The killer feature over [[long_polling]]. When the connection drops:

1. Browser waits `retry` ms (default ~3s).
2. Reconnects to the same URL.
3. Sends `Last-Event-ID: <last id received>` header.
4. Server resumes from that point — no missed events if the server stores them.

No client-side reconnection logic needed. The browser handles it.

## Scalability

**HTTP/1.1 limitation.** Browsers open at most ~6 connections per domain. An SSE stream permanently occupies one. Two SSE connections + other fetches = contention.

**HTTP/2 solves this.** Multiplexed streams share one TCP connection. 100 SSE streams cost one connection. This is the modern deployment target — always serve SSE over HTTP/2.

**Server resource model.** Like [[long_polling]], each client holds an open connection. Non-blocking servers (Netty, Node.js, Go) handle thousands cheaply. Thread-per-request servers need async adapters (Spring WebFlux `Flux<ServerSentEvent>`, Servlet 3.1 async).

## When to Use

- **Server → client only.** Live feeds, notifications, dashboards, progress bars, log tailing.
- **Text data.** SSE is text-only (UTF-8). Binary needs Base64 encoding (overhead).
- **Built-in resilience matters.** Auto-reconnect + Last-Event-ID = resumable streams for free.
- **HTTP infrastructure.** Works through standard proxies, CDNs, load balancers — no protocol upgrade.

## Limitations

- **One-way.** Client can't send data over the SSE connection. Use regular `POST`/`PUT` for client→server messages (which is often fine — most apps have asymmetric traffic).
- **No binary.** Unlike [[websocket_protocol]], no native binary frames.
- **`EventSource` API is limited.** Can't set custom headers (e.g., `Authorization: Bearer ...`). Workarounds:
  - Pass tokens as query params (leaks in logs — use short-lived tokens).
  - Use `fetch()` with `ReadableStream` instead of `EventSource` — full header control, but you lose auto-reconnect and must implement it yourself.
- **No IE support.** Needs polyfill for IE11. All modern browsers support it natively.

## Spring Boot Example

```java
@GetMapping(path = "/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<ServerSentEvent<String>> stream() {
    return Flux.interval(Duration.ofSeconds(1))
        .map(seq -> ServerSentEvent.<String>builder()
            .id(String.valueOf(seq))
            .event("tick")
            .data("{\"seq\":" + seq + "}")
            .build());
}
```

## Related

- [[long_polling]] — the predecessor. SSE replaces it in most cases.
- [[websocket_protocol]] — when bidirectional streaming is needed.
- [[realtime_patterns_comparison]] — decision guide across all approaches.
- [[mcp_transports]] — MCP's Streamable HTTP transport uses SSE for server→client streaming.

---

## References

- [SSE Spec (WHATWG)](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [MDN: Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [MDN: EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)

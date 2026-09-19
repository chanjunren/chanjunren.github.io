🗓️ 19092026 1003

# server_sent_events

> **Server-Sent Events (SSE)** keeps an HTTP response open so a server can send a sequence of text events to a client.

## What problem does it solve?

Polling makes a client repeatedly ask whether anything has changed. SSE lets the server push updates as they become available, without requiring a new request for every update.

It is designed for one-way communication:

```text
client -- opens HTTP request --> server
client <-- update 1 -- server
client <-- update 2 -- server
client <-- update 3 -- server
```

The response uses the `text/event-stream` content type. An event can carry text or JSON, but SSE does not define the application's data model.

## Where it fits

SSE is a natural choice for:

- notifications and live feeds;
- dashboards and log streams;
- job progress;
- incremental assistant responses.

The client can still send commands through ordinary HTTP requests. This makes SSE useful when traffic is asymmetric: occasional client actions, but frequent server updates.

## Tradeoffs

SSE is simpler than a bidirectional socket because it stays within ordinary HTTP and provides a browser-native client API. The browser can reconnect when the connection drops.

The costs are equally important:

- the connection stays open and consumes server and proxy resources;
- the stream is text-only and server-to-client;
- authentication and custom request headers can be awkward with native `EventSource`;
- reliable replay, cancellation, buffering, and backpressure remain application concerns.

Reconnection is not the same as guaranteed delivery. If an application needs to resume missed updates, it must retain enough history and define how a client catches up.

Choose [[websocket_protocol]] when both sides need a continuous bidirectional channel or binary frames. Choose polling or [[long_polling]] when updates are infrequent or long-lived connections are difficult to operate.

## SSE, AI chat, and MCP

These concepts sit at different levels:

- **AI chat streaming** is the user-visible behavior of displaying partial model output.
- **SSE** is one HTTP mechanism for sending a sequence of server events.
- **MCP Streamable HTTP** is a JSON-RPC transport that may use SSE for streamed responses or long-lived change notifications.

So an AI chat API may use SSE without being MCP. An MCP server may use Streamable HTTP without keeping a permanent SSE connection open. [[mcp_transports]] explains that boundary.

---
## References
- [[long_polling]]
- [[websocket_protocol]]
- [[realtime_patterns_comparison]]
- [[mcp_transports]]
- [Server-Sent Events — WHATWG HTML Standard](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [Using server-sent events — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [MCP Transports — official specification](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)

🗓️ 23052026 2200

# mcp_transports

> Two ways to move JSON-RPC messages between client and server — local subprocess or remote HTTP

## stdio

Client launches the server as a **subprocess**. Messages flow over stdin/stdout.

- Newline-delimited JSON-RPC messages (no embedded newlines)
- Server writes logs to stderr (optional — client may capture or ignore)
- No network overhead, no auth needed
- Single client per server instance

```
Client ──stdin──> Server Process
Client <──stdout── Server Process
Client <──stderr── (optional logs)
```

Best for: local dev, CLI tools, single-user setups.

## Streamable HTTP

Server runs as an **independent HTTP service**. Supports multiple concurrent clients.

Single endpoint (e.g., `https://example.com/mcp`) handles both POST and GET:

### Client → Server (POST)

Every JSON-RPC message from client is a separate HTTP POST. Server responds with either:
- `application/json` — single JSON-RPC response, or
- `text/event-stream` — SSE stream that may include notifications/requests before the final response

### Server → Client (GET)

Client opens an SSE stream via GET to receive server-initiated messages (requests, notifications) outside of any POST exchange.

### Session management

- Server may assign `Mcp-Session-Id` in the initialization response
- Client includes this header on all subsequent requests
- Server returns 404 for expired sessions → client must re-initialize
- Client sends DELETE to explicitly end a session

### Resumability

Servers can attach `id` fields to SSE events. If a connection drops, the client reconnects with `Last-Event-ID` header and the server replays missed messages for that stream.

### Security

- Servers **must** validate `Origin` header (prevents DNS rebinding)
- Local servers should bind to `127.0.0.1`, not `0.0.0.0`
- Auth via bearer tokens on every request. See [[mcp_authorization]]

## When to use which

| Factor | stdio | Streamable HTTP |
|---|---|---|
| Deployment | Local, same machine | Remote, shared |
| Clients | Single | Multiple concurrent |
| Auth | From environment | OAuth / bearer tokens |
| Complexity | Minimal | Session management, SSE |
| Debugging | Easy (subprocess logs) | Needs request tracing |

Start with stdio. Move to HTTP when you need remote access or multi-user support.

## Backward compatibility

Streamable HTTP replaces the older HTTP+SSE transport (protocol version 2024-11-05). Servers wanting to support old clients can host both the legacy SSE/POST endpoints alongside the new MCP endpoint.

---
## References
- [[mcp_architecture]]
- [[model_context_protocol]]
- [[mcp_authorization]]
- [MCP Transports — Official Docs](https://modelcontextprotocol.io/docs/concepts/transports)

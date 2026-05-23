🗓️ 23052026 2200

# mcp_architecture

> Three roles, two layers, one handshake — how MCP participants connect and negotiate capabilities

## Participants

**MCP host** creates one or more MCP clients. Each client maintains a dedicated connection to one MCP server.

```
┌─────────────────────────────────────┐
│         MCP Host (AI app)           │
│  ┌──────────┐  ┌──────────┐        │
│  │ Client 1 │  │ Client 2 │  ...   │
│  └────┬─────┘  └────┬─────┘        │
└───────┼──────────────┼──────────────┘
        │              │
  ┌─────▼─────┐  ┌─────▼─────┐
  │  Server A │  │  Server B │
  │  (local)  │  │  (remote) │
  └───────────┘  └───────────┘
```

| Role | Responsibility | Example |
|---|---|---|
| **Host** | Coordinates clients, runs the AI model | Claude Code, VS Code, claude.ai |
| **Client** | Maintains 1:1 connection to a server, fetches context for the host | SDK-managed — one per server |
| **Server** | Exposes tools, resources, prompts over the protocol | Filesystem server, Sentry MCP, Postgres MCP |

Local servers (stdio) typically serve one client. Remote servers (Streamable HTTP) serve many.

## Two layers

| Layer | What it handles |
|---|---|
| **Data** (inner) | JSON-RPC 2.0 messages — lifecycle, primitives, notifications |
| **Transport** (outer) | Communication channel — stdio or Streamable HTTP. See [[mcp_transports]] |

The data layer is transport-agnostic. Same JSON-RPC messages work over either transport.

## Connection lifecycle

Four phases, always in order:

### Initialization

Client and server exchange capabilities in a handshake:

1. Client sends `initialize` with its `protocolVersion` and supported capabilities
2. Server responds with its own `protocolVersion` and capabilities
3. Client sends `notifications/initialized` to confirm

```json
// Client declares it supports elicitation
{ "capabilities": { "elicitation": {} } }

// Server declares it supports tools (with change notifications) and resources
{ "capabilities": { "tools": { "listChanged": true }, "resources": {} } }
```

This negotiation determines what each side can ask of the other for the rest of the session.

### Operation

Normal message exchange. Client discovers and calls tools, reads resources, retrieves prompts. Server sends notifications when things change.

### Shutdown

Either side can terminate. Client closes the connection; server cleans up.

## Primitives

What each side exposes after initialization:

### Server primitives

| Primitive | Control | Purpose |
|---|---|---|
| **Tools** | LLM decides when to call | Executable functions — DB queries, API calls, file ops |
| **Resources** | App decides when to read | Context data — files, schemas, records. See [[mcp_resources]] |
| **Prompts** | User selects which | Reusable message templates. See [[mcp_prompts]] |

### Client primitives

| Primitive | Purpose |
|---|---|
| **Sampling** | Server requests LLM completions from the host. See [[mcp_sampling]] |
| **Elicitation** | Server asks the user for input or confirmation |
| **Logging** | Server sends log messages to the client |

### Discovery pattern

All primitives follow the same discovery pattern: `*/list` to discover, then `*/get` or `*/call` to use. Servers send `notifications/*/list_changed` when available items change.

## Roots

**Roots** define filesystem boundaries the client exposes to the server — which directories and files the server can access.

- Client sends `roots/list` so the server knows its workspace scope
- Roots can update dynamically via `notifications/roots/list_changed`
- Informational, not enforced — servers should respect them but the protocol doesn't block access outside roots

---
## References
- [[model_context_protocol]]
- [[mcp_transports]]
- [MCP Architecture — Official Docs](https://modelcontextprotocol.io/docs/concepts/architecture)
- [MCP Specification — Lifecycle](https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle)

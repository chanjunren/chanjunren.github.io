🗓️ 11102026 1520

# architecture

MCP separates the AI application from capability providers. Each server has a dedicated client inside the application.

```text
host
 ├─ client A <-> server A
 `─ client B <-> server B
```

| Participant | Responsibility |
|---|---|
| **Host** | Model integration, user experience, and permissions |
| **Client** | JSON-RPC messages between host and server |
| **Server** | Tools, resources, prompts, and upstream operations |

## Discovery and requests

In revision `2026-07-28`, each request carries its protocol version and client capabilities in `_meta`; client identity should also be included. Optional `server/discover` retrieves server identity, capabilities, and supported versions.

The client then lists capabilities and sends requests such as `tools/call`. Clients initiate requests; servers return responses and notifications. [[transports]] handles delivery.

Older revisions use an `initialize` handshake. Match the peer's revision rather than mixing lifecycle rules. [[sampling]] explains a deprecated client capability.

## References

- [MCP architecture, 2026-07-28](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture)

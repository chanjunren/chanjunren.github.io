🗓️ 19092026 1003

# mcp_transports

> An MCP transport moves JSON-RPC messages between an MCP client and server. It determines how messages travel, not what MCP operations mean.

## What problem does it solve?

An MCP host needs a reliable boundary between the AI application and a server that provides tools, resources, or prompts. The transport answers practical questions such as:

- Is the server a local subprocess or a network service?
- How are messages framed?
- How are authentication, cancellation, and connection failures handled?

MCP keeps the protocol messages mostly independent of those choices. The two standard transports make different deployment models convenient.

## stdio

With **stdio**, the host launches the MCP server as a subprocess and exchanges newline-delimited JSON-RPC messages over standard input and output. The server writes logs to stderr so stdout remains reserved for protocol messages.

```text
MCP client -> stdin -> server process
MCP client <- stdout <- server process
```

stdio solves the local-integration problem. It is simple to start, easy to isolate to one host, and does not require network authentication.

Its tradeoff is that the server is tied to the host process. Sharing it across applications or deploying it as an independent service requires another boundary.

## Streamable HTTP

**Streamable HTTP** solves the remote-service problem. The MCP server runs independently and exposes one HTTP endpoint.

At a high level:

- The client sends each JSON-RPC request as an HTTP `POST`.
- The server returns either one JSON response or an SSE stream for that request.
- The stream can deliver progress or other request-related notifications before the final response.
- A client can explicitly request a long-lived stream for change notifications.

This is why the name can be confusing. Streamable HTTP is the transport; SSE is one possible response format inside it. See [[server_sent_events]] for the general streaming mechanism.

The current specification is request-oriented. Older revisions had different session and streaming rules, so implementations may still need compatibility handling. Those version details are separate from the core mental model.

## Tradeoffs

|                     | stdio                      | Streamable HTTP                                                             |
| ------------------- | -------------------------- | --------------------------------------------------------------------------- |
| Deployment          | Local subprocess           | Independent service                                                         |
| Strength            | Simple lifecycle and setup | Reachability, sharing, and HTTP infrastructure                              |
| Cost                | Tied to one host           | Authentication, origin checks, proxies, timeouts, and version compatibility |
| Best starting point | Local or single-user tools | Remote or multi-client tools                                                |

Choose the transport based on the operational boundary around the server. The model does not speak either transport directly:

```text
model -> host/runtime -> MCP client -> transport -> MCP server -> external system
```

When the question becomes “How does the model ask for the operation?”, continue to [[llm_tool_use]].

---
## References
- [[mcp_architecture]]
- [[model_context_protocol]]
- [[llm_tool_use]]
- [[mcp_authorization]]
- [[server_sent_events]]
- [MCP Transports — official overview](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)
- [MCP Streamable HTTP — official specification](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http)

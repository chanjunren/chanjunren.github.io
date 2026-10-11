🗓️ 11102026 1520

# mcp_transports

An MCP **transport** moves protocol messages between a client and server. It changes how they connect, not what a tool or resource means.

## Two standard choices

| Transport | Typical boundary | Message delivery |
|---|---|---|
| stdio | Local subprocess | Newline-delimited JSON-RPC over standard streams |
| Streamable HTTP | Remote or shared server | HTTP POST; JSON or request-scoped SSE response |

With stdio, the host launches the server process. Protocol messages use standard input and output; diagnostic logs go to standard error so they cannot corrupt the message stream.

With Streamable HTTP, clients POST messages to one endpoint. A response can be JSON or a request-scoped server-sent event stream. Closing the response stream cancels the in-flight request. Authentication and HTTP security rules apply at this boundary.

## Choose by deployment boundary

Choose stdio for a host-managed local process. Choose Streamable HTTP for a separately deployed service. Remote access adds authentication, origin validation, network failure, timeout, and cancellation concerns. Transport changes message delivery, not protocol meaning.

The model does not speak the transport directly. The host and its MCP client do.

## References

- [[mcp_architecture]]
- [[mcp_authorization]]
- [MCP transports specification, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)
- [MCP security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)

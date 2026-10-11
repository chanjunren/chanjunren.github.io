🗓️ 11102026 1520

# transports

An MCP **transport** delivers client–server messages. Protocol meaning stays the same across transports.

## Two standard choices

| Transport | Typical boundary | Message delivery |
|---|---|---|
| stdio | Local subprocess | Newline-delimited JSON-RPC over standard streams |
| Streamable HTTP | Remote or shared server | HTTP POST; JSON or request-scoped SSE response |

Use stdio for a local process launched by the client. Send logs to standard error; standard output is reserved for protocol messages.

Use Streamable HTTP for a separate service. SSE means **server-sent events**; closing its response stream cancels the request in revision `2026-07-28`. For protected servers, see [[authorization]]. Secure remote connections.

## References

- [MCP transports specification, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)
- [Streamable HTTP](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http)

🗓️ 19092026 2037

# mcp_transports

An MCP **transport** moves protocol messages between a client and server. It changes how they connect, not what a tool or resource means.

## Two standard choices

| Transport | Best for | Mental model |
|---|---|---|
| Standard input/output | Local, single-user tools | Host starts the server as a subprocess |
| Streamable HTTP | Remote or shared services | Server runs independently behind an HTTP endpoint |

With standard input/output, protocol messages use the server's input and output streams. Logs belong on the error stream so they do not corrupt protocol messages.

With Streamable HTTP, clients send requests to one HTTP endpoint. The response can be ordinary JSON or an event stream when the server needs to send more than one message.

## Choose by deployment boundary

Choose standard input/output when the server belongs on the same machine as the host. Choose Streamable HTTP when several hosts need a reachable service. Remote servers add operational work: authentication, origin checks, network failures, and timeouts.

The model does not speak the transport directly. The host and its MCP client do.

## References

- [[mcp_architecture]]
- [[mcp_authorization]]
- [MCP transports specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)

🗓️ 11102026 1520

# mcp_architecture

MCP separates the AI application from capability providers. A **host** creates an MCP **client** for each MCP **server** it uses; the client carries protocol messages and results between the host and server.

```text
host
 ├─ client A <-> server A
 `─ client B <-> server B
```

The host owns the user experience, model integration, and policy. An MCP client speaks JSON-RPC over a transport. The server provides tools, resources, or prompts and may call external systems to fulfill them.

## What happens on a connection

- Client sends protocol version and client capabilities in request metadata.
- Client may call `server/discover` before other requests.
- Client lists tools, resources, or prompts as needed.
- Host chooses context and whether a tool request may run.
- Client sends `tools/call`; server returns structured content or an error.

The current revision is request-oriented: protocol version, client identity, and client capabilities travel in each request’s `_meta`, rather than depending on one connection-scoped initialization handshake. `server/discover` lets clients learn server identity, capabilities, and supported versions; clients can also make a request directly and handle a version error. Servers return responses and notifications; clients initiate requests. Older revisions use `initialize` and session behavior, so interoperability requires version-aware compatibility.

## Server and client capabilities

Servers provide tools, resources, and prompts. Current client-side elicitation lets a server request more user input. Sampling and client logging are deprecated in revision `2026-07-28`; new designs should not depend on them.

For message delivery and cancellation, see [[mcp_transports]]. For remote credentials, see [[mcp_authorization]]. Follow [connector registration](connector_registration_flow.md) and [tool invocation](tool_invocation_flow.md) to see how a host uses those protocol pieces.

## References

- [MCP overview](index.md)
- [[mcp_transports]]
- [MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture)
- [Current specification and compatibility](https://modelcontextprotocol.io/specification/latest)

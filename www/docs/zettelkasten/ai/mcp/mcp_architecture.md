🗓️ 19092026 2037

# mcp_architecture

MCP separates the AI application from capability providers. A **host** creates an MCP **client** for each MCP **server** it wants to use.

```text
host
 ├─ client A <-> server A
 `─ client B <-> server B
```

The host owns the user experience and model integration. Each client maintains one connection. Servers provide capabilities over that connection.

## What happens on a connection

- Client and server initialize and announce supported capabilities.
- Client discovers available tools, resources, or prompts.
- Client calls a tool or reads data when the host decides it is appropriate.
- Either side closes the connection when work ends.

The initialization step lets both sides avoid using features the other side does not support.

## Server and client capabilities

Servers commonly provide tools, resources, and prompts. Clients can also offer services back to servers, such as asking the user for information or requesting a model completion. These are advanced cases; most integrations only need server tools.

For local versus remote connections, see [[mcp_transports]]. For the basic concepts, see the [MCP overview](index.md).

## References

- [MCP overview](index.md)
- [[mcp_transports]]
- [MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture)

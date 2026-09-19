🗓️ 19092026 2037

# mcp_authorization

Remote MCP servers may need to act on a user's behalf. MCP defines an OAuth-based authorization flow for HTTP transports so a client can obtain a limited access token for a specific server.

## Mental model

```text
client discovers server's authorization service -> user grants access -> client receives scoped token -> client calls MCP server
```

The MCP server is the protected resource. The authorization server issues the token. The MCP client represents the user when it calls the MCP server.

## What it protects

Authorization controls access to the MCP server. It does not replace the server's own checks on each tool call. A server should still apply least privilege, validate inputs, and avoid passing its received token to unrelated upstream services.

This flow is optional and applies to HTTP-based transports. Local standard-input/output servers normally obtain credentials through their local environment instead.

## What to remember

- Remote access needs identity and narrowly scoped permission.
- The protocol standardizes how clients discover and complete that process.
- A standard authorization flow does not make a broad token safe.

## References

- [[mcp_transports]]
- [MCP overview](index.md)
- [MCP authorization specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)

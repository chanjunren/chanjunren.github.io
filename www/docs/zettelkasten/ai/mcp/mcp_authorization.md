🗓️ 11102026 1520

# mcp_authorization

MCP authorization protects HTTP-based access to a remote server. A client obtains a token for that server and sends it on requests; the server validates the token before processing them.

## Mental model

```text
client discovers authorization metadata -> user authorizes requested access -> client gets a server-specific token -> client calls MCP server
```

The MCP server is the protected resource. The authorization server issues a token for that resource. The MCP client presents it to the server. The current specification uses OAuth 2.1-based flows and protected-resource metadata for discovery.

## What it protects

Authorization controls access to the MCP endpoint; it does not decide which application user may invoke a particular tool or record business permissions. The host and server still need per-operation policy and input validation. Bind tokens to the intended server, validate audience and scope, and never forward an MCP token to an unrelated upstream service.

Authorization is optional in MCP. HTTP-based implementations that support it should follow the specification. stdio servers normally receive credentials from their local environment instead. Authentication alone does not supply human approval for a risky operation.

## What to remember

- Request only the scopes needed for the operation.
- Send bearer tokens in authorization headers, never URLs.
- Validate token audience and permissions at the server.
- Reauthorize each tool operation under application policy.

## References

- [[mcp_transports]]
- [MCP overview](index.md)
- [MCP authorization specification, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- [MCP security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)

🗓️ 11102026 1520

# authorization

MCP authorization lets a client access a protected HTTP server using a token issued for that server.

## Token flow

```text
discover authorization metadata → obtain user authorization → receive token → call MCP server
```

The authorization server issues the token; the MCP server validates it. The specification uses OAuth 2.1-based flows. Authorization is optional; stdio normally receives credentials from its environment.

## Token checks

- Send bearer tokens in headers, never URLs.
- Validate audience: the intended server.
- Validate scopes: the granted permissions.
- Never forward MCP tokens to unrelated upstream services.

Tokens grant access, not human approval. Apply business permissions and confirmation rules during [[tool_invocation_flow]].

## References

- [MCP authorization specification, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)

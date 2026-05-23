🗓️ 23052026 2200

# mcp_authorization

> OAuth 2.1-based auth for remote MCP servers — optional, HTTP-only, with dynamic client registration

## When auth applies

- **HTTP transport** — follows this spec (OAuth 2.1)
- **stdio transport** — retrieves credentials from the environment instead (env vars, config files)
- Auth is **optional**. Many MCP servers (especially local ones) don't need it.

## Roles

| Role | Maps to | Example |
|---|---|---|
| **MCP server** | OAuth resource server | Remote Postgres MCP, Sentry MCP |
| **MCP client** | OAuth client | Claude Code, VS Code |
| **Authorization server** | Issues access tokens | May be co-located with MCP server or separate |

## Discovery flow

How the client finds the authorization server:

1. Client sends request **without token**
2. Server returns `401 Unauthorized` with `WWW-Authenticate` header pointing to resource metadata
3. Client fetches `/.well-known/oauth-protected-resource` from MCP server → gets authorization server URL
4. Client fetches `/.well-known/oauth-authorization-server` → gets OAuth endpoints and capabilities
5. Client proceeds with OAuth flow

```
Client ──request──> MCP Server
Client <──401 + WWW-Authenticate──
Client ──GET protected-resource-metadata──> MCP Server
Client <──authorization server URL──
Client ──GET oauth-authorization-server──> Auth Server
Client <──OAuth endpoints──
```

## Dynamic client registration

MCP clients and auth servers **should** support [RFC 7591](https://datatracker.ietf.org/doc/html/rfc7591) — automatic registration without user interaction. This matters because:

- Clients can't know all possible MCP servers in advance
- Manual registration creates friction
- Auth servers control their own registration policies

Fallback: hardcoded client ID, or user-provided credentials via a configuration UI.

## Authorization flow

Standard OAuth 2.1 with PKCE:

1. Client generates PKCE code verifier + challenge
2. Opens browser with authorization URL (includes `code_challenge` and `resource` parameter)
3. User authorizes in browser
4. Auth server redirects back with authorization code
5. Client exchanges code + `code_verifier` for access token (+ optional refresh token)
6. Client includes `Authorization: Bearer <token>` on every HTTP request to MCP server

### Resource parameter

Clients **must** include the `resource` parameter ([RFC 8707](https://www.rfc-editor.org/rfc/rfc8707.html)) in authorization and token requests — binds the token to the specific MCP server. Prevents token reuse across services.

## Token handling

- Bearer token in `Authorization` header on **every** HTTP request (even within same session)
- Never in query strings
- Server validates token was issued specifically for it (audience check)
- Server **must not** pass through tokens to upstream APIs — use separate tokens for upstream calls

## Security requirements

| Requirement | Why |
|---|---|
| **PKCE** mandatory | Prevents authorization code interception |
| **HTTPS** for all auth endpoints | Communication security |
| **Short-lived access tokens** | Limits impact of token theft |
| **Refresh token rotation** (public clients) | Prevents refresh token reuse |
| **Audience validation** | Stops tokens from being used at wrong server |
| **Redirect URI validation** | Prevents open redirection attacks |
| **No token passthrough** | Prevents confused deputy — server must use its own tokens for upstream calls |

---
## References
- [[mcp_transports]]
- [[mcp_architecture]]
- [MCP Authorization — Specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)
- [OAuth 2.1 Draft](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-13)

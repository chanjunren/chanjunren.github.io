🗓️ 23052026 2200

# mcp_resources

> App-controlled context data — files, schemas, records — that servers expose for AI applications to read

## What resources are

**Resources** let MCP servers share data that provides context to language models. Unlike tools (LLM-controlled) or prompts (user-controlled), resources are **app-controlled** — the host application decides when and how to incorporate them.

Each resource has a unique URI and can contain text or binary data.

## How apps surface resources

The protocol doesn't mandate UI. Apps can:
- Show a tree/list view for explicit selection
- Let users search and filter resources
- Auto-include based on heuristics or model selection

## Protocol methods

### Discovery

`resources/list` returns available resources. Supports pagination.

```json
{
  "resources": [
    {
      "uri": "file:///project/src/main.rs",
      "name": "main.rs",
      "description": "Primary application entry point",
      "mimeType": "text/x-rust"
    }
  ]
}
```

### Reading

`resources/read` fetches content by URI. Returns text or base64-encoded binary.

```json
// Text content
{ "uri": "file:///example.txt", "mimeType": "text/plain", "text": "File contents" }

// Binary content
{ "uri": "file:///image.png", "mimeType": "image/png", "blob": "base64-encoded-data" }
```

### Templates

`resources/templates/list` returns parameterized URI templates ([RFC 6570](https://datatracker.ietf.org/doc/html/rfc6570)):

```json
{
  "uriTemplate": "file:///{path}",
  "name": "Project Files",
  "description": "Access files in the project directory"
}
```

Arguments can auto-complete via the completion API.

## Subscriptions and notifications

Two change mechanisms, both optional:

| Mechanism | Capability flag | What it does |
|---|---|---|
| **List changed** | `listChanged: true` | Server notifies when the set of available resources changes |
| **Subscribe** | `subscribe: true` | Client subscribes to a specific resource; server notifies on content change |

Flow: client subscribes → server sends `notifications/resources/updated` → client re-reads.

## URI schemes

| Scheme | Use |
|---|---|
| `https://` | Web-accessible resource the client can fetch directly |
| `file://` | Filesystem-like resource (doesn't need to map to actual files) |
| `git://` | Git version control integration |
| Custom | Any [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986)-compliant scheme |

## Annotations

Resources support optional metadata hints:

- **`audience`** — `["user"]`, `["assistant"]`, or both. Who the content is for.
- **`priority`** — 0.0 to 1.0. Higher = more important to include in context.
- **`lastModified`** — ISO 8601 timestamp.

---
## References
- [[model_context_protocol]]
- [[mcp_architecture]]
- [MCP Resources — Official Docs](https://modelcontextprotocol.io/docs/concepts/resources)

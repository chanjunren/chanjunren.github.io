🗓️ 21032026 2100

# custom_mcp_servers

> Building your own MCP servers to expose internal tools, databases, and APIs to AI applications

## When to Build a Custom Server

- You have **internal APIs or databases** that no public MCP server covers
- You want to give AI agents **controlled access** to private systems (CI/CD, internal dashboards, proprietary data)
- You need **custom business logic** in how tools are exposed (e.g., row-level access control on queries)

## SDK Setup

| Language | Package | Install |
|---|---|---|
| **TypeScript** | `@modelcontextprotocol/sdk` | `npm install @modelcontextprotocol/sdk` |
| **Python** | `mcp` | `pip install mcp` |

## Defining Tools

Tools are the most common primitive to implement. Each tool needs:

| Field | Purpose | Example |
|---|---|---|
| `name` | Unique identifier | `"query_database"` |
| `description` | Tells the LLM when/how to use it | `"Run a read-only SQL query against the analytics DB"` |
| `inputSchema` | JSON Schema defining parameters | `{ "type": "object", "properties": { "sql": { "type": "string" } } }` |

**TypeScript example:**

```typescript
server.tool(
  "query_database",
  "Run a read-only SQL query against the analytics DB",
  { sql: z.string().describe("The SQL query to execute") },
  async ({ sql }) => {
    const results = await db.query(sql);
    return { content: [{ type: "text", text: JSON.stringify(results) }] };
  }
);
```

## Defining Resources

Resources expose data the client can read on demand.

| Type | URI Pattern | Example |
|---|---|---|
| **Static** | Fixed URI | `config://app-settings` |
| **Dynamic** | URI template with parameters | `db://users/{user_id}` |
| **List-based** | Server provides a list clients can browse | File listings, table names |

## Transport Options

| Transport | When to Use | Setup |
|---|---|---|
| **stdio** | Local dev, single-user, CLI tools | Server reads stdin / writes stdout |
| **Streamable HTTP** | Remote deployment, multi-user, shared services | Server exposes HTTP endpoint with optional SSE |

Start with **stdio** for prototyping — it's simpler to debug. Move to HTTP when you need remote access or shared deployment.

## Example Use Cases

| Use Case | Tools Exposed | Why Custom? |
|---|---|---|
| **Database access** | `query`, `describe_table`, `list_tables` | Row-level security, read-only enforcement |
| **Internal APIs** | `get_user`, `create_ticket`, `fetch_metrics` | Auth handling, rate limiting, schema translation |
| **CI/CD pipelines** | `trigger_build`, `get_build_status`, `list_deployments` | Internal Jenkins/GitHub Actions integration |
| **Document search** | `search_docs`, `get_document` | Proprietary search index, access control |

---
## References
- [[model_context_protocol]]
- [[llm_tool_use]]
- [MCP Quickstart — Building a Server (TypeScript)](https://modelcontextprotocol.io/quickstart/server)
- [MCP Quickstart — Building a Server (Python)](https://modelcontextprotocol.io/quickstart/server)
- [MCP TypeScript SDK (GitHub)](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Python SDK (GitHub)](https://github.com/modelcontextprotocol/python-sdk)

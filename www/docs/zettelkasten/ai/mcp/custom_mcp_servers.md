🗓️ 21032026 2100

# custom_mcp_servers

> Build your own MCP server when no public one covers your internal tools, databases, or APIs

## When to build one

- An **internal system** (database, API, dashboard) that no public MCP server exposes
- You need **custom access control** — row-level security, read-only enforcement, per-user scoping
- You want the same tools available in Claude Code, claude.ai, and your own agents

## End-to-end example: zettelkasten search

A server that lets Claude search 484 markdown notes:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({ name: "zettelkasten", version: "1.0.0" });

server.tool(
  "search_notes",
  "Search zettelkasten notes by keyword. Returns matching titles and snippets.",
  { query: z.string(), category: z.string().optional() },
  async ({ query, category }) => {
    const results = searchIndex(query, category);  // your search logic
    return { content: [{ type: "text", text: JSON.stringify(results) }] };
  }
);

server.tool(
  "get_note",
  "Read the full content of a specific note by path.",
  { path: z.string() },
  async ({ path }) => {
    const content = await readFile(`docs/zettelkasten/${path}`);
    return { content: [{ type: "text", text: content }] };
  }
);
```

Register in Claude Code `settings.json`, restart. Claude Code now searches your notes when relevant.

## SDK setup

| Language | Package | Install |
|---|---|---|
| **TypeScript** | `@modelcontextprotocol/sdk` | `npm install @modelcontextprotocol/sdk` |
| **Python** | `mcp` | `pip install mcp` |

## Tool definition

Each tool needs three things:

| Field | What it does | Good example | Bad example |
|---|---|---|---|
| `name` | Unique ID | `query_database` | `tool1` |
| `description` | Tells the LLM **when** to call it | "Run read-only SQL against analytics DB" | "Database tool" |
| `inputSchema` | JSON Schema for parameters | `{ sql: z.string() }` | no schema |

The description matters most. The LLM uses it to decide when your tool is relevant. Vague descriptions = missed or wrong calls.

Servers can also expose resources (read-only data) and prompts (message templates). See [[mcp_resources]] and [[mcp_prompts]]. For transport options (stdio vs HTTP), see [[mcp_transports]].

## Common use cases

| System | Tools you'd expose | Why custom? |
|---|---|---|
| **Postgres/Supabase** | `query`, `describe_table`, `list_tables` | Read-only enforcement, client isolation |
| **Internal REST APIs** | `get_user`, `create_ticket`, `fetch_metrics` | Auth handling, rate limiting |
| **CI/CD (GitLab, Jenkins)** | `trigger_build`, `get_build_status` | Internal network, custom auth |
| **Markdown docs** | `search_docs`, `get_document` | Private search index, access control |
| **ETL pipelines (Prefect)** | `list_flow_runs`, `get_run_logs` | Prefect API wrapping, status formatting |

---
## References
- [[model_context_protocol]]
- [[llm_tool_use]]
- [[claude_agent_sdk]] — how agents consume MCP tools
- [MCP Quickstart — Building a Server](https://modelcontextprotocol.io/quickstart/server)
- [MCP TypeScript SDK (GitHub)](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Python SDK (GitHub)](https://github.com/modelcontextprotocol/python-sdk)

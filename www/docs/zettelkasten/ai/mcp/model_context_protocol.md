🗓️ 21032026 2100

# model_context_protocol

> Open protocol that lets AI apps connect to external tools and data — one integration, many servers

## What MCP does

**Model Context Protocol (MCP)** standardizes how AI applications talk to tool servers. Instead of writing a custom integration for each tool, you implement one protocol and connect to any MCP server.

**Concrete example**: Claude Code connects to a Postgres MCP server. Now it can run queries, describe tables, and check data freshness — without Anthropic building Postgres support into Claude Code.

```
┌─────────────────────────────────────────────┐
│               MCP Host                      │
│  (Claude Code, claude.ai, your app)         │
│                                             │
│   ┌────────────┐  ┌────────────┐            │
│   │ MCP Client │  │ MCP Client │   ...      │
│   └─────┬──────┘  └─────┬──────┘            │
└─────────┼───────────────┼───────────────────┘
          │               │
    ┌─────▼──────┐  ┌─────▼──────┐
    │ MCP Server │  │ MCP Server │
    │  (GitHub)  │  │ (Postgres) │
    └─────┬──────┘  └─────┬──────┘
          │               │
     Local/Remote    Local/Remote
      Data Source     Data Source
```

- **Host** — the AI app that wants to use external tools (Claude Code, claude.ai, Cursor)
- **Client** — maintains a 1:1 connection with one server
- **Server** — exposes tools, resources, and prompts over the protocol

## Primitives

Each primitive has a different control model — who decides when it's used:

| Primitive | Control | What it does | Deep dive |
|---|---|---|---|
| **Tools** | LLM decides when to call | Executable functions — queries, API calls, file ops | [[llm_tool_use]] |
| **Resources** | App decides when to read | Context data — files, schemas, records | [[mcp_resources]] |
| **Prompts** | User selects which | Reusable message templates (slash commands) | [[mcp_prompts]] |

Servers also benefit from **client primitives**: [[mcp_sampling]] lets servers request LLM completions, and elicitation lets servers ask the user for input.

Tools are the most common. The LLM sees the tool name + description and decides when to call it — discovered dynamically over MCP instead of hardcoded.

## Architecture and transport

Hosts, clients, and servers communicate over JSON-RPC 2.0 in two layers: data (messages, primitives, lifecycle) and transport (stdio or Streamable HTTP). Connections start with a capability negotiation handshake. See [[mcp_architecture]] for the full lifecycle and [[mcp_transports]] for transport details.

## Real examples you already use

- **Atlassian MCP** in Claude Code — searches Jira, reads Confluence, creates issues
- **Lark MCP** — reads/writes Lark docs, sheets, bitable records
- **OKFlow MCP** — authenticates against OKX internal services

These all follow the same protocol. Claude Code doesn't need custom code for each — it connects one MCP client per server.

## How MCP fits with agents

MCP is the **infrastructure layer** for [[llm_tool_use]] at scale. Agents don't hardcode tool definitions — they connect to MCP servers that expose capabilities dynamically. See [[custom_mcp_servers]] for how to build your own, or [[claude_agent_sdk]] for how agents consume MCP tools.

---
## References
- [[mcp_architecture]]
- [[mcp_resources]]
- [[mcp_prompts]]
- [[mcp_sampling]]
- [[mcp_transports]]
- [[mcp_authorization]]
- [[llm_tool_use]]
- [[custom_mcp_servers]]
- [[claude_agent_sdk]]
- [MCP Official Documentation](https://modelcontextprotocol.io/introduction)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Introducing the Model Context Protocol (Anthropic Blog)](https://www.anthropic.com/news/model-context-protocol)
- [MCP TypeScript SDK (GitHub)](https://github.com/modelcontextprotocol/typescript-sdk)

🗓️ 21032026 2100

# model_context_protocol

> A universal open protocol that standardizes how LLM applications connect to external data sources and tools — the "USB-C for AI"

## What Is MCP?

The **Model Context Protocol (MCP)** provides a standardized way for AI applications to connect to external tools, data sources, and services. Instead of building custom integrations for each tool, developers implement one protocol and gain access to a growing ecosystem of MCP servers.

**Analogy**: just as USB-C gives you one port that works with many peripherals, MCP gives your AI application one protocol that works with many tool servers.

## Architecture

```
┌─────────────────────────────────────────────┐
│               MCP Host                      │
│  (Claude Desktop, IDE, AI application)      │
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

- **Host**: the AI application that wants to access external data/tools
- **Client**: maintains a 1:1 connection with a specific server
- **Server**: exposes tools, resources, and prompts via the MCP protocol

## Transport Protocols

| Transport | Use Case | How It Works |
|---|---|---|
| **stdio** | Local servers, CLI tools | Host spawns server as subprocess; communicates via stdin/stdout |
| **Streamable HTTP** | Remote servers, shared deployments | Server exposes HTTP endpoint; supports SSE for streaming |

## Core Primitives

| Primitive | Description | Control | Example |
|---|---|---|---|
| **Tools** | Functions the LLM can invoke | Model-controlled (LLM decides when to call) | `search_files`, `run_query` |
| **Resources** | Data the client can read | Application-controlled (client decides when to fetch) | `file://config.json`, `db://users` |
| **Prompts** | Reusable prompt templates | User-controlled (user selects which to use) | "Summarize this PR", "Explain this error" |

## Relation to Agentic Patterns

MCP acts as the **infrastructure layer** that enables [[llm_tool_use]] at scale. Instead of hardcoding tool definitions per agent, agents connect to MCP servers that expose capabilities dynamically. This is especially powerful for:

- **[[coordinator_router_pattern]]** — coordinator can discover and route to tools across multiple MCP servers
- **[[agent_as_tool_pattern]]** — sub-agents can be exposed as MCP tools themselves

---
## References
- [[llm_tool_use]]
- [[custom_mcp_servers]]
- [[agentic_design_patterns]]
- [MCP Official Documentation](https://modelcontextprotocol.io/introduction)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Introducing the Model Context Protocol (Anthropic Blog)](https://www.anthropic.com/news/model-context-protocol)
- [MCP TypeScript SDK (GitHub)](https://github.com/modelcontextprotocol/typescript-sdk)

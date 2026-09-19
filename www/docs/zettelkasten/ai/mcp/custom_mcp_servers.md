🗓️ 19092026 2037

# custom_mcp_servers

Build an MCP server when an AI application needs a safe, reusable connection to a system that existing servers do not cover.

## Good reasons to build one

- An internal API, database, or document system needs controlled access.
- Existing integrations expose too much access or the wrong workflow.
- Several AI applications need the same capability.

## Start with the smallest capability

Design a server around a few clear tasks. For example, a documentation server might offer a search tool and a read tool. Each tool description should say what it does, what inputs it expects, and important limits.

Keep permissions in the server and underlying system, not in the model prompt. A read-only query tool is safer and easier to reason about than a generic database shell.

## Before building

First check whether an existing server meets the need. Then decide whether the system should be exposed as a tool (perform work), resource (provide context), or prompt (offer a user-selected template). See the [MCP overview](index.md).

## References

- [MCP overview](index.md)
- [[llm_tool_use]]
- [MCP server quickstart](https://modelcontextprotocol.io/docs/develop/build-server)

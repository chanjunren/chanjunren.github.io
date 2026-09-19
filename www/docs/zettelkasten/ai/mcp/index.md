🗓️ 19092026 2037

# mcp

**Model Context Protocol (MCP)** is an open standard that lets AI applications connect to external systems through one common interface. An AI application can use many compatible servers without building a custom integration for each one.

## The big picture

```text
AI application (host) -> MCP client -> MCP server -> external system
```

- The **host** is the AI application.
- A **client** is the host's connection to one server.
- A **server** exposes useful capabilities, such as a database query or a project file.

MCP makes the connection interoperable. The host still decides which servers to connect, which capabilities reach the model, and what actions are allowed.

## What a server can offer

| Capability | Purpose | Who normally chooses it |
|---|---|---|
| Tools | Perform an operation | Model, within host controls |
| Resources | Provide context or data | Host application |
| Prompts | Supply a reusable interaction template | User |

Start with [[llm_tool_use]] to understand tool calls. Continue to [[mcp_architecture]] for how participants communicate, or [[custom_mcp_servers]] if you need to expose an internal system.

## Important boundary

MCP does not make a model autonomous, guarantee that a tool is safe, or grant access to data. Treat every tool call as a request that the application and server must validate.

## References

- [[ai_overview]]
- [[llm_tool_use]]
- [[mcp_architecture]]
- [What is MCP?](https://modelcontextprotocol.io/docs/getting-started/intro)

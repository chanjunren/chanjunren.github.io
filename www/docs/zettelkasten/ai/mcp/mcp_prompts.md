🗓️ 19092026 2037

# mcp_prompts

An MCP **prompt** is a reusable message template supplied by a server. The user normally chooses it, often through a command or menu.

## Why prompts exist

Prompts package a recurring interaction such as “review this change” or “summarize this report.” A server can define arguments for the template and return ready-to-use messages after those arguments are filled in.

Prompts differ from tools and resources in control:

| Capability | Main purpose | Usual control |
|---|---|---|
| Prompt | Reusable instruction | User |
| Resource | Context data | Host |
| Tool | Operation | Model, within host controls |

Use a prompt when users should explicitly start a known workflow. Use a tool when the model needs to choose an operation while working.

## References

- [MCP overview](index.md)
- [[mcp_resources]]
- [MCP prompts](https://modelcontextprotocol.io/docs/learn/server-concepts/prompts)

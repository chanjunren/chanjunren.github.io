🗓️ 19092026 2037

# prompts

An MCP **prompt** is a server-provided message template, usually selected by the user through a command or menu.

## Reusing a workflow

For example, `review_change` could accept a diff and return review instructions. The client lists prompts, then retrieves the selected template with its arguments.

Prompts supply instructions; [[server_resources]] supply context. [[llm_tool_use]] lets the model request operations while working.

## References

- [MCP server features: prompts](https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts#prompts)

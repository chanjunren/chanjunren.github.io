🗓️ 19092026 2037

# mcp_resources

An MCP **resource** is data a server makes available for an AI application to read, such as a file, database schema, or record. Resources provide context; they do not perform an action.

## Mental model

```text
server lists resources -> host chooses useful resource -> host reads it -> model receives selected context
```

The host controls when resources enter a conversation. A server can offer resource templates for parameterized data, such as a path-based file lookup.

## Resources versus tools

Use a resource when the main need is to read context. Use a tool when the application needs to perform an operation or calculate a result. The distinction helps users and hosts understand the possible side effects.

Do not assume that a resource is harmless merely because it is read-only. Its contents can be private, stale, or untrusted.

## References

- [MCP overview](index.md)
- [[llm_tool_use]]
- [MCP resources](https://modelcontextprotocol.io/docs/learn/server-concepts/resources)

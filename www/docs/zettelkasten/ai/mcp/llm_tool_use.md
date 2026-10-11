🗓️ 19092026 2037

# llm_tool_use

**Tool use** lets a model request an operation and use its result. The application executes the request.

```text
request → model proposes call → application checks and executes → model receives result
```

## Who controls execution

The model proposes a tool name and arguments. The application validates inputs, checks permissions, applies limits, and runs the tool. A schema describes valid input; it grants no permission.

Use tools for fresh data, external actions, or reliable computation. Prefer narrow operations, such as `search_docs`, over unrestricted shells.

[MCP](mcp.md) connects the application to external capability servers. Tool use describes the broader model–application loop.

## References

- [Tool use with Claude](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

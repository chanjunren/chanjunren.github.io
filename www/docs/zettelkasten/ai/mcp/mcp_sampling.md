🗓️ 19092026 2037

# mcp_sampling

**Sampling** lets an MCP server ask its client to obtain a model response. The server can use that response while handling a request without storing its own model API key.

```text
MCP server asks client for a completion -> client applies its policy -> model response returns to server
```

## Why it is different

Ordinary tool use flows from model to application: the model proposes an action. Sampling reverses that direction: a server asks the host to use a model.

The client remains in control. It chooses whether to allow the request, which model to use, what context to provide, and whether user review is needed.

## When it helps

Sampling is useful when a server needs language-model work as part of its own task, such as classifying data or drafting a summary. It is an advanced feature. Most MCP servers only expose tools and do not need to invoke a model themselves.

## References

- [[mcp_architecture]]
- [[llm_tool_use]]
- [MCP sampling](https://modelcontextprotocol.io/docs/learn/client-concepts/sampling)

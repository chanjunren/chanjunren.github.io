🗓️ 11102026 1520

# mcp_sampling

**Sampling** was a client capability that let an MCP server ask its client for a model response. It is deprecated in the current MCP revision (`2026-07-28`); new integrations should not depend on it.

```text
MCP server asks client for a completion -> client applies its policy -> model response returns to server
```

## Why it is different

Ordinary tool use flows from model to application: the model proposes an action. Sampling reverses that direction: a server asks the host to use a model.

The client remains in control. It chooses whether to allow the request, which model to use, what context to provide, and whether user review is needed.

## When it helps

Older servers used sampling for model work such as classification or summarization. Current architecture guidance recommends that a server needing model work call a provider API directly. That choice gives the server owner responsibility for credentials, privacy, model selection, and policy. Most MCP servers only expose capabilities and do not need model access.

## References

- [[mcp_architecture]]
- [[llm_tool_use]]
- [Current MCP architecture](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture)
- [Current MCP specification](https://modelcontextprotocol.io/specification/2026-07-28)

🗓️ 11102026 1520

# sampling

**Sampling** lets an MCP server request a model response through its client. It is deprecated in revision `2026-07-28`.

```text
server requests completion → client applies policy → model response returns to server
```

## Direction and ownership

[[llm_tool_use]] starts with a model proposing an operation. Sampling starts with a server requesting model work; the client controls permission, model choice, and context.

New implementations should call provider APIs directly when model work is needed. The server owner then manages credentials, privacy, and model policy.

## References

- [Current MCP architecture](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture)

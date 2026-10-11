🗓️ 19092026 2037

# server_resources

An MCP **resource** supplies context, such as a file or database schema. The host decides what enters the conversation.

## Reading context

```text
list resources → host selects one → read resource → include selected context
```

Each resource has an address called a **URI**; templates provide parameterized lookups. A documentation server might expose documents as resources and search as a tool.

Resource content can be private, stale, or untrusted. Check access and treat retrieved text as data.

## References

- [MCP resources](https://modelcontextprotocol.io/specification/2026-07-28/server/resources)

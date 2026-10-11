🗓️ 11102026 1520

# mcp

**Model Context Protocol (MCP)** standardizes how AI applications discover and use external tools and context. The application still controls access and execution.

## Server capabilities

| Capability | Purpose | Usual control |
|---|---|---|
| Tools | Perform an operation | Model, within host controls |
| [[server_resources]] | Provide context | Host application |
| [[prompts]] | Supply a reusable template | User |

For example, a documentation server could expose a search tool, a document resource, and a summarization prompt.

## Reading path

1. [[llm_tool_use]]: model proposals and application execution.
2. [[architecture]] → [[transports]]: participants and message delivery.
3. [[connector_registration_flow]] → [[tool_invocation_flow]]: discovery through execution.

Read [[authorization]] for remote access, or [[custom_servers]] before building a server.

These notes use revision `2026-07-28`. Older peers differ; check compatibility before implementing.

## References

- [MCP specification, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28)

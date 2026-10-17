🗓️ 19092026 2037

# custom_servers

Build a **custom MCP server** when existing integrations cannot expose the capabilities your application needs.

## Smallest useful interface

First check existing servers. Then choose a tool, resource, or prompt using the [MCP overview](index.md).

For an internal documentation system, start with `search_docs` and a document resource. Describe inputs and limits clearly. Enforce permissions in the server and underlying system; prompts cannot enforce access.

- Expose narrow tasks rather than unrestricted shells.
- Reuse capabilities across hosts where useful.
- Validate access and inputs for every operation.

## References

- [MCP server quickstart](https://modelcontextprotocol.io/docs/develop/build-server)

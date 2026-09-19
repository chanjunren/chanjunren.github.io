🗓️ 19092026 2037

# building_with_claude

When building with Claude, first decide what you are making: a reusable connection to a system, an agent workflow, or a fully custom runtime.

## Three choices

| You want to... | Start with | You control |
|---|---|---|
| Expose tools or data to AI applications | An [MCP](../mcp/index.md) server | Capabilities and server policy |
| Build a multi-step Claude feature | [[claude_agent_sdk]] | Goal, tools, and runtime configuration |
| Own every step of the runtime | Direct API calls and your own loop | Tool dispatch, state, retries, and approvals |

## The key distinction

MCP is a connection standard. It does not decide an agent's workflow. An Agent SDK helps run a workflow, but it does not automatically give that workflow access to your systems. A custom loop gives maximum control but also makes you responsible for safety, state, errors, and stopping rules.

These approaches can work together. For example, build an MCP server once for an internal database, then let an Agent SDK application use that server as one of its capabilities.

## A practical default

- Start with the smallest option that meets the need.
- Use an existing MCP server before building one.
- Use a single agent workflow before adding multiple agents.
- Add custom orchestration only when the default runtime cannot express a required control point.

## References

- [[ai_overview]]
- [[claude_agent_sdk]]
- [MCP overview](../mcp/index.md)
- [[agentic_design_patterns]]

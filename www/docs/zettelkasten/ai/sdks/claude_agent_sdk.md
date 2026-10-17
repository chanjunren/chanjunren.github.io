🗓️ 17102026 1518

# claude_agent_sdk

The **Claude Agent SDK** is Anthropic's library for building applications where Claude works through multiple steps and tools. It gives you a ready-made [[agent_runtime]], so you don't write the loop yourself. SDK and API are defined in [[model_applications]].

## Mental model

You give it a goal, allowed tools, and settings. It runs model calls and tools until the task finishes or hits a configured limit.

The SDK runs the agent; [MCP](../mcp/mcp.md) connects it to external tool servers. They compose: an SDK application can use MCP servers.

## Choosing between SDK, MCP, and your own loop

| Goal | Choose |
|---|---|
| A multi-step agent is the product feature | Agent SDK |
| Expose a reusable external system | MCP server |
| Unusual control over branching, approvals, or execution policy | Your own loop |

Compare other build options in [[building_with_claude]].

## References

- [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)

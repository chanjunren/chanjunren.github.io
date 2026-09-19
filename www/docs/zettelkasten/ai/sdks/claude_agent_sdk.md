🗓️ 19092026 2037

# claude_agent_sdk

The **Claude Agent SDK** is Anthropic's library for building applications where Claude works through multiple steps and tools. It provides an agent runtime so you do not need to implement every model-and-tool interaction yourself.

## Mental model

You give the runtime a goal, allowed capabilities, and configuration. It coordinates model responses and tool use until the task finishes or a configured limit is reached.

Use it when you want to build a Claude-powered workflow as an application. It is different from MCP: the SDK runs or hosts an agent workflow, while [MCP](../mcp/index.md) connects that workflow to compatible external capability servers.

## Decide before choosing it

Choose an agent SDK when a multi-step model workflow is the product feature. Use an MCP server when the goal is to expose a reusable external system. Build your own loop when you need unusual control over branching, approvals, or execution policy.

The choices can compose: an Agent SDK application can consume MCP servers.

## References

- [[building_with_claude]]
- [MCP overview](../mcp/index.md)
- [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)

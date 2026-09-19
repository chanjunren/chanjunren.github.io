🗓️ 19092026 2037

# ai_overview

AI applications become useful when a language model can use context and act through controlled capabilities. This collection explains the layers around that idea, not how models are trained.

## Start here

An AI application has four separate jobs:

- **Model** — turns a request and context into a response or a proposed tool call.
- **Application** — supplies context, runs tools, and enforces permissions.
- **Workflow** — decides whether one pass is enough or work needs multiple steps.
- **Integration** — connects the application to external systems such as files, databases, and APIs.

The model can propose an action. The application must decide whether to allow and execute it. [[llm_tool_use]] explains this boundary.

## Two learning paths

### Build an agent

- Start with [[llm_tool_use]].
- Read [[agentic_design_patterns]] to choose a workflow.
- Read [[agent_memory_and_state]] only when work must survive more than one model call.
- Use [[claude_agent_sdk]] when an SDK fits the workflow, or [[building_with_claude]] to compare implementation choices.

### Connect external systems

- Start with the [MCP overview](mcp/index.md).
- Read [[mcp_architecture]] and [[mcp_transports]].
- Read [[mcp_authorization]] only when a remote server needs user-authorized access.
- Read [[custom_mcp_servers]] when an existing server cannot safely expose your system.

## How the ideas fit

```text
user request
    |
application / agent workflow
    |-- model uses [[llm_tool_use]]
    |-- optional memory and review loops
    `-- optional MCP client
            `-- MCP server
                    `-- database, files, API, or service
```

**MCP is an integration standard, not an agent framework.** It tells an application how to discover and communicate with a capability provider. It does not decide what the model should do or grant permission for an action.

## References

- [[llm_tool_use]]
- [[agentic_design_patterns]]
- [MCP overview](mcp/index.md)
- [What is MCP?](https://modelcontextprotocol.io/docs/getting-started/intro)

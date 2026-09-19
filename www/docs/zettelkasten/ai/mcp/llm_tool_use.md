🗓️ 19092026 1003

# llm_tool_use

> **Tool use** lets a model ask an application to perform an operation and then use the result in its answer.

## What problem does it solve?

An LLM can generate language, but it cannot know the current contents of your database or carry out a real-world side effect by itself. Tool use gives it a controlled interface to external systems.

The model proposes a call. The application remains responsible for deciding whether the call is allowed and for executing it.

## How it works

The model receives tool descriptions and input schemas alongside the conversation. It can then either answer directly or return a structured request such as:

```json
{
  "name": "get_weather",
  "arguments": { "city": "Tokyo" }
}
```

The application validates and executes the request, then sends the result back to the model. The model uses that result to continue the conversation or produce a final answer.

```text
user -> model -> tool call -> application executes -> tool result -> model -> answer
```

The model does not see the tool implementation. It sees the tool's description and the result returned by the application.

## The important boundary

Tool use separates **intent** from **execution**:

- The model chooses whether a tool seems useful and proposes arguments.
- The application authenticates, validates, authorizes, and executes the operation.
- The application decides how to handle errors, retries, cancellation, and side effects.

Treat a model-generated tool call as an untrusted request. A schema helps the model produce the right shape, but it is not an authorization policy.

## Tradeoffs

Tool use is a good fit when a task needs:

- fresh or private data;
- a side effect, such as sending a message or changing a record;
- an output with a predictable structure.

It also adds another round trip, token usage, latency, and failure modes. Tool results can be unavailable or wrong. A tool should not be added when the model can answer safely and directly.

Narrow tools are usually easier to authorize and recover from than one large tool that hides many unrelated operations. Independent calls can run in parallel, but the application still owns ordering and resource limits.

## How it connects to MCP

Tool use and MCP solve different problems:

| | Tool use | MCP |
|---|---|---|
| Problem | How does a model request an operation? | How does an AI application discover and communicate with tool servers? |
| Boundary | Model -> application runtime | MCP client -> MCP server |
| Main contents | Tool schemas, calls, and results | Messages, lifecycle, discovery, and transports |

MCP does not make the model execute code. It gives the host a standard way to discover and invoke capabilities. The host then adapts those capabilities to the model provider's tool-use interface.

When the question becomes “How does the host reach the tool server?”, continue to [[mcp_transports]]. When it becomes “What can an MCP server expose?”, continue to [[model_context_protocol]].

---
## References
- [[model_context_protocol]]
- [[mcp_transports]]
- [[agentic_design_patterns]]
- [[claude_agent_sdk]]
- [How tool use works — Anthropic](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works)
- [Function calling — OpenAI](https://platform.openai.com/docs/guides/function-calling)

🗓️ 19092026 2037

# llm_tool_use

**Tool use** lets a model request an action from an application, then use the result in its next response. It gives a language model a controlled way to access current data and perform work.

```text
user request -> model proposes tool call -> application validates and runs it -> result returns to model
```

## The boundary that matters

The model chooses whether a tool seems useful and proposes arguments. The application owns execution: it authenticates, authorizes, validates inputs, applies limits, handles errors, and records side effects.

A tool schema helps produce well-formed input. It is not a permission check. Treat a model-generated call as untrusted input.

## When tool use helps

Use it when the task needs current or private data, an action in another system, or a reliable computation. Do not add a tool when the model can answer safely from its existing context.

Narrow tools are easier to understand and secure than a single tool with many unrelated powers.

## Relation to MCP

Tool use is the model-to-application interaction. [MCP](index.md) is one standard way for an application to discover and communicate with tool servers. They solve different parts of the system.

## References

- [[ai_overview]]
- [MCP overview](index.md)
- [Tool use with Claude](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
- [Function calling](https://platform.openai.com/docs/guides/function-calling)

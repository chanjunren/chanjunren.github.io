🗓️ 21032026 2100

# llm_tool_use

> LLMs don't execute functions — they output structured calls that your code executes, then incorporate the results

## How it works

**Tool use** (a.k.a. function calling) lets an LLM request external function execution instead of generating text-only output. The LLM produces a structured `tool_use` block; your runtime executes it and sends back a `tool_result`.

```
  User              Runtime             LLM
   │                  │                  │
   │  "What's the     │                  │
   │   weather in     │                  │
   │   Tokyo?"        │                  │
   │ ────────────────>│                  │
   │                  │  messages +      │
   │                  │  tool_definitions│
   │                  │ ────────────────>│
   │                  │                  │
   │                  │  tool_use:       │
   │                  │  get_weather     │
   │                  │  {"city":"Tokyo"}│
   │                  │ <────────────────│
   │                  │                  │
   │                  │  [executes fn]   │
   │                  │                  │
   │                  │  tool_result:    │
   │                  │  "22°C, sunny"   │
   │                  │ ────────────────>│
   │                  │                  │
   │                  │  "It's 22°C and  │
   │                  │   sunny in Tokyo"│
   │                  │ <────────────────│
   │                  │                  │
```

1. Runtime sends the user message + available tool definitions to the LLM
2. LLM decides a tool would help → returns a `tool_use` block with name + arguments
3. Runtime executes the function, sends result back as `tool_result`
4. LLM incorporates the result into its final response

The LLM never touches your database, API, or filesystem. It just says "call this function with these arguments" and your code does the rest.

## Tool definitions

Tools are defined via **JSON Schema**:

```json
{
  "name": "get_weather",
  "description": "Get current weather for a city. Use when the user asks about weather conditions.",
  "input_schema": {
    "type": "object",
    "properties": {
      "city": { "type": "string", "description": "City name, e.g. 'Tokyo'" }
    },
    "required": ["city"]
  }
}
```

The **description** drives tool selection. The LLM reads it to decide *when* to call the tool. "Get current weather for a city" → LLM calls it for weather questions. "Database tool" → LLM has no idea when to use it.

## Tool use is the building block

Every agentic pattern relies on tool use:

| Pattern | How tools are used | Example |
|---|---|---|
| **Single agent** | Calls tools sequentially | Claude Code reads a file, edits it, runs tests |
| **[[coordinator_router_pattern]]** | Coordinator calls sub-agents as tools | Research agent delegates to search + summarize sub-agents |
| **[[agent_as_tool_pattern]]** | Sub-agents are exposed as callable tools | Code review agent calls a "run linter" sub-agent |
| **[[loop_review_critique_pattern]]** | Critic uses tools to validate output | SQL generator → validator tool checks syntax → loop |

## Tool use vs MCP

| | Tool use | MCP |
|---|---|---|
| **What** | LLM's ability to call functions | Protocol for delivering tools to the LLM |
| **Scope** | One LLM ↔ runtime interaction | Ecosystem-wide tool discovery |
| **Defined by** | Each provider (Anthropic, OpenAI, Google) | Open standard |

Tool use is the LLM's ability to "use its hands." [[model_context_protocol]] is the standard that puts tools within reach.

---
## References
- [[model_context_protocol]]
- [[agentic_design_patterns]]
- [[claude_agent_sdk]]
- [Tool Use — Anthropic Docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview)
- [Function Calling — OpenAI Docs](https://platform.openai.com/docs/guides/function-calling)
- [Function Calling — Google Gemini Docs](https://ai.google.dev/gemini-api/docs/function-calling)

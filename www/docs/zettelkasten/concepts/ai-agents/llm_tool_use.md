🗓️ 21032026 2100

# llm_tool_use

> The mechanism by which LLMs generate structured function calls that a runtime executes, bridging language understanding with real-world actions

## What Is Tool Use?

Tool use (also called "function calling") allows an LLM to **request the execution of external functions** instead of generating a text-only response. The LLM doesn't execute anything itself — it produces a structured call that the runtime environment handles.

## Request / Response Cycle

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
   │  "It's 22°C and  │                  │
   │   sunny in Tokyo"│                  │
   │ <────────────────│                  │
```

1. **User sends a request** to the runtime
2. **Runtime forwards** the message along with available tool definitions to the LLM
3. **LLM decides** to use a tool and returns a structured `tool_use` block
4. **Runtime executes** the function and sends the result back as a `tool_result`
5. **LLM incorporates** the result into its final response

## Tool Definitions

Tools are defined via **JSON Schema**, telling the LLM what's available and how to call it:

| Field | Purpose |
|---|---|
| `name` | Function identifier (e.g., `get_weather`) |
| `description` | When and why to use this tool — critical for the LLM's decision-making |
| `input_schema` | JSON Schema specifying parameter names, types, and constraints |

**Good descriptions matter**: the LLM uses the description to decide _when_ to call a tool. Vague descriptions lead to incorrect or missed tool calls.

## How Tool Use Enables Agentic Patterns

Tool use is the **foundational capability** that makes agentic patterns possible:

| Pattern | How Tools Are Used |
|---|---|
| **Single agent** | Agent calls tools sequentially to accomplish a task |
| **[[coordinator_router_pattern]]** | Coordinator uses tools to delegate to specialist sub-agents |
| **[[agent_as_tool_pattern]]** | Sub-agents are themselves exposed as callable tools |
| **[[loop_review_critique_pattern]]** | Reviewer agent uses tools to validate outputs against criteria |

## Tool Use vs MCP

| Aspect | Tool Use | MCP |
|---|---|---|
| **What it is** | LLM-side capability to call functions | Infrastructure protocol for exposing tools |
| **Scope** | Single LLM ↔ runtime interaction | Ecosystem-wide tool discovery and access |
| **Defined by** | Each LLM provider (Anthropic, OpenAI, Google) | Open standard (MCP spec) |
| **Relationship** | The mechanism | The plumbing that delivers tools to the mechanism |

Think of tool use as the LLM's ability to "use its hands", and [[model_context_protocol]] as the standard that puts tools within reach.

---
## References
- [[model_context_protocol]]
- [[agentic_design_patterns]]
- [[agent_as_tool_pattern]]
- [Tool Use — Anthropic Docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview)
- [Function Calling — OpenAI Docs](https://platform.openai.com/docs/guides/function-calling)
- [Function Calling — Google Gemini Docs](https://ai.google.dev/gemini-api/docs/function-calling)

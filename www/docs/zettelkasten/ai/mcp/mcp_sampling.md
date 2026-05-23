🗓️ 23052026 2200

# mcp_sampling

> Servers request LLM completions from the client — reverse direction, no API keys needed

## What sampling is

**Sampling** lets MCP servers request language model completions through the client, without embedding any model SDK or API key. The server sends a `sampling/createMessage` request; the client routes it to its LLM and returns the result.

This enables agentic behavior nested inside server logic — the server can think, reason, and generate text as part of handling a tool call.

## How it works

```
Server                Client               User                LLM
  │                     │                    │                   │
  │ sampling/           │                    │                   │
  │ createMessage ─────>│                    │                   │
  │                     │ Present request ──>│                   │
  │                     │                    │ Approve/modify    │
  │                     │<── Approved ───────│                   │
  │                     │                    │                   │
  │                     │ Forward request ──────────────────────>│
  │                     │<─────────────────── Generation ───────│
  │                     │                    │                   │
  │                     │ Present response ─>│                   │
  │                     │<── Approved ───────│                   │
  │<── Response ────────│                    │                   │
```

Human-in-the-loop at two points: before sending to the LLM, and before returning the response. The client controls both gates.

## Request format

```json
{
  "method": "sampling/createMessage",
  "params": {
    "messages": [
      { "role": "user", "content": { "type": "text", "text": "What is the capital of France?" } }
    ],
    "modelPreferences": {
      "hints": [{ "name": "claude-3-sonnet" }],
      "intelligencePriority": 0.8,
      "speedPriority": 0.5
    },
    "systemPrompt": "You are a helpful assistant.",
    "maxTokens": 100
  }
}
```

## Model preferences

Servers can't request a specific model — the client might use a different provider entirely. Instead, MCP uses a two-part preference system:

### Capability priorities

Three normalized values (0–1) expressing what matters:

| Priority | High value prefers |
|---|---|
| `costPriority` | Cheaper models |
| `speedPriority` | Faster models |
| `intelligencePriority` | More capable models |

### Hints

Suggestions for specific models or families. Treated as substrings that match model names flexibly:

```json
{
  "hints": [
    { "name": "claude-3-sonnet" },
    { "name": "claude" }
  ]
}
```

Evaluated in order. Client may map `claude-3-sonnet` → `gemini-1.5-pro` if it doesn't have Claude. Hints are advisory — the client always makes the final call.

## Content types

Sampling messages support text, image (base64), and audio (base64). Multi-modal requests are possible.

## When servers use this

- **Data enrichment** — classify, summarize, or extract from data during processing
- **Decision-making** — reason about next steps in a multi-step workflow
- **Content generation** — produce text as part of a tool's output
- **Agentic sub-tasks** — think through a problem without exposing the full context to the outer agent

---
## References
- [[mcp_architecture]]
- [[llm_tool_use]]
- [MCP Sampling — Official Docs](https://modelcontextprotocol.io/docs/concepts/sampling)

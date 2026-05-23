🗓️ 21032026 2100

# agent_as_tool_pattern

> One primary agent holds all state and calls sub-agents as stateless functions — like a developer using CLI tools

## How it works

1. **Primary agent** owns the workflow and all state
2. Calls sub-agents as **stateless functions** — they do one thing and return a result
3. Primary agent inspects the result and decides the next step
4. Sub-agents know nothing about the broader workflow

### Concrete example: code review agent

```
Primary agent (code reviewer)
  │
  ├─ calls "run_linter" sub-agent → returns lint warnings
  │   (primary inspects: 3 warnings, 2 are style-only)
  │
  ├─ calls "run_tests" sub-agent → returns test results
  │   (primary inspects: 1 failing test in auth module)
  │
  └─ calls "check_security" sub-agent → returns vulnerability scan
      (primary composes final review from all three results)
```

The primary agent decides which sub-agents to call, in what order, and how to interpret results. Sub-agents just execute and return.

## Difference from coordinator

| | [[coordinator_router_pattern]] | Agent as tool |
|---|---|---|
| **Control** | Delegates control to sub-agents | Primary retains full control |
| **State** | Sub-agents may hold their own state | Sub-agents are stateless |
| **Between steps** | Coordinator fires and waits | Primary inspects output, may change course |
| **Analogy** | Manager delegates tasks | Developer uses CLI tools |

Use coordinator when subtasks are independent. Use agent-as-tool when the primary needs to make decisions based on each sub-agent's output before proceeding.

## Trade-offs

| Pros | Cons |
|---|---|
| Centralized state — easier to reason about | Primary agent becomes a bottleneck |
| Fine-grained decisions between steps | Primary prompt grows complex with accumulated context |
| Sub-agents are simple (stateless, single-purpose) | Still high cost — multiple LLM calls per workflow |

---
## References
- [[agentic_design_patterns]]
- [[coordinator_router_pattern]]
- [Advanced Agentic Patterns for Multi-Agent Systems](https://youtu.be/89KKm_a4M7A?si=PyQjItG2hIG0Bsn4)

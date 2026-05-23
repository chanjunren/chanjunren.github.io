🗓️ 21032026 2100

# coordinator_router_pattern

> A top-level agent decomposes a complex request into subtasks and routes each to a specialist

## How it works

1. **Coordinator** receives a complex request
2. Decomposes it into independent subtasks
3. Routes each to the right **specialist sub-agent**
4. Sub-agents run (sequentially or in parallel)
5. Coordinator aggregates results into a unified response

### Concrete example: travel planning

```
User: "Plan a 3-day Tokyo trip, budget $2000"

              ┌─────────────┐
              │ Coordinator │
              └──────┬──────┘
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌─────────┐ ┌──────────┐ ┌──────────┐
   │ Flights │ │  Hotels  │ │  Food &  │
   │  Agent  │ │  Agent   │ │ Activity │
   │(search  │ │(search   │ │  Agent   │
   │ + book) │ │ + filter)│ │(parallel)│
   └─────────┘ └──────────┘ └──────────┘

Coordinator: "Flight is $800, hotel $600 → $600 left for food & activities"
```

The coordinator doesn't book flights or find restaurants. It delegates to specialists and assembles the final plan.

### Another example: Claude Code's Explore agents

When Claude Code spawns 3 Explore agents in parallel — one searching for implementations, one exploring test patterns, one reading configs — that's coordinator-router. The main agent decomposes the research question and assembles findings.

## When to use

- Request splits into **independent subtasks** handled by different specialists
- Subtasks benefit from **different strategies** (some sequential, some parallel)
- Each specialist has **domain-specific tools** or prompts

## Difference from agent-as-tool

Coordinator delegates and waits. [[agent_as_tool_pattern]] inspects each sub-agent result and may change course. Use coordinator when subtasks are independent; use agent-as-tool when the primary needs to make decisions between steps.

## Trade-offs

| Pros | Cons |
|---|---|
| Handles diverse complex problems | Routing overhead adds latency |
| Clean separation — each specialist is simple | Multi-level LLM calls increase cost |
| Parallel execution where subtasks are independent | Harder to debug across agent boundaries |

---
## References
- [[agentic_design_patterns]]
- [[agent_as_tool_pattern]]
- [Advanced Agentic Patterns for Multi-Agent Systems](https://youtu.be/89KKm_a4M7A?si=PyQjItG2hIG0Bsn4)

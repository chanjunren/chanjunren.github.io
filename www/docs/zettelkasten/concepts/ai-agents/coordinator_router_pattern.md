🗓️ 21032026 2100

# coordinator_router_pattern

> Hierarchical task decomposition where a top-level coordinator routes subtasks to specialized agents

## How It Works

1. **Coordinator agent** receives a complex user request
2. Analyzes and decomposes it into subtasks
3. Routes each subtask to the appropriate **specialized sub-agent**
4. Sub-agents can themselves be sequential or parallel workflows
5. Coordinator aggregates results and returns a unified response

```
                    ┌─────────────┐
                    │ Coordinator │
                    └──────┬──────┘
              ┌────────────┼────────────┐
              ▼            ▼            ▼
     ┌────────────┐ ┌───────────┐ ┌──────────┐
     │ Food &     │ │ Nearby    │ │ Trip     │
     │ Transport  │ │ Places    │ │ Cost     │
     │(sequential)│ │(parallel) │ │          │
     └────────────┘ └───────────┘ └──────────┘
```

## Analogy

Acts like a **project manager** — understands the big picture, delegates to specialists, and assembles the final deliverable.

## When to Use

- Complex requests that naturally decompose into **independent subtasks**
- When specialized agents exist for different domains (search, calculation, generation)
- When subtasks benefit from different execution strategies (some sequential, some parallel)

## Trade-offs

| Pros | Cons |
|---|---|
| Highly flexible — handles diverse complex problems | Routing overhead adds latency |
| Leverages domain-specific expertise per sub-agent | Multi-level calls increase cost |
| Clean separation of concerns | Harder to debug across agent boundaries |

---
## References
- [[agentic_design_patterns]]
- [[agent_as_tool_pattern]] — alternative approach where primary agent retains full control
- [Advanced Agentic Patterns for Multi-Agent Systems](https://youtu.be/89KKm_a4M7A?si=PyQjItG2hIG0Bsn4)

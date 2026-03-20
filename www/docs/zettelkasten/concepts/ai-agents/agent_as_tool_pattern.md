🗓️ 21032026 2100

# agent_as_tool_pattern

> Primary agent maintains full control and state, using sub-agents as stateless tools

## How It Works

1. **Primary agent** owns the entire workflow and state
2. Calls sub-agents as **stateless functions** — they execute a specific task and return results
3. Primary agent decides what to do next based on returned results
4. Sub-agents have no awareness of the broader workflow

## Key Difference from Coordinator

| | Coordinator | Agent as Tool |
|---|---|---|
| **Control** | Delegates control to sub-agents | Primary agent retains full control |
| **State** | Sub-agents may manage their own state | Sub-agents are stateless |
| **Analogy** | Manager delegating work | Craftsman using tools |

## When to Use

- Primary agent needs **fine-grained control** over workflow progression
- Workflow state must be **centrally managed** (e.g., decisions depend on accumulated context)
- Sub-agent outputs need to be **composed or transformed** before the next step

## Trade-offs

| Pros | Cons |
|---|---|
| Centralized state = easier to reason about overall flow | Primary agent becomes a bottleneck |
| Fine-grained decision making between steps | Similar structural complexity to coordinator |
| Sub-agents are simpler (stateless, single-purpose) | Primary agent prompt can grow complex |

---
## References
- [[agentic_design_patterns]]
- [[coordinator_router_pattern]] — alternative approach where coordinator delegates control
- [Advanced Agentic Patterns for Multi-Agent Systems](https://youtu.be/89KKm_a4M7A?si=PyQjItG2hIG0Bsn4)

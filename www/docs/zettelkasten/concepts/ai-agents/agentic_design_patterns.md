🗓️ 21032026 2100

# agentic_design_patterns

> Architectural patterns for building AI agent systems, ranging from simple single-agent setups to complex multi-agent orchestrations

## Overview

Agentic patterns define how AI agents are structured, coordinated, and controlled to accomplish tasks. Choosing the right pattern involves trade-offs between **control**, **flexibility**, **cost/latency**, and **complexity**.

## Pattern Comparison

| Pattern | Use Case | Control | Flexibility | Cost & Latency | Complexity |
|---|---|---|---|---|---|
| **Single Agent** | Simple prototypes | Full (one agent) | Low | Low | Low |
| **Sequential / Parallel** | Structured workflows | Moderate | Moderate | Moderate | Moderate |
| **[[loop_review_critique_pattern]]** | Tasks with strict criteria | Iterative | Moderate | High (loops) | High |
| **[[coordinator_router_pattern]]** | Complex task routing | Delegated | High | High | High |
| **[[agent_as_tool_pattern]]** | Fine control with sub-agents | Full (primary) | High | High | High |

## Key Takeaways

- **Single / Sequential / Parallel** agents suit most straightforward workflows
- **Loop agents** shine when outputs must meet non-negotiable constraints (e.g., budget limits, safety checks)
- **Coordinator agents** excel at decomposing complex requests into subtasks handled by specialists
- **Agent-as-tool** keeps centralized state management while leveraging specialized capabilities
- More advanced patterns increase latency and cost — only use them when simpler patterns fall short
- Foundational concepts: [[llm_tool_use]] (how agents interact with external functions) and [[agent_memory_and_state]] (how agents retain context across steps)

---
## References
- [Advanced Agentic Patterns for Multi-Agent Systems](https://youtu.be/89KKm_a4M7A?si=PyQjItG2hIG0Bsn4)

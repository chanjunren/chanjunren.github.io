🗓️ 21032026 2100

# agentic_design_patterns

> Start with the simplest pattern that works. Add complexity only when simpler patterns fail.

## Pattern comparison

| Pattern | When to use | Concrete example | Cost |
|---|---|---|---|
| **Single agent** | One model, one loop, straightforward task | Claude Code editing a file and running tests | Low |
| **Sequential / Parallel** | Fixed multi-step workflow | ETL: extract → transform → load (sequential). Search 3 APIs at once (parallel) | Moderate |
| **[[loop_review_critique_pattern]]** | Output must meet strict constraints | Generate SQL → validate syntax → check results → retry if wrong | High (loops) |
| **[[coordinator_router_pattern]]** | Complex request decomposes into specialist subtasks | "Plan my trip" → flight agent + hotel agent + restaurant agent | High |
| **[[agent_as_tool_pattern]]** | Need centralized control over sub-agent outputs | Code agent calls "run tests" sub-agent, inspects results, decides next step | High |

## Decision flow

1. Can a single agent + tools handle it? → **Single agent.** Most tasks fit here.
2. Are the steps fixed and predictable? → **Sequential / Parallel.**
3. Does output need validation against hard constraints? → **[[loop_review_critique_pattern]].**
4. Does the task split into independent specialist subtasks? → **[[coordinator_router_pattern]].**
5. Do you need to inspect and transform sub-agent output between steps? → **[[agent_as_tool_pattern]].**

Each step up adds latency and cost. A coordinator pattern on a task a single agent could handle wastes tokens and time.

## Foundations

All patterns rely on [[llm_tool_use]] (how the LLM calls external functions) and [[agent_memory_and_state]] (how agents retain context across steps).

---
## References
- [Advanced Agentic Patterns for Multi-Agent Systems](https://youtu.be/89KKm_a4M7A?si=PyQjItG2hIG0Bsn4)
- [Anthropic — Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)

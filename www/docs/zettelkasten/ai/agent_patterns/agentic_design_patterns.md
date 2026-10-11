🗓️ 19092026 2037

# agentic_design_patterns

An **agent pattern** is a way to organize multiple model calls and tool calls. Choose the smallest pattern that can complete the task reliably.

## Core mental model

Most work is one loop: give the model a goal and relevant tools, let it call a tool if needed, return the result, then let it continue. Adding agents does not make the model smarter by itself. It adds specialization, checks, or control at the cost of latency and complexity.

## Choose a pattern

| Need | Pattern | Use it when |
|---|---|---|
| One task with tools | Single agent | Default for most work |
| Known steps | Sequential or parallel workflow | Order is fixed, or independent work can run together |
| Checkable output | [[loop_review_critique_pattern]] | A result must pass clear tests |
| Independent specialties | [[coordinator_router_pattern]] | A request divides into separate expert tasks |
| Step-by-step central judgment | [[agent_as_tool_pattern]] | Later work depends on examining earlier results |

## Safe default

- Begin with one agent and ordinary code for fixed steps.
- Add a review loop when you can state a pass condition.
- Add multiple agents only when separation makes a real decision easier or enables useful parallel work.

Agents need [[llm_tool_use]] to interact with the world. They need [[agent_memory_and_state]] only when context must persist across steps or sessions.

## References

- [[ai_overview]]
- [[llm_tool_use]]
- [[agent_memory_and_state]]
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

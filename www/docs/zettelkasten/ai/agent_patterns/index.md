---
title: agent_patterns
---
🗓️ 17102026 1518

# agent_patterns

An **agent pattern** is a way to organize multiple model calls and tool calls. Choose the smallest pattern that completes the task reliably.

## Terms

| Term | Definition | Source |
|---|---|---|
| **Workflow** | A system where LLMs and tools follow code paths fixed in advance, rather than the model choosing its own steps. | [Anthropic](https://www.anthropic.com/engineering/building-effective-agents) |

## Core mental model

A workflow fixes the steps in code. An [[agent_runtime]] lets the model choose them.

More agents don't make the model smarter. They add specialization, checks, or control, at the cost of latency and complexity.

## Choose a pattern

| Need | Pattern | Use it when |
|---|---|---|
| One task with tools | Single agent | Default for most work |
| Known steps | Sequential or parallel workflow | Order is fixed, or independent work can run together |
| Checkable output | [[loop_review_critique]] | A result must pass clear tests |
| Independent specialties | [[coordinator_router]] | A request divides into separate expert tasks |
| Step-by-step central judgment | [[agent_as_tool]] | Later work depends on examining earlier results |

## Safe default

- Start with one agent, plus ordinary code for fixed steps.
- Add a review loop once you can state a pass condition.
- Add agents only for real separation or useful parallelism.

Every agent needs [[llm_tool_use]] to act. Add [[memory_and_state]] only when context must persist across steps or sessions.

## References

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

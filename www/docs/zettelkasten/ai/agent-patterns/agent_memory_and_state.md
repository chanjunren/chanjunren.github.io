🗓️ 19092026 2037

# agent_memory_and_state

**State** is information an agent needs while doing work. **Memory** is state kept long enough to reuse later. Without either, each model call starts with only its current input.

## Three useful scopes

| Scope | What it holds | Example |
|---|---|---|
| In-call context | Request, instructions, and tool results | A model deciding its next action |
| Session state | Progress across one workflow | Completed steps and pending tasks |
| Persistent memory | Reusable facts or past outcomes | A user preference or a project record |

Keep state outside the model when it must be reliable, queryable, or durable. The model's context window is useful working space, not a database.

## Practical rule

Store only information that changes a future decision. Retrieve it deliberately. Old or irrelevant memory can distract the model, cost tokens, and expose private data.

For a single task, short-lived context is usually enough. A coordinator keeps shared workflow state; an agent-as-tool design keeps it with the primary agent. See [[agentic_design_patterns]].

## References

- [[ai_overview]]
- [[agentic_design_patterns]]
- [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/)

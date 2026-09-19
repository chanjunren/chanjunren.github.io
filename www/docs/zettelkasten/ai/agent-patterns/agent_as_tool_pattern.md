🗓️ 19092026 2037

# agent_as_tool_pattern

In the **agent-as-tool pattern**, one primary agent owns the goal and state. It calls specialized agents like tools, evaluates each result, then chooses the next step.

```text
primary agent -> specialist -> result -> primary agent decides next action
```

## When it helps

Use it when a result changes the plan. For example, a debugging agent can ask one specialist to inspect logs, then choose a targeted test based on that answer. The primary agent retains the context that connects those decisions.

## Difference from a coordinator

A [[coordinator_router_pattern]] usually delegates independent tasks and combines their answers. Agent-as-tool is more sequential: each specialist answer can redirect the primary agent. That makes it useful for investigation, but the primary agent can become a context and latency bottleneck.

Use a single agent first. Add this pattern only when separating a narrow expert task makes the primary agent's decision easier.

## References

- [[agentic_design_patterns]]
- [[coordinator_router_pattern]]

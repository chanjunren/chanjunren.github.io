🗓️ 19092026 2037

# coordinator_router_pattern

A **coordinator** breaks one request into distinct tasks, assigns each task to a suitable specialist, then combines the results.

```text
request -> coordinator -> specialists -> coordinator -> answer
```

## When it helps

Use this pattern when tasks are independent and benefit from different knowledge, tools, or prompts. A research request might split into product, legal, and technical questions. Those specialists can often run in parallel.

The coordinator owns the final answer. It must keep enough shared state to avoid duplicate work and reconcile conflicts between results.

## When not to use it

Do not split work merely because it is long. Multiple agents add routing errors, repeated context, latency, and cost. A single agent is clearer when each next action depends closely on the prior result.

For that sequential-judgment case, see [[agent_as_tool_pattern]]. For the full choice, see [[agentic_design_patterns]].

## References

- [[agentic_design_patterns]]
- [[agent_as_tool_pattern]]

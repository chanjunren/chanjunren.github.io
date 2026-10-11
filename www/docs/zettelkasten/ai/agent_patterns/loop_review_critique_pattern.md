🗓️ 19092026 2037

# loop_review_critique_pattern

A **review loop** creates a result, checks it against explicit criteria, then revises it if needed. It improves reliability when a single answer is not enough.

```text
generate result -> check criteria -> revise or finish
```

## When it helps

Use a loop when success is measurable: code compiles, a response matches a schema, a budget is met, or a query returns valid results. Do not use it for a vague goal such as “make this good”; the critic cannot consistently judge that goal.

## Design it as a test

Define three things before adding the loop:

- A concrete pass condition.
- Feedback that identifies what failed.
- A maximum number of attempts and a fallback when it is reached.

For example, a report generator can validate that every required section exists before finishing. The check should say which section is missing, not only that the report failed.

This pattern is one option in [[agentic_design_patterns]]. Each extra attempt costs another model call, so use ordinary programmatic validation where possible.

## References

- [[agentic_design_patterns]]
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

🗓️ 21032026 2100

# loop_review_critique_pattern

> Iterative refinement pattern where a generator and critic agent loop until output meets strict criteria

## How It Works

1. **Generator agent** produces an initial output (e.g., a travel plan)
2. **Critique agent** evaluates the output against specific non-negotiable conditions
3. If conditions fail → feedback is sent back to the generator for revision
4. Loop continues until criteria are met **or** a max iteration limit is reached

```
┌──────────┐     output     ┌──────────┐
│ Generator │──────────────►│  Critic  │
│   Agent   │◄──────────────│  Agent   │
└──────────┘   feedback     └──────────┘
      ▲                           │
      └───── loop until ──────────┘
              criteria met
              or max iterations
```

## When to Use

- Output must satisfy **strict, non-negotiable constraints** (e.g., travel time < 30 min, budget < $500)
- Quality gates that cannot be approximated in a single pass

## Key Design Considerations

- **Max iteration limit** is essential to prevent infinite loops
- **Exit conditions** need careful design — too strict = wasted compute, too loose = low quality
- Each iteration adds latency and token cost

## Trade-offs

| Pros | Cons |
|---|---|
| Ensures outputs meet specific quality thresholds | Higher latency from multiple iterations |
| Prioritizes critical constraints effectively | Increased compute cost |
| Self-correcting without human intervention | Exit condition design complexity |

---
## References
- [[agentic_design_patterns]]
- [Advanced Agentic Patterns for Multi-Agent Systems](https://youtu.be/89KKm_a4M7A?si=PyQjItG2hIG0Bsn4)

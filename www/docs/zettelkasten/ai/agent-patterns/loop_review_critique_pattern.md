🗓️ 21032026 2100

# loop_review_critique_pattern

> Generator produces output, critic checks it against hard constraints, loop until it passes or hits max iterations

## How it works

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

1. Generator produces output
2. Critic evaluates against specific constraints
3. Fail → feedback goes back to generator for revision
4. Loop until criteria pass **or** max iterations reached

### Concrete example: SQL generation with validation

```
User: "Monthly revenue by product category for Q1"

Iteration 1:
  Generator → SELECT category, SUM(revenue) FROM sales GROUP BY category
  Critic    → FAIL: missing date filter, no month breakdown

Iteration 2:
  Generator → SELECT category, EXTRACT(MONTH FROM sale_date), SUM(revenue)
              FROM sales WHERE sale_date BETWEEN '2026-01-01' AND '2026-03-31'
              GROUP BY category, EXTRACT(MONTH FROM sale_date)
  Critic    → PASS: correct date range, monthly granularity, valid syntax
```

### Another example: content quality gate

A Chocobo lyrics agent generates translations. Critic checks: every line has a translation, romanization is present for CJK text, cultural notes aren't empty platitudes. Fails → generator retries specific lines.

## When to use

- Output must satisfy **strict, measurable constraints** (SQL validity, budget limits, format compliance)
- A single pass isn't reliable enough — the constraint is complex or the generator is prone to specific errors

## Design considerations

- **Max iterations** — essential. Without a cap, bad constraints cause infinite loops. 3-5 is typical.
- **Specific feedback** — critic should say *what* failed and *why*, not just "try again"
- **Measurable criteria** — "SQL parses successfully" is testable. "SQL is good" isn't.
- Each iteration costs ~1 LLM call. 5 iterations = 5x the cost of a single pass.

## Trade-offs

| Pros | Cons |
|---|---|
| Enforces hard quality thresholds | Higher latency — each loop is another LLM call |
| Self-correcting without human intervention | 3-5x cost vs single pass |
| Catches errors a single pass would miss | Exit condition design is tricky — too strict wastes compute |

---
## References
- [[agentic_design_patterns]]
- [Advanced Agentic Patterns for Multi-Agent Systems](https://youtu.be/89KKm_a4M7A?si=PyQjItG2hIG0Bsn4)

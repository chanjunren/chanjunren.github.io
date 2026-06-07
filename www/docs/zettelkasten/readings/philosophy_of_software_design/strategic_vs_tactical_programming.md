🗓️ 06062026 2100

# strategic_vs_tactical_programming

Ousterhout frames two programming mindsets. **Tactical**: get it working now. **Strategic**: produce a design that works now *and* supports future development. The choice compounds — tactical shortcuts accumulate into systems nobody wants to touch.

## Tactical programming

- Goal: make the feature work, ship it
- Each shortcut is small and seemingly harmless
- Complexity grows **incrementally** — no single commit ruins the codebase, but hundreds of small compromises do
- Tactical programmers are often rewarded short-term (fast delivery) while the debt stays invisible until it isn't

### The "tactical tornado"

Ousterhout's term for the prolific developer who ships fast but leaves a trail of fragile, tangled code. Often celebrated by management, dreaded by the team that maintains the result.

## Strategic programming

- Goal: a great design that also works
- Treats every change as an opportunity to improve structure
- **Sweats the small stuff** — zero tolerance for accumulating complexity
- Slower initially, but faster over time as the codebase stays workable

## The investment math

- Ousterhout estimates ~10% extra effort upfront for strategic design
- Payoff window: **6–12 months** before the investment yields net gains
- After that, strategic codebases accelerate while tactical ones slow down

```ad-warning
Startups and tight deadlines push toward tactical. Facebook's early "move fast and break things" culture shipped fast but required years of cleanup. The cleanup rarely fully happens.
```

## How to apply

- Not binary — you don't redesign everything, and you don't skip all design
- When touching code: leave it slightly better than you found it
- When building new: invest in the interface and module boundaries first
- When under pressure: know you're taking a loan, not getting something free

## References

- John Ousterhout, *A Philosophy of Software Design* (2018), Ch. 3
- [Talks at Google — A Philosophy of Software Design](https://www.youtube.com/watch?v=bmSAYlu0NcY)

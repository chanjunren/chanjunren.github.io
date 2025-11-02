🗓️ 02112025 2330
📎

# implied_volatility

**Core Concept**: Implied volatility (IV) is the market's expectation of future price movement, directly affecting option premiums.

## Why It Matters

IV determines option prices independent of stock direction. High IV = expensive options, low IV = cheap options.

## When to Use

✅ **Use IV to:**
- Time option purchases (buy low IV)
- Time option sales (sell high IV)
- Compare relative expensiveness
- Avoid pre-earnings buying

❌ **Don't:**
- Ignore IV rank/percentile
- Buy high IV expecting it to stay high
- Sell low IV options for income

## IV vs Historical Volatility

**Historical volatility (HV)**: Past realized price movement (fact)  
**Implied volatility (IV)**: Future expected movement (forecast)

IV can be above or below HV. Gap indicates market pricing in events (earnings, FDA approval, etc.).

## Trade-offs

**High IV**: Expensive premiums (bad for buyers, good for sellers), mean reversion likely  
**Low IV**: Cheap premiums (good for buyers, bad for sellers), can stay low long-term

IV connects to [[options_greeks]] through vega and affects [[intrinsic_extrinsic_value]] extrinsic component.

## Quick Reference

**IV Rank (IVR)**: Where current IV sits in 52-week range  
Formula: `(Current IV - 52-week Low) / (52-week High - 52-week Low) × 100`

**IV Percentile (IVP)**: Percentage of days in past year IV was lower  
Example: 80 IVP = current IV higher than 80% of past year

| IV Rank | Strategy | Why |
|---------|----------|-----|
| **0-25%** | Buy options | Cheap premium, upside if IV rises |
| **25-50%** | Neutral | Average pricing |
| **50-75%** | Sell spreads | Elevated premium, benefit from IV contraction |
| **75-100%** | Sell options | Expensive premium, collect high theta |

**VIX (Volatility Index)**: Market-wide IV gauge (S&P 500 options)
- VIX < 15: Low volatility, complacency
- VIX 15-25: Normal range
- VIX > 25: Elevated fear, expensive options

## Examples

```ad-example
**Earnings IV crush:**

Before earnings:
- Stock: $100
- ATM Call: $5.00
- IV: 80% (IVR: 95%)

After earnings (stock stays at $100):
- ATM Call: $2.00
- IV: 40% (IVR: 50%)
- Loss: $3.00 per share ($300 per contract) despite no price move

Lesson: High IV priced in the move. Even correct direction can lose money.

**IV rank trading decision:**

**Stock A**: IV = 30%, IVR = 20% (low)  
→ Buy options (cheap, room for IV expansion)

**Stock B**: IV = 60%, IVR = 85% (high)  
→ Sell options (expensive, IV likely to contract)

**Volatility mean reversion:**

Tech stock normal IV: 40%

Event spike:
- Day 1: News hits, IV jumps to 80%
- Day 5: No new news, IV at 70%
- Day 10: IV at 55%
- Day 30: IV back to 45%

Mean reversion made long options lose value even if stock went your direction.
```

**Comparing strikes by IV:**

Stock: $100, 30 DTE

| Strike | Premium | IV | Note |
|--------|---------|-----|------|
| 95 Put | $2.00 | 35% | Normal IV |
| 90 Put | $1.50 | 45% | Volatility skew (higher) |
| 105 Call | $2.50 | 33% | Normal IV |

Lower strikes (puts) typically have higher IV due to crash risk (volatility skew).
\`\`\`

## References

- [VIX Index](https://www.cboe.com/tradable_products/vix/)
- "Volatility Trading" by Euan Sinclair
- [Market Chameleon IV Tools](https://marketchameleon.com/)


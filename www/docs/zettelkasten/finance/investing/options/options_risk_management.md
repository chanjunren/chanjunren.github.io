🗓️ 02112025 2330

# options_risk_management

**Core Concept**: Options risk management defines position sizing, loss limits, and exit rules to preserve capital.

## Why It Matters

Options can result in total loss. 90% of options expire worthless. Systematic risk management prevents account blow-up.

## When to Use

✅ **Always:**
- Before entering any trade
- When position moves against you
- At position review intervals
- During market regime changes

❌ **Never:**
- Trade without defined max loss
- Risk more than you can afford to lose
- Skip stop losses "just this once"

## Core Rules

**Position sizing**: Never risk more than 1-2% of account per trade  
Example: $50k account → Max $500-1,000 risk per trade

**Stop loss**: Exit at 50% loss of premium paid  
Don't "hope" options recover near expiration

**Win rate reality**: 30-40% is normal for directional trades  
Need 2:1 or 3:1 win:loss ratio to be profitable

**Portfolio allocation**: Max 5-10% of portfolio in options  
Rest in stocks/ETFs/cash

## Trade-offs

**Strict rules**: Fewer losses, lower stress, sustainable long-term  
**Loose rules**: Occasional big wins, frequent blow-ups, unsustainable

This builds on [[options_basics]] for understanding risk and connects to options_position_sizing for implementation.

## Quick Reference

| Risk Type         | Mitigation                      | Example                         |
|-------------------|---------------------------------|---------------------------------|
| **Total loss**    | Defined risk trades only        | Spreads vs naked calls          |
| **Time decay**    | Avoid < 30 DTE for long options | Buy 60-90 DTE minimum           |
| **IV crush**      | Check IVR before earnings       | Avoid buying > 80 IVR           |
| **Assignment**    | Monitor ITM short options       | Close or roll before expiration |
| **Concentration** | Max 3-5 positions at once       | Don't overtrade                 |
| **Liquidity**     | Trade liquid underlyings only   | Bid-ask spread < $0.10          |

**Red flags to avoid**:
- 0DTE or weekly options (high gamma risk)
- Illiquid stocks (wide spreads, hard to exit)
- Naked short options (unlimited loss potential)
- Revenge trading (emotional decisions)

**Checklist before entry**:
- [ ] Max loss defined and acceptable (< 2% account)
- [ ] IV rank checked (avoid extreme highs for buying)
- [ ] Liquidity adequate (volume > 100/day open interest)
- [ ] Exit plan documented (profit target + stop loss)
- [ ] Greeks reviewed (theta, delta make sense)

## Examples

```ad-example
**Position sizing calculation:**

Account: $50,000  
Risk tolerance: 1.5% per trade = $750

Trade: Buy AAPL 180 Call at $5.00  
Max loss per contract: $500

Max contracts: $750 / $500 = 1.5 → Buy 1 contract

Never: "This feels like a sure thing, I'll buy 5 contracts"  
That's $2,500 risk (5% of account) - too concentrated.

**Stop loss discipline:**

Entry: Buy SPY 450 Call for $8.00 ($800)  
Stop loss: 50% = $4.00 ($400)

Day 3: Option at $3.50  
→ Exit immediately, accept $450 loss

Day 7: Option expires worthless  
Lesson: Stop loss saved $350 (44% of position)

**Diversification across time:**

Wrong:
- 5 positions, all expiring same week
- Correlated risk (theta crush hits all at once)

Right:
- Position 1: 45 DTE
- Position 2: 60 DTE
- Position 3: 90 DTE
- Staggers theta decay and rolling opportunities
```

**Kelly Criterion for sizing:**

Formula: `f = (bp - q) / b`  
- b = win:loss ratio
- p = win probability
- q = loss probability

Example: 40% win rate, 2:1 win:loss  
f = (2 × 0.4 - 0.6) / 2 = 0.1 → Risk 10% of bankroll

But in options: Use 25-50% of Kelly (aggressive even)  
→ 2.5-5% per trade max

**Portfolio heat example:**

Account: $50,000

Current positions:
- Trade 1: $500 at risk (1%)
- Trade 2: $750 at risk (1.5%)
- Trade 3: $400 at risk (0.8%)

Total heat: $1,650 (3.3%)

Rule: If total heat > 5%, no new positions until one closes.
\`\`\`

## References

- "Trade Your Way to Financial Freedom" by Van Tharp (position sizing)
- [tastytrade: Risk Management](https://www.tastytrade.com/)
- "The New Trading for a Living" by Dr. Alexander Elder


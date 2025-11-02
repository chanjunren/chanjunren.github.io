🗓️ 02112025 2345
📎

# covered_call

**Core Concept**: Selling call options against owned stock generates income but caps upside at the strike price.

## Why It Matters

Covered calls are the safest options strategy (fully collateralized). Popular for income generation but can cause opportunity loss if stock rallies.

## When to Use

✅ **Use covered calls when:**
- Own stock, neutral to slightly bullish
- Want 1-3% monthly income
- Willing to sell stock at strike
- IV rank >50% (expensive premium)

❌ **Avoid when:**
- Expecting major rally
- IV rank < 25% (low premium)
- Stock approaching earnings (assignment risk)
- Emotionally attached to shares

## Strategy Mechanics

**Setup**: Own 100 shares, sell 1 call (usually OTM)  
**Max profit**: Strike - stock cost + premium  
**Max loss**: Stock to $0 (minus premium collected)  
**Breakeven**: Stock cost - premium

**Typical structure**: Sell 2-5% OTM, 30-45 DTE

## Trade-offs

**Pros**: Income generation, reduces cost basis, defined risk (own stock anyway)  
**Cons**: Caps upside, stock can be called away, taxable events

Covered calls combine [[options_basics]] selling with [[options_greeks]] theta collection.

## Quick Reference

**Position Greeks** (per contract):
- Delta: ~-0.30 (slightly reduces upside)
- Gamma: Negative (delta increases against you if stock rises)
- Theta: Positive (collect ~$10-30/day)
- Vega: Negative (profit from IV drop)

**Strike selection guide**:

| Strike | Premium | Probability Called | Use Case |
|--------|---------|-------------------|----------|
| **ATM** | High | 50% | Max income, willing to sell |
| **2% OTM** | Medium | 30% | Balanced approach |
| **5% OTM** | Low | 15% | Keep shares, some income |

**Rolling mechanics**:
If stock approaches strike (don't want assignment):
1. Buy back current call
2. Sell further OTM or later expiration
3. Net credit or small debit to keep stock

## Examples

```ad-example
**Basic covered call income:**

Own: 100 AAPL shares at $180  
Sell: 185 Call, 45 DTE, collect $3.00 premium  
Income: $300 (1.7% return in 45 days = ~14% annualized)

Scenario 1: Stock stays below $185
- Keep stock + $300 premium
- Repeat next month

Scenario 2: Stock at $190 (above strike)
- Shares called away at $185
- Total profit: $5 stock gain + $3 premium = $8/share
- Left $5 on table but still 4.4% return

Scenario 3: Stock drops to $170
- Keep stock + $300 premium
- Paper loss: $1,000, offset by $300 = $700 net
- Premium cushions downside slightly

**Rolling to avoid assignment:**

Own: AAPL at $180  
Sold: 185 Call, 15 DTE, now worth $4.00 (stock at $186)

Don't want to sell:
- Buy back 185 Call for $4.00 (loss $1.00)
- Sell 190 Call, 45 DTE for $3.50
- Net debit: $0.50 ($50)
- Result: Keep shares, higher strike, more time

**Comparison: Hold vs Covered Call:**

Year 1 - Stock sideways at $100:
- Hold: 0% return
- Covered calls (12 months): ~12-15% from premiums

Year 2 - Stock rallies to $140 (+40%):
- Hold: 40% gain
- Covered calls: Called at $105 multiple times, maybe 15% total

Covered calls: Better in flat/slow markets, worse in strong rallies.
```

**Tax consideration:**

Own: Stock bought at $100, now $150 (long-term gain)  
Sell: 155 Call

If assigned:
- Sell at $155 + premium
- Triggers capital gains tax on $55/share
- May prefer to roll than realize gains

**Wheel strategy integration:**

Month 1: Sell cash-secured put at $95 (collect premium)  
Assigned: Now own stock at $95  
Month 2-6: Sell covered calls at $100 (collect premium)  
Called away: Sell stock at $100  
Repeat: Sell put again

Continuous premium collection by cycling between puts and calls.
\`\`\`

## References

- [Options Playbook: Covered Call](https://www.optionsplaybook.com/option-strategies/covered-call/)
- "The Covered Call Strategy" - CBOE white paper


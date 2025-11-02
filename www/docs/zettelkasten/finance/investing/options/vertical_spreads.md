🗓️ 02112025 2350
📎

# vertical_spreads

**Core Concept**: Buy and sell options at different strikes (same expiration) to reduce cost and define risk on both sides.

## Why It Matters

Spreads are more capital-efficient than single options, with capped risk and reward. Core strategy for consistent income and directional bets.

## When to Use

✅ **Use vertical spreads when:**
- Want directional exposure with less capital
- Defined risk on both sides
- IV rank >50% (sell expensive, buy cheaper)
- High probability trades (70-80% win rate)

❌ **Avoid when:**
- Expecting huge move (unlimited upside better)
- IV rank < 25% (poor risk/reward)
- Liquidity poor (wide spreads)

## Spread Types

**Bull call spread**: Buy lower strike call, sell higher strike call (debit)  
**Bear put spread**: Buy higher strike put, sell lower strike put (debit)  
**Bull put spread**: Sell higher strike put, buy lower strike put (credit)  
**Bear call spread**: Sell lower strike call, buy higher strike call (credit)

**Debit spreads**: Pay to enter, profit from directional move  
**Credit spreads**: Collect to enter, profit from theta + no move against you

## Trade-offs

**Pros**: Lower cost, defined risk, better win rate than naked options  
**Cons**: Capped profit, requires two trades (commissions), less liquid

Vertical spreads combine [[long_call]] and [[long_put]] with short options to reduce cost and capture [[options_greeks]] theta.

## Quick Reference

**Credit spread setup** (most popular):

| Metric | Bull Put Spread | Bear Call Spread |
|--------|----------------|------------------|
| **Bias** | Bullish/neutral | Bearish/neutral |
| **Sell strike** | Below current price | Above current price |
| **Width** | $5-10 typical | $5-10 typical |
| **Credit** | 20-33% of width | 20-33% of width |
| **Max profit** | Credit collected | Credit collected |
| **Max loss** | Width - credit | Width - credit |
| **Win rate** | 60-80% | 60-80% |

**Strike selection formula**:
- Sell at 0.30-0.40 delta (70% OTM probability)
- Buy 5-10 strikes further OTM (protection)
- Target credit: 1/3 of spread width

**Position sizing**: Risk 1-2% of account per trade  
Example: $50k account → Max $500-1,000 risk per spread

## Examples

```ad-example
**Bull put spread (credit spread):**

Stock: $105 (bullish outlook)  
Sell: 100 Put for $2.50 (0.35 delta)  
Buy: 95 Put for $1.00 (protection)  
Net credit: $1.50 ($150 per spread)  
Width: $5 ($500)

Max profit: $150 (if stock stays above $100)  
Max loss: $350 ($500 - $150)  
Breakeven: $98.50 ($100 - $1.50)  
Risk/reward: 2.3:1 (need 70% win rate)

Outcome 1: Stock at $105+ at expiration
- Both options expire worthless
- Keep $150 (30% return on $350 risk)

Outcome 2: Stock at $97 (below breakeven)
- Max loss: $350
- Put spread executed: Forced to buy at $100, sell at $95

**Bear call spread (credit spread):**

Stock: $100 (bearish outlook)  
Sell: 105 Call for $2.00  
Buy: 110 Call for $0.75  
Net credit: $1.25 ($125)  
Width: $5

Max profit: $125 (stock below $105)  
Max loss: $375 ($500 - $125)  
Breakeven: $106.25

Outcome: Stock stays at $100
- Keep $125 (33% ROI in 45 days)

**Bull call spread vs long call:**

Bullish on stock at $100, 45 DTE

Option A: Buy 100 Call for $5.00
- Cost: $500
- Max profit: Unlimited
- Max loss: $500
- Breakeven: $105

Option B: Buy 100 Call ($5), Sell 110 Call ($2)
- Cost: $300 (40% cheaper)
- Max profit: $700 (at $110+)
- Max loss: $300 (40% less risk)
- Breakeven: $103 (better)

Trade-off: Capped at 233% gain vs unlimited, but better risk/reward.
```

**Managing winners:**

Entry: Bull put spread, 45 DTE, $150 credit

Day 30: Captured 50% profit ($75)
- Option 1: Close early (take $75, free up capital)
- Option 2: Hold for full $150 (risk reversal)

Rule: Close at 50% profit to reduce risk and redeploy capital.

**Managing losers:**

Entry: Bear call spread, max loss $350

Position down $175 (50% max loss):
- Option 1: Close and take loss (avoid max loss)
- Option 2: Roll up and out (extend time, higher strikes)

Rolling: Sell 105/110 at loss, buy 110/115 spread for same or small credit

**Adjusting for earnings:**

Stock at $100, earnings in 2 weeks:

Before earnings: IV 80%, 100/95 put spread collecting $2.00  
After earnings: IV drops to 40%, spread worth $0.50  
Close early: $150 profit (75% max) in 2 weeks vs 45 days

High IV events = faster profits from volatility crush.
\`\`\`

## References

- [Options Playbook: Vertical Spreads](https://www.optionsplaybook.com/option-strategies/)
- "Option Spread Strategies" by Anthony Saliba
- tastytrade vertical spread guides


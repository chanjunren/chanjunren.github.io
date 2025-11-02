🗓️ 02112025 2345
📎

# long_put

**Core Concept**: Buying a put option gives the right to profit from stock price decreases with limited downside.

## Why It Matters

Puts provide leveraged downside exposure or portfolio insurance. More complex than calls due to volatility behavior (puts gain IV in crashes).

## When to Use

✅ **Use long puts when:**
- Bearish on stock, want leverage
- Portfolio hedging (protective puts)
- Anticipating market correction
- Less capital than shorting stock

❌ **Avoid when:**
- IV already elevated from fear (expensive)
- < 30 days to expiration (theta burn)
- Small expected down move
- Could use put spreads instead (cheaper)

## Strategy Mechanics

**Setup**: Buy put at strike ≥ 5% below current price  
**Max profit**: Strike - premium (limited by stock going to $0)  
**Max loss**: Premium paid  
**Breakeven**: Strike - premium paid

**Ideal conditions**: Falling stock, rising IV (fear), sufficient time

## Trade-offs

**Pros**: Capped risk, leveraged downside, portfolio insurance, benefits from volatility spikes  
**Cons**: Time decay, expensive during high IV, need correct timing + magnitude

Long puts mirror [[long_call]] but benefit from [[implied_volatility]] spikes during sell-offs.

## Quick Reference

**Position Greeks**:
- Delta: -0.30 to -0.70 (negative = profit from drops)
- Gamma: Positive (accelerates in your favor)
- Theta: Negative (daily decay)
- Vega: Positive (gains from volatility spike)

**Strike selection**:
- ATM puts: Balanced cost/protection
- OTM puts: Cheaper, crash insurance
- ITM puts: Expensive, higher delta

**Timing considerations**:
- Buy puts when VIX < 20 (cheaper)
- Avoid buying after 5%+ drop (IV already spiked)
- Use 60-90 DTE for breathing room

**Puts vs shorting stock**:

| Metric | Long Put | Short Stock |
|--------|----------|-------------|
| Max loss | Premium | Unlimited |
| Margin | No | Yes ($25k+) |
| IV benefit | Yes | No |
| Time decay | Yes (bad) | No |

## Examples

```ad-example
**Successful long put:**

Stock: $150  
Buy: 145 Put, 60 DTE, premium = $4.00  
Cost: $400  
Breakeven: $141

Stock drops to $130:
- Put now worth $16.00 (ITM + time value)
- Profit: $1,200 (300% gain)
- Stock loss: 13.3% vs put gain: 300%

**Protective put hedge:**

Portfolio: $50,000 in SPY at $450
Buy: 440 Put (2% OTM), 60 DTE, premium = $5.00

Insurance cost: $500 (1% of portfolio)

Market crashes to $400 (-11%):
- Portfolio loss: $5,500
- Put profit: ~$4,000 (440 - 400 - 5)
- Net loss: $1,500 (3% vs 11% unhedged)

Insurance cost worth it for sleep at night.

**Volatility spike benefit:**

Normal market:
- VIX: 15, SPY: $450
- 440 Put, 30 DTE: $3.00

Market correction:
- VIX spikes to 35, SPY: $445 (only -1%)
- Put now worth $8.00 (167% gain)
- IV expansion outweighed small stock drop

Puts uniquely benefit from fear even without large moves.
```

**Time decay vs directional gain:**

Buy: $100 Put on $105 stock, 45 DTE, $3.00 premium

Day 30: Stock at $100 (your target)
- Put worth $2.00 (33% loss despite being right)
- Intrinsic: $0, Extrinsic decayed from $3 to $2

Lesson: Need stock to move BEYOND breakeven ($97) to profit.

**Put spread alternative:**

Instead of: Buy 100 Put for $5.00 (cost $500)

Alternative: Buy 100 Put, Sell 90 Put for net $2.50
- Cost: $250 (50% cheaper)
- Max profit: $750 (vs unlimited for long put)
- Breakeven: $97.50 (vs $95)

Spreads trade max profit for lower cost and better breakeven.
\`\`\`

## References

- [Options Playbook: Long Put](https://www.optionsplaybook.com/option-strategies/long-put/)
- [CBOE: Protective Puts](https://www.cboe.com/education/strategies/protective-put/)


🗓️ 02112025 2350
📎

# iron_condor

**Core Concept**: Sell both a put spread and call spread (same expiration) to profit from range-bound stock movement.

## Why It Matters

Iron condors generate income from time decay and volatility contraction when stocks trade sideways. High probability strategy but small profit margins.

## When to Use

✅ **Use iron condors when:**
- Stock range-bound (low realized volatility)
- IV rank >50% (collect high premium)
- Neutral outlook, no directional bias
- Want defined risk income strategy

❌ **Avoid when:**
- Expecting breakout or breakdown
- Earnings approaching (IV spike risk)
- Low IV rank < 25% (poor premium)
- Trending market (one side tested)

## Strategy Mechanics

**Setup**: Sell OTM put spread + Sell OTM call spread  
**Max profit**: Total credit collected (if stock stays between short strikes)  
**Max loss**: Width of wider spread - credit  
**Breakeven**: Two points (short put - credit, short call + credit)

**Typical structure**: Both spreads same width, equidistant from stock price

## Trade-offs

**Pros**: High win rate (70-80%), non-directional, defined risk, double premium  
**Cons**: Small profit vs risk (1:3 typical), two breakevens to defend, four legs (commissions)

Iron condors combine two [[vertical_spreads]] to exploit [[options_greeks]] theta from both sides.

## Quick Reference

**Standard setup**:

| Component | Strike Position | Width |
|-----------|----------------|-------|
| **Buy put** | Furthest OTM | Protection |
| **Sell put** | Below stock (0.15-0.20 delta) | Income |
| **Sell call** | Above stock (0.15-0.20 delta) | Income |
| **Buy call** | Furthest OTM | Protection |

**Sizing guidelines**:
- Spread width: $5-10 typically
- Credit target: 20-33% of width
- Distance: 1-2 standard deviations OTM
- Days to expiration: 45-60 optimal

**Greeks profile**:
- Delta: ~0 (neutral)
- Theta: Large positive (earn daily)
- Vega: Large negative (profit from IV drop)
- Gamma: Negative (risk near short strikes)

## Examples

```ad-example
**Basic iron condor:**

Stock: $100 (range $95-105), 45 DTE

Sell: 95 Put for $1.00 (0.16 delta)  
Buy: 90 Put for $0.40 (protection)  
Sell: 105 Call for $1.10 (0.16 delta)  
Buy: 110 Call for $0.50 (protection)

Net credit: $1.20 ($120 per IC)  
Max profit: $120  
Max loss: $380 ($500 - $120)  
Breakevens: $93.80 and $106.20

Outcome 1: Stock stays $96-104
- All options expire worthless
- Keep $120 (31% ROI on $380 risk in 45 days)

Outcome 2: Stock rallies to $108
- Call side ITM, max loss $380
- Put side profits $60, but overwhelmed by call loss

**Managing tested side:**

Entry: 100 IC (95/90 put, 105/110 call), 45 DTE, $1.20 credit

Day 20: Stock at $103 (approaching call side)

Option 1: Close early
- Buy back IC for $2.00 loss ($0.80 loss vs $1.20 credit)
- Accept $80 loss, avoid max loss

Option 2: Roll call side up
- Close 105/110 call spread at loss
- Open 107/112 call spread for credit
- Widens profit range, extends trade

Option 3: Convert to iron butterfly
- Close put side at profit
- Roll call spread closer for credit
- Reduces risk, needs mean reversion

**Volatility crush example:**

Before earnings: Stock $100, IV 80%, 45 DTE

Sell IC: 90/85 put, 110/115 call for $3.00 credit (high IV)

After earnings: Stock moves to $105 (tested call side)
- IV drops to 40%
- IC now worth $1.50 (50% profit despite adverse move)
- Vega profit offset directional loss

High IV environments cushion directional risk.
```

**Comparison: Iron condor vs covered call:**

Capital: $10,000

Covered call:
- Buy 100 shares at $100 = $10,000
- Sell 105 call for $1.50
- Income: $150/month (~1.5%)
- Risk: Full downside to $0

Iron condor:
- 10 ICs at $1.20 credit = $1,200 income
- Capital at risk: $3,800 (max loss per IC $380 × 10)
- Income: $1,200 on $3,800 risk (31% potential)
- Risk: Defined to $2,600 total

ICs offer higher capital efficiency but active management required.

**Strike width trade-off:**

Narrow spread ($5 width):
- Credit: $1.00
- Max loss: $4.00
- Win rate: 75%
- Risk/reward: 4:1

Wide spread ($10 width):
- Credit: $2.50
- Max loss: $7.50
- Win rate: 85%
- Risk/reward: 3:1

Wider spreads = higher win rate but worse risk/reward.
\`\`\`

## References

- [Options Playbook: Iron Condor](https://www.optionsplaybook.com/option-strategies/iron-condor/)
- "The Complete Guide to Iron Condors" by Michael Benklifa
- tastytrade Iron Condor mechanics


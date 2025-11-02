🗓️ 02112025 2345
📎

# long_call

**Core Concept**: Buying a call option gives the right to profit from stock price increases with limited downside.

## Why It Matters

Calls provide leveraged upside exposure for fraction of stock cost. Common first options trade but time decay can cause losses even if directionally correct.

## When to Use

✅ **Use long calls when:**
- Bullish on stock, want leverage
- Limited capital vs buying stock
- Defined max loss requirement
- Time horizon 45-90 days minimum

❌ **Avoid when:**
- IV rank >75% (expensive premium)
- < 30 days to expiration (theta too high)
- Small expected move (theta erodes faster)
- Stock pays dividend soon (may drop)

## Strategy Mechanics

**Setup**: Buy call at strike ≤ 5% OTM  
**Max profit**: Unlimited (stock - strike - premium)  
**Max loss**: Premium paid (100% loss if expires OTM)  
**Breakeven**: Strike + premium paid

**Ideal conditions**: Rising stock, rising/stable IV, time on your side

## Trade-offs

**Pros**: Capped risk, unlimited upside, leverage (10-20x stock move)  
**Cons**: Time decay, total loss potential, need to be right on direction AND timing

Long calls demonstrate [[options_basics]] mechanics and rely on [[options_greeks]] delta/theta dynamics.

## Quick Reference

**Position Greeks**:
- Delta: +0.30 to +0.70 (ATM best)
- Gamma: Positive (accelerates with winning moves)
- Theta: Negative (lose ~1-3% value/day near expiration)
- Vega: Positive (benefit from IV rise)

**Risk management**:
- Max position size: 1-2% of account per trade
- Stop loss: Exit at 50% premium loss
- Profit target: 50-100% gain (2x premium)
- Time stop: Close if < 21 DTE and not ITM

**Strike selection**:
- ATM (highest probability): 50% delta
- Slightly OTM: 30-40% delta (cheaper, lower probability)
- ITM: 70%+ delta (expensive, stock-like behavior)

## Examples

```ad-example
**Successful long call:**

Stock: $100  
Buy: 105 Call, 60 DTE, premium = $3.00  
Cost: $300  
Breakeven: $108

30 days later, stock at $112:
- Call now worth $8.50 (ITM + time value)
- Profit: $550 (183% gain)
- Stock gain: 12% vs option gain: 183%

**Time decay scenario:**

Stock: $100  
Buy: 100 Call, 45 DTE, premium = $5.00

Stock stays at $100 (no movement):
- Day 15: Call worth $3.50 (30% loss)
- Day 30: Call worth $2.00 (60% loss)
- Expiration: Call worth $0 (100% loss)

Lesson: Correct direction not enough - need magnitude + timing.

**IV crush example:**

Before earnings:
- Stock: $100, IV: 80%
- Buy 105 Call, 30 DTE, premium = $6.00

After earnings, stock moves to $107 (bullish):
- IV drops to 40%
- Call worth $4.00 (33% loss despite profitable move)

Vega loss exceeded delta gain. Never buy options before earnings.
```

**Comparison: Stock vs Call leverage:**

Scenario: Stock moves from $100 to $115 (+15%)

**Buying stock:**
- Investment: $10,000 (100 shares)
- Profit: $1,500 (15% return)

**Buying calls:**
- Investment: $3,000 (10 contracts, $3.00 each)
- 105 Calls now worth ~$11.00 each
- Profit: $8,000 (267% return)
- Capital efficiency: 18x better

But if stock goes to $95:
- Stock loss: $500 (5% loss, can hold)
- Call loss: $3,000 (100% loss, expired worthless)
\`\`\`

## References

- [Options Playbook: Long Call](https://www.optionsplaybook.com/option-strategies/long-call/)
- "Trading Options Greeks" by Dan Passarelli


🗓️ 02112025 2350
📎

# calendar_spreads

**Core Concept**: Sell near-term option, buy longer-term option (same strike) to profit from faster theta decay of short option.

## Why It Matters

Calendar spreads isolate time decay while minimizing directional risk. Profit when stock stays near strike and near-term volatility decreases.

## When to Use

✅ **Use calendar spreads when:**
- Stock expected to stay flat short-term
- Near-term IV > long-term IV (sell expensive, buy cheap)
- Want theta strategy with less directional risk
- After earnings (sell post-earnings, buy pre-earnings)

❌ **Avoid when:**
- Expecting large move either direction
- Both expirations have similar IV
- Low liquidity in either expiration
- Don't understand vega impact

## Strategy Mechanics

**Setup**: Sell option (30-45 DTE), buy option (60-90 DTE), same strike  
**Max profit**: When stock = strike at front-month expiration  
**Max loss**: Net debit paid (if stock moves far from strike)  
**Breakeven**: Complex (depends on IV and time)

**Ideal outcome**: Short option expires worthless, long option retains value

## Trade-offs

**Pros**: Lower directional risk, profits from theta differential, benefits from IV skew  
**Cons**: Complex to manage, vega-sensitive, limited profit potential, requires two adjustments

Calendar spreads exploit [[options_greeks]] theta difference and [[options_expiration]] timing.

## Quick Reference

**Position Greeks**:
- Delta: Near-zero (neutral)
- Gamma: Negative (risk if stock moves)
- Theta: Positive (front-month decays faster)
- Vega: Positive for back month, negative for front (complex)

**Setup guidelines**:

| Component | Details |
|-----------|---------|
| **Strike** | ATM or slightly OTM |
| **Short exp** | 30-45 DTE |
| **Long exp** | 60-90 DTE |
| **Cost** | $1-3 typical debit |
| **Target profit** | 25-50% of debit |

**Vega considerations**:
- Front month IV drop = profit (short option loses value)
- Back month IV rise = profit (long option gains value)
- Best when term structure inverted (near>far IV)

**Management**:
- Close at 25% profit (theta captured)
- Roll or close if stock moves >5% from strike
- After front expires: Sell next month against long

## Examples

```ad-example
**Standard calendar spread:**

Stock: $100 (neutral outlook)

Sell: 100 Call (30 DTE) for $3.00  
Buy: 100 Call (60 DTE) for $5.00  
Net debit: $2.00 ($200)

At 30-day expiration (short expires):

Scenario 1: Stock at $100 (ideal)
- Short call expires worthless: +$3.00
- Long call worth ~$3.50: -$1.50 loss from decay
- Net profit: ~$1.50 (75% gain)

Scenario 2: Stock at $110
- Short call: -$10.00 intrinsic
- Long call: ~$12.00 value
- Net: Small loss (moves hurt calendars)

Scenario 3: Stock at $95
- Both calls OTM
- Loss: ~$1.50 (both decayed, not optimal)

**Post-earnings calendar:**

Before earnings: Stock $100, front month IV 80%, back month IV 50%

Setup (day before earnings):
- Sell 100 Call (7 DTE, through earnings) for $5.00
- Buy 100 Call (37 DTE, after earnings) for $6.00
- Debit: $1.00

After earnings: Stock at $102, IVs collapse

- Front month (post-crush): $2.50
- Back month: $5.00
- Close spread for $2.50
- Profit: $1.50 (150% gain) from IV crush

**Rolling to next cycle:**

Original setup:
- Sold 30 DTE, bought 60 DTE

At 30 days (front expired worthless):
- Own 30 DTE call worth $3.00
- Sell 30 DTE call (now front) for $2.50
- Debit: $0.50 to maintain
- Collected: $3.00 from first short - $0.50 = $2.50 profit

Can repeat 2-3 times per long option.
```

**Diagonal spread variation:**

Instead of same strike, use different strikes:

Sell: 105 Call (30 DTE) for $2.00  
Buy: 100 Call (60 DTE) for $5.00  
Debit: $3.00

Benefits:
- More directional (delta positive)
- Cheaper debit (sell higher strike)
- More flexibility

Trade-off: Less pure theta play, more directional risk

**Vega risk example:**

Calendar setup: $2.00 debit

Market volatility spike (VIX +10 points):
- Front month IV: 40% → 60%
- Back month IV: 30% → 45%

Both gain value but front gains more (shorter time):
- Spread value drops to $1.50 (loss)
- Vega risk: Front month vega > back month vega short-term

Calendars can lose in volatility spikes despite being "vega positive."
\`\`\`

## References

- [Options Playbook: Calendar Spread](https://www.optionsplaybook.com/option-strategies/long-call-calendar-spread/)
- "Trading Options Greeks" by Dan Passarelli (chapter on calendars)
- tastytrade calendar spread mechanics


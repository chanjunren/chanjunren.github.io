🗓️ 02112025 2350
📎

# diagonal_spreads

**Core Concept**: Sell near-term option at one strike, buy longer-term option at different strike to combine directional bias with time decay advantage.

## Why It Matters

Diagonal spreads blend calendar spread theta advantage with directional exposure. More flexible than pure calendars but more complex to manage.

## When to Use

✅ **Use diagonal spreads when:**
- Moderately bullish/bearish with time
- Want theta collection + directional edge
- Rolling [[covered_call]] or [[cash_secured_put]]
- Near-term IV elevated vs long-term

❌ **Avoid when:**
- Strongly directional (use vertical spread instead)
- Low IV differential between expirations
- Beginner (start with verticals or calendars)
- Don't understand combined risks

## Strategy Mechanics

**Setup**: Sell OTM near-term, buy ITM or ATM long-term (different strikes, different expirations)

**Bull diagonal**: Buy lower long-term call, sell higher short-term call  
**Bear diagonal**: Buy higher long-term put, sell lower short-term put

**Max profit**: Complex (depends on final stock price and back-month value)  
**Max loss**: Net debit (if stock moves far against position)

## Trade-offs

**Pros**: Directional profit + theta collection, rollable for continuous income, better than pure calendar for trending stocks  
**Cons**: Complex adjustments, two expiration dates, profits less defined, requires active management

Diagonal spreads combine [[calendar_spreads]] time advantage with [[vertical_spreads]] directional bias.

## Quick Reference

**Bull diagonal setup**:

| Component | Selection |
|-----------|-----------|
| **Buy** | ATM/ITM call, 60-90 DTE |
| **Sell** | 5-10% OTM call, 30-45 DTE |
| **Delta** | Net +0.30 to +0.50 (bullish) |
| **Cost** | $2-5 typical debit |
| **Goal** | Short expires worthless, roll to next month |

**Bear diagonal setup**:
- Buy ATM/ITM put (60-90 DTE)
- Sell 5-10% OTM put (30-45 DTE)
- Net delta: -0.30 to -0.50

**Management strategy**:
1. Front month expires worthless → Roll to next month
2. Stock approaches short strike → Roll out and/or up
3. Back month < 30 DTE → Take profit or roll to next cycle
4. Target: 25-40% profit on debit

## Examples

```ad-example
**Bull diagonal spread:**

Stock: $100 (moderately bullish)

Buy: 100 Call (60 DTE) for $6.00  
Sell: 105 Call (30 DTE) for $2.50  
Net debit: $3.50 ($350)  
Net delta: +0.40 (bullish exposure)

Scenario 1: Stock at $103 at front expiration
- Short 105 call expires worthless: +$2.50
- Long 100 call worth ~$5.50
- Close for $5.50
- Profit: $2.00 (57% gain)

Scenario 2: Stock at $108 (above short strike)
- Short 105 call: -$3.00 intrinsic
- Long 100 call: ~$9.00
- Net: $6.00 value
- Profit: $2.50 (71% gain)
- Or roll short to 110 for additional credit

Scenario 3: Stock at $95
- Both OTM but long has more time
- Value: ~$2.50
- Loss: $1.00 (29% loss)

**Rolling strategy (PMCC - Poor Man's Covered Call):**

Month 1:
- Buy 100 Call (90 DTE) for $12.00
- Sell 110 Call (30 DTE) for $3.00
- Debit: $9.00

Day 30: Stock at $107, short expires worthless
- Collected $3.00, long worth $11.00

Month 2:
- Sell 112 Call (30 DTE) for $2.50
- Total collected: $5.50
- Cost basis: $6.50 ($12 - $5.50)

Month 3:
- Sell 115 Call (30 DTE) for $2.00
- Total collected: $7.50
- Cost basis: $4.50

After 90 days: Turned $12 long call into $4.50 cost through rolling.
```

**Diagonal vs vertical vs calendar:**

Stock: $100, bullish view, 60 days

**Vertical spread (bull call):**
- Buy 100 Call (60 DTE): $5.00
- Sell 110 Call (60 DTE): $2.00
- Cost: $3.00
- Max profit: $7.00 (at $110+)
- Risk/reward: 2.3:1

**Calendar spread:**
- Buy 100 Call (60 DTE): $5.00
- Sell 100 Call (30 DTE): $3.00
- Cost: $2.00
- Max profit: ~$1.50 (stock at $100 at 30d)
- Neutral bias

**Diagonal spread:**
- Buy 100 Call (60 DTE): $5.00
- Sell 105 Call (30 DTE): $2.50
- Cost: $2.50
- Max profit: Variable ($2-4 range)
- Bullish bias + theta collection

Diagonal = middle ground between directional and theta trade

**PMCC (Poor Man's Covered Call) example:**

Alternative to covered call:

Traditional covered call:
- Buy 100 shares at $100 = $10,000
- Sell monthly calls for $200/month
- Income: 2.4% monthly on $10,000

PMCC:
- Buy 80 Call (90 DTE, deep ITM) for $22.00 = $2,200
- Sell 105 Call (30 DTE) for $2.00 monthly
- Income: $200 on $2,000 capital (10% monthly)
- Risk: If stock below $80, loss greater than covered call

Same income, 78% less capital, but higher risk in crashes.
\`\`\`

## References

- [Options Playbook: Diagonal Spread](https://www.optionsplaybook.com/option-strategies/long-call-diagonal-spread/)
- "Trading Options as a Professional" by James Bittman
- r/thetagang PMCC guides


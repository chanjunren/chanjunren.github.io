🗓️ 02112025 2345
📎

# cash_secured_put

**Core Concept**: Selling put options while holding cash to buy stock if assigned, generating income or acquiring shares at discount.

## Why It Matters

Cash-secured puts let you get paid to wait for better entry prices. Same risk as owning stock but with income cushion.

## When to Use

✅ **Use cash-secured puts when:**
- Want to buy stock but think it's too expensive
- Willing to own at strike price
- IV rank >50% (high premium)
- Have cash set aside for assignment

❌ **Avoid when:**
- Don't actually want the stock
- Can't afford assignment ($10k-50k per contract)
- Stock in downtrend (catching falling knife)
- IV too low (premium not worth risk)

## Strategy Mechanics

**Setup**: Sell put at desired buy price, keep cash for assignment  
**Max profit**: Premium collected (if stock stays above strike)  
**Max loss**: Strike - premium (if stock goes to $0)  
**Breakeven**: Strike - premium

**Cash required**: Strike × 100 shares (e.g., $100 strike = $10,000)

## Trade-offs

**Pros**: Get paid to wait, lower effective buy price, defined risk  
**Cons**: Ties up capital, miss bigger opportunities, unlimited downside (to $0)

Cash-secured puts are the flip side of [[covered_call]] and demonstrate selling premium via [[options_greeks]] theta.

## Quick Reference

**Position Greeks**:
- Delta: +0.30 to +0.50 (positive = bullish exposure)
- Gamma: Negative (risk increases if stock drops)
- Theta: Positive (earn ~$10-30/day)
- Vega: Negative (profit from IV decrease)

**Strike selection**:

| Strike vs Stock | Premium | Use Case |
|----------------|---------|----------|
| **ATM** | Highest | Neutral, likely assignment |
| **5% OTM** | Medium | Target buy price |
| **10% OTM** | Lower | Conservative, unlikely assignment |

**Assignment management**:
- If assigned: Now own stock, can sell covered calls
- Before expiration: Roll down/out for credit
- Avoid assignment: Buy back put before expiration

**Wheel strategy**: Alternate between cash-secured puts and [[covered_call]] for continuous income.

## Examples

```ad-example
**Successful cash-secured put:**

Stock: $105  
Sell: 100 Put, 45 DTE, collect $2.50 premium  
Cash reserved: $10,000

Scenario 1: Stock stays above $100 at expiration
- Keep $250 premium (2.5% return in 45 days)
- Repeat next month (potential 20%+ annual)

Scenario 2: Stock drops to $95, assigned
- Buy 100 shares at $100
- Effective cost: $97.50 ($100 - $2.50 premium)
- Stock now at $95 = $2.50 paper loss vs $5 if bought at $100
- Premium cushioned downside by 50%

Scenario 3: Stock drops to $85
- Forced to buy at $100
- Effective cost: $97.50
- Current loss: $12.50/share ($1,250)
- But sell covered calls to reduce basis further

**Rolling to avoid assignment:**

Sold: 100 Put, 7 DTE, stock at $96 (ITM, likely assigned)

Don't want assignment yet:
- Buy back 100 Put for $4.50
- Sell 95 Put, 45 DTE for $3.50
- Net debit: $1.00 ($100)
- Result: Lower strike, more time, delay decision

**Comparison: Buy stock vs Sell put:**

Stock at $100, want to buy at $95:

Option A: Place limit order at $95
- Wait indefinitely
- No income while waiting
- May never fill

Option B: Sell 95 Put for $2.00
- Collect $200 immediately
- If drops to $95: Buy at effective $93
- If stays above $95: Keep premium, try again

Option B generates income while waiting.
```

**Wheel strategy complete cycle:**

Starting capital: $10,000

Step 1: Sell 100 Put for $2.00 (45 DTE)
- Collect $200, stock stays above 100
- New capital: $10,200

Step 2: Sell 100 Put for $2.50
- Assigned at $100, effective $97.50
- Own 100 shares

Step 3: Sell 105 Covered Call for $2.00
- Stock called away at $105
- Profit: $5 stock + $2 call + $2.50 put = $9.50 total

Step 4: Back to cash, repeat
- Capital now: $10,950 (9.5% return over 3 months)

**Tax efficiency:**

Sell: 100 Put for $2.50 premium (short-term income)

If expires worthless:
- $250 taxed as short-term capital gains (high rate)

If assigned:
- Premium reduces cost basis ($100 - $2.50 = $97.50)
- Capital gain taxed when eventually sell shares
- Can defer taxes by holding shares

Assignment can be more tax-efficient than expiring worthless.
\`\`\`

## References

- [Options Playbook: Cash-Secured Put](https://www.optionsplaybook.com/option-strategies/cash-secured-put/)
- "Selling Puts for Income" - tastytrade guide


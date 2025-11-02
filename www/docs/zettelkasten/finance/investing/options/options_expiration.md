🗓️ 02112025 2345
📎

# options_expiration

**Core Concept**: Options expire on a specific date, forcing settlement through exercise, assignment, or worthless expiry.

## Why It Matters

Expiration determines when you must act. Mismanaging expiration leads to unwanted stock positions or total loss.

## When to Use

✅ **Manage expiration when:**
- ITM options may be assigned
- Rolling positions before expiry
- Avoiding exercise on illiquid options
- Planning exits before final week

❌ **Don't:**
- Hold through expiration expecting extension
- Ignore ITM short options (assignment risk)
- Trade 0DTE without understanding gamma risk

## Expiration Types

**Standard monthly**: Third Friday of month (most liquid)  
**Weekly**: Every Friday (higher theta, more volatile)  
**Quarterly**: End of March, June, Sept, Dec (LEAPS)

**Expiration time**: 4pm ET on expiration date  
**Exercise deadline**: 5:30pm ET (varies by broker)

## Settlement Outcomes

**ITM options**: Usually auto-exercised (>$0.01 intrinsic)  
**OTM options**: Expire worthless  
**Short options**: May be assigned if counterparty exercises

## Trade-offs

**Pros**: Forces discipline, creates opportunities (theta decay sellers win)  
**Cons**: Time pressure, forced decisions, assignment risk

Expiration connects to [[options_greeks]] through theta acceleration and [[options_basics]] for exercise mechanics.

## Quick Reference

| Days to Expiration | Theta Behavior | Strategy                |
|--------------------|----------------|-------------------------|
| **90+ DTE**        | Slow decay     | Buy options here        |
| **45-60 DTE**      | Moderate decay | Optimal entry for most  |
| **30-45 DTE**      | Accelerating   | Sell options here       |
| **< 30 DTE**       | Rapid decay    | Avoid buying            |
| **< 7 DTE**        | Extreme decay  | Close or roll positions |
| **0 DTE**          | Max gamma risk | Expert only             |

**Assignment risk**: ITM options may be assigned early if:
- Deep ITM (>$5 intrinsic)
- Ex-dividend date approaching
- Hard-to-borrow stock

**Auto-exercise threshold**: Most brokers exercise if >$0.01 ITM at expiration

## Examples

```ad-example
**Theta decay timeline:**

90 DTE: $100 call worth $8.00
- Daily decay: ~$0.05/day
- Weekly decay: ~$0.35

45 DTE: Same call now $5.00
- Daily decay: ~$0.10/day
- Weekly decay: ~$0.70

15 DTE: Call now $2.00
- Daily decay: ~$0.15/day
- Weekly decay: ~$1.05

3 DTE: Call at $0.50
- Daily decay: ~$0.15-0.20/day (most lost)

**Assignment scenario:**

You sold: SPY 450 Put, stock at $448 (ITM)  
Expiration Friday:

Option 1: Close position Thursday
- Buy back put for $2.00 loss
- Avoid assignment

Option 2: Let expire
- Assigned 100 shares at $450 = $45,000 commitment
- Stock worth $44,800
- Now holding stock (may not want)

**Rolling to avoid expiration:**

Position: Long AAPL 180 Call, 7 DTE, stock at $185
Current value: $6.00

Option 1: Take profit
- Sell at $6.00, realize $600 gain

Option 2: Roll out
- Sell 180 Call (7 DTE) for $6.00
- Buy 180 Call (37 DTE) for $8.00
- Net cost: $2.00 to extend 30 days
```

**0DTE gamma risk:**

SPY at $450, 0DTE 450 Call at $0.50
- Delta: 0.50, Gamma: 0.80 (extreme)

SPY moves to $451 (+$1):
- Delta jumps to 0.90 (gamma effect)
- Option now $1.50 (3x gain)

SPY moves to $449 (-$1):
- Delta drops to 0.10
- Option now $0.05 (90% loss)

0DTE options have explosive gamma - extreme winners or losers.
\`\`\`

## References

- [CBOE Expiration Calendar](https://www.cboe.com/about/holiday-calendar/)
- "The Option Trader's Hedge Fund" by Mark Sebastian


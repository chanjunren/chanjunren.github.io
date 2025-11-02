🗓️ 02112025 2330
📎

# options_basics

**Core Concept**: Options are contracts giving the right (not obligation) to buy or sell stock at a specific price before expiration.

## Why It Matters

Options provide leverage and flexibility but introduce time decay and complexity. Understanding the fundamentals prevents costly errors.

## When to Use

✅ **Use options when:**
- Want leverage without buying full stock position
- Need portfolio insurance (protective puts)
- Generate income on existing holdings (covered calls)
- Defined risk requirement (max loss known upfront)

❌ **Avoid when:**
- Don't understand the risks
- Can't monitor positions regularly
- Undercapitalized (need $2k-25k for margin)

## Core Components

**Call option**: Right to BUY stock at strike price  
**Put option**: Right to SELL stock at strike price

**Premium**: Price paid for the option contract  
**Strike price**: Agreed transaction price  
**Expiration date**: Last day option is valid  
**Contract size**: 100 shares per contract

## Trade-offs

**Pros**: Leverage, defined risk, income generation, portfolio hedging  
**Cons**: Time decay, complexity, total loss potential, requires active management

Options pricing builds on [[intrinsic_extrinsic_value]] and [[options_greeks]].

## Quick Reference

| Term | Definition | Example |
|------|------------|---------|
| **ITM** | In-the-money (has intrinsic value) | $50 call, stock at $55 |
| **ATM** | At-the-money (strike ≈ stock price) | $50 call, stock at $50 |
| **OTM** | Out-of-the-money (only extrinsic value) | $50 call, stock at $45 |
| **Long** | Buying option (pay premium) | Bullish call, bearish put |
| **Short** | Selling option (receive premium) | Bearish call, bullish put |

**Contract notation**: TICKER YYMMDD C/P STRIKE  
Example: AAPL 250117 C 180 = Apple Jan 17, 2025 $180 Call

**P&L formulas**:
```
Long Call Profit = (Stock Price - Strike - Premium) × 100
Long Put Profit = (Strike - Stock Price - Premium) × 100
Max Loss (Long) = Premium Paid × 100
```

## Examples

```ad-example
**Long call scenario:**

You buy: AAPL 250117 C 180 for $5.00 premium  
Cost: $500 ($5 × 100 shares)

**At expiration:**
- Stock at $190: Profit = ($190 - $180 - $5) × 100 = $500
- Stock at $185: Break-even (intrinsic value = premium paid)
- Stock at $175: Loss = $500 (premium lost, option expires worthless)

**Long put scenario:**

You buy: AAPL 250117 P 180 for $4.00 premium  
Cost: $400

**At expiration:**
- Stock at $170: Profit = ($180 - $170 - $4) × 100 = $600
- Stock at $176: Break-even
- Stock at $185: Loss = $400 (premium lost)
```

**Covered call scenario:**

You own 100 AAPL shares at $180, sell 180 call for $3 premium  
Income: $300 collected immediately

**Outcomes:**
- Stock stays below $180: Keep shares + $300 premium
- Stock above $180: Shares called away at $180, keep $300 premium
- Effective sale price: $183 ($180 strike + $3 premium)
\`\`\`

## References

- [CBOE Options Basics](https://www.cboe.com/education/options-basics/)
- "The Options Playbook" by Brian Overby


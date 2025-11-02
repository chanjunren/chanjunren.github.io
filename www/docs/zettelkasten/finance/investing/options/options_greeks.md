🗓️ 02112025 2330
📎

# options_greeks

**Core Concept**: Greeks measure how options prices change with different variables (price, time, volatility).

## Why It Matters

Greeks predict P&L and risk. Without understanding them, you're trading blind.

## When to Use

✅ **Use Greeks to:**
- Estimate profit/loss scenarios
- Compare strategies
- Hedge positions
- Time entries/exits

❌ **Don't:**
- Ignore them in multi-leg trades
- Trade without checking theta decay
- Forget they change as price moves

## The Five Greeks

**Delta (Δ)**: Price sensitivity  
- Measures: How much option price changes per $1 stock move
- Range: 0 to 1 (calls), 0 to -1 (puts)
- ATM options ≈ 0.5 delta

**Gamma (Γ)**: Delta sensitivity  
- Measures: How much delta changes per $1 stock move
- Highest at ATM, accelerates near expiration
- Risk metric for short options

**Theta (Θ)**: Time decay  
- Measures: Daily option value loss from time passing
- Always negative for long options
- Accelerates in final 30-45 days

**Vega (ν)**: Volatility sensitivity  
- Measures: Price change per 1% implied volatility move
- Highest for ATM options
- Long options benefit from rising IV

**Rho (ρ)**: Interest rate sensitivity  
- Measures: Price change per 1% interest rate change
- Usually negligible for short-term options

## Trade-offs

**Pros**: Quantifies risk, enables comparison, predicts scenarios  
**Cons**: Changes constantly (requires monitoring), approximations not guarantees

Greeks connect to [[options_basics]] for understanding how premium is built and [[implied_volatility]] for vega impact.

## Quick Reference

| Greek | Long Call | Long Put | What It Means |
|-------|-----------|----------|---------------|
| **Delta** | +0.5 (ATM) | -0.5 (ATM) | 50% chance of being ITM |
| **Gamma** | + | + | Delta accelerates as stock moves |
| **Theta** | - | - | Lose value daily (~$10-50/day) |
| **Vega** | + | + | Benefit from volatility spike |

**Delta as probability**: 0.30 delta ≈ 30% chance of expiring ITM

**Portfolio Greeks**: Sum individual position Greeks for net exposure

**Key relationships**:
```
High gamma = Unstable delta (good for long, risky for short)
High theta = Fast decay (bad for long, good for short)
High vega = IV sensitive (volatile premium swings)
```

## Examples

```ad-example
**Delta scenario:**

Stock: $100  
ATM Call (100 strike): Delta = 0.50

Stock moves to $101 (+$1):
- Option gains ~$0.50 (50% of stock move)

Stock moves to $105 (+$5):
- Option gains ~$2.50 initially
- But delta increases (gamma effect), actual gain might be $3.00

**Theta decay acceleration:**

45 DTE (Days to Expiration):
- Option worth $5.00, theta = -0.05 ($5/day loss)

15 DTE:
- Option worth $2.00, theta = -0.10 ($10/day loss)
- Decay accelerates as expiration nears

**Gamma risk on short options:**

Sell OTM call at 0.20 delta ($105 strike, stock at $100)  
Collect $200 premium

Stock gaps to $108:
- Delta was 0.20, now 0.75 (gamma increased delta)
- Loss: ~$300 (more than premium collected)
- Gamma hurt because delta accelerated against you
```

**Vega in earnings:**

Before earnings:
- 100 strike call: $3.00, IV = 50%, vega = 0.15

After earnings (no stock move, IV drops to 30%):
- IV drops 20 points × 0.15 vega = $3.00 loss
- Option now worth $0.00 (vega crush)
\`\`\`

## References

- [The Options Guide: Greeks](https://www.theoptionsguide.com/the-greeks.aspx)
- "Options Greeks Explained" - tastytrade videos


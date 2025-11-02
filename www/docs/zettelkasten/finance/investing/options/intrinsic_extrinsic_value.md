🗓️ 02112025 2330
📎

# intrinsic_extrinsic_value

**Core Concept**: Option premium = intrinsic value (profit if exercised now) + extrinsic value (time + volatility).

## Why It Matters

Understanding value composition explains why options decay and how to evaluate fair pricing.

## When to Use

✅ **Analyze when:**
- Comparing strikes
- Evaluating early exercise
- Choosing expiration dates
- Assessing if option is expensive

❌ **Don't:**
- Ignore extrinsic value when close to expiration
- Buy high extrinsic value in low-volatility stocks

## Key Formulas

**Intrinsic value (calls)**: Max(Stock Price - Strike, 0)  
**Intrinsic value (puts)**: Max(Strike - Stock Price, 0)  
**Extrinsic value**: Option Premium - Intrinsic Value

**ITM options**: Have intrinsic value  
**OTM options**: 100% extrinsic value (pure time/volatility premium)

## Trade-offs

**Intrinsic value**: Real profit, stable, doesn't decay  
**Extrinsic value**: Pays for time and uncertainty, decays to $0 at expiration

This concept is foundational to [[options_basics]] and explains the theta decay in [[options_greeks]].

## Quick Reference

| Scenario | Stock | Strike | Premium | Intrinsic | Extrinsic |
|----------|-------|--------|---------|-----------|-----------|
| **ITM Call** | $110 | $100 | $12.00 | $10.00 | $2.00 |
| **ATM Call** | $100 | $100 | $3.00 | $0.00 | $3.00 |
| **OTM Call** | $95 | $100 | $0.50 | $0.00 | $0.50 |
| **ITM Put** | $90 | $100 | $11.00 | $10.00 | $1.00 |

**Value decay timeline**:
```
90 DTE: 70% extrinsic, 30% intrinsic
45 DTE: 50% extrinsic, 50% intrinsic
15 DTE: 20% extrinsic, 80% intrinsic (ITM options)
0 DTE: 0% extrinsic, 100% intrinsic
```

## Examples

```ad-example
**Call option value breakdown:**

Stock: $105  
110 Call trading at $2.50 (OTM)

- Intrinsic value: $0 (stock below strike)
- Extrinsic value: $2.50 (all time value)

Stock moves to $112:
- Intrinsic value: $2.00 ($112 - $110)
- Option now trading at $4.50
- Extrinsic value: $2.50 ($4.50 - $2.00)

Note: Extrinsic stayed same, intrinsic added

**Time decay demonstration:**

ATM option with 60 DTE, premium = $5.00
- Intrinsic: $0
- Extrinsic: $5.00

30 days later (stock unchanged):
- Intrinsic: $0 (still ATM)
- Premium: $3.50
- Extrinsic: $3.50 (decayed $1.50)

At expiration (stock unchanged):
- Premium: $0 (extrinsic decayed to zero)
```

**Deep ITM vs OTM comparison:**

Stock: $100

**Deep ITM: 80 Call at $22**
- Intrinsic: $20
- Extrinsic: $2
- 91% intrinsic (low theta decay)

**OTM: 120 Call at $2**
- Intrinsic: $0
- Extrinsic: $2
- 100% extrinsic (high theta decay risk)

Deep ITM behaves more like stock (high delta, low theta).  
OTM is pure speculation (decays fast if stock doesn't move).
\`\`\`

## References

- [Investopedia: Intrinsic Value](https://www.investopedia.com/terms/i/intrinsicvalue.asp)
- "Understanding Options" by Michael Sincere


🗓️ 21092025 1800

# interest_calculation_methods

## Core Interest Calculation Types

### 1. Simple Interest
**Formula**: Interest = Principal × Rate × Time
**Total Return**: Principal + Interest

**Example**: 
- Principal: S$10,000
- Rate: 3% per year
- Time: 5 years
- Interest: S$10,000 × 0.03 × 5 = S$1,500
- **Total Return**: S$11,500

**Used by**: 
- Basic personal loans
- Some government bonds
- Short-term commercial papers

**Key Feature**: Interest doesn't earn interest

---

### 2. Compound Interest (Annual)
**Formula**: Final Amount = Principal × (1 + Rate)^Years
**Interest Earned**: Final Amount - Principal

**Example**:
- Principal: S$10,000
- Rate: 3% per year
- Time: 5 years
- Final Amount: S$10,000 × (1.03)^5 = S$11,593
- **Interest Earned**: S$1,593

**Used by**:
- CPF accounts
- Fixed deposits
- Most savings accounts
- Investment funds

**Key Feature**: Interest earns interest (compounding effect)

---

### 3. Step-up Interest (Progressive Rates)
**Formula**: Sum of (Principal × Rate_year) for each year
**Total Interest**: Sum of all annual interest payments

**Example (SSB-style)**:
- Principal: S$10,000 (constant)
- Year 1: S$10,000 × 1.8% = S$180
- Year 2: S$10,000 × 2.1% = S$210
- Year 3: S$10,000 × 2.4% = S$240
- Year 4: S$10,000 × 2.7% = S$270
- Year 5: S$10,000 × 3.0% = S$300
- **Total Interest**: S$1,200
- **Total Return**: S$11,200

**Used by**:
- Singapore Savings Bonds (SSB)
- Some structured deposits
- Progressive savings plans

**Key Feature**: Rates increase over time, but no compounding

---

### 4. Discount Method (Zero-Coupon)
**Formula**: Yield = (Face Value - Purchase Price) / Purchase Price × (365/Days)
**Return**: Face Value - Purchase Price

**Example (T-Bills)**:
- Face Value: S$10,000
- Purchase Price: S$9,800
- Time: 182 days (6 months)
- Yield: (S$10,000 - S$9,800) / S$9,800 × (365/182) = 4.08%
- **Return**: S$200

**Used by**:
- Treasury Bills (T-Bills)
- Commercial papers
- Zero-coupon bonds

**Key Feature**: Buy at discount, receive face value at maturity

---

### 5. Compound Interest (Monthly/Daily)
**Formula**: Final Amount = Principal × (1 + Rate/n)^(n×Years)
Where n = compounding frequency per year

**Example (Monthly Compounding)**:
- Principal: S$10,000
- Annual Rate: 3%
- Monthly Rate: 3%/12 = 0.25%
- Time: 5 years
- Final Amount: S$10,000 × (1.0025)^60 = S$11,616
- **Interest Earned**: S$1,616

**Used by**:
- High-yield savings accounts
- Some fixed deposits
- Credit card interest (unfortunately!)

**Key Feature**: More frequent compounding = higher returns

---

## Comparison Table

| Method | Formula | Compounding | Example Return (S$10k, 3%, 5yr) | Best For |
|--------|---------|-------------|----------------------------------|----------|
| **Simple** | P × R × T | None | S$1,500 | Short-term loans |
| **Compound (Annual)** | P × (1+R)^T | Yearly | S$1,593 | Long-term savings |
| **Step-up** | Σ(P × R_year) | None | Varies by rates | Government bonds |
| **Discount** | (FV-PP)/PP × 365/D | None | Varies by discount | Short-term bills |
| **Compound (Monthly)** | P × (1+R/12)^(12T) | Monthly | S$1,616 | Savings accounts |

## Real-World Singapore Examples

### CPF Interest Calculation
**Method**: Compound Interest (Annual) + Bonus Interest
**Example**: S$50,000 in SA (Age 28)
- Base interest: S$50,000 × 4% = S$2,000
- Extra interest: S$50,000 × 1% = S$500
- **Total Year 1 Interest**: S$2,500
- **Year 2 Balance**: S$52,500 (compounds)

### SSB Interest Calculation
**Method**: Step-up Interest with Semi-annual Payments
**Example**: S$30,000 SSB (10-year average 2.5%)
- Simple calculation: S$30,000 × 2.5% × 10 = S$7,500
- **Total Return**: S$37,500

### T-Bills Interest Calculation
**Method**: Discount Method
**Example**: 6-month T-Bill
- Face Value: S$10,000
- Auction Price: S$9,850
- Return: S$150 over 6 months
- **Annualized Yield**: 3.05%

### High-Yield Savings
**Method**: Compound Interest (Monthly)
**Example**: 2.5% p.a., compounded monthly
- Monthly rate: 2.5%/12 = 0.208%
- S$10,000 after 1 year: S$10,253
- **Effective Annual Rate**: 2.53%

## Quick Calculation Tips

### For Simple Interest:
- **Mental math**: Rate × Principal × Years
- **Example**: 3% × S$10,000 × 5 years = S$1,500

### For Compound Interest (Annual):
- **Rule of 72**: Years to double = 72 ÷ interest rate
- **Example**: At 4%, money doubles in 72÷4 = 18 years

### For Step-up Interest (SSB):
- **Use average rate**: Average rate × Principal × Years
- **Example**: 2.5% average × S$30,000 × 10 years = S$7,500

### For Discount Method (T-Bills):
- **Quick estimate**: (Discount ÷ Price) × (365 ÷ Days)
- **Example**: (S$200 ÷ S$9,800) × (365 ÷ 182) = 4.1%

## Common Mistakes to Avoid

❌ **Using simple interest formula for compound interest**
- Wrong: S$10,000 × 3% × 5 = S$1,500
- Right: S$10,000 × (1.03)^5 - S$10,000 = S$1,593

❌ **Assuming SSB compounds**
- SSB pays out interest every 6 months (doesn't compound within the bond)

❌ **Forgetting to annualize T-Bill returns**
- Must multiply by (365/days) to get annual equivalent

❌ **Mixing up effective vs nominal rates**
- 3% compounded monthly = 3.04% effective annual rate

---
## References
- [Compound Interest Calculator](https://www.calculator.net/compound-interest-calculator.html)
- [CPF Interest Calculation](https://www.cpf.gov.sg/member/infohub/educational-resources/cpf-interest-rates)
- [MAS T-Bills Information](https://www.mas.gov.sg/bonds-and-bills/treasury-bills)

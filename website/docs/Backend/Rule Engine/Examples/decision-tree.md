---
sidebar_position: 1
sidebar_label: Decision Tree
---


# Decision Tree
:::note
Generated by ChatGPT, leaving it here for my own reference
:::

Let's consider a simple decision tree used by a bank to decide whether to approve or decline a loan application.

### Decision Criteria
- Credit Score: High (700 and above) or Low (below 700)
- Employment Status: Employed or Unemployed
- Annual Income: High (over $50,000) or Low (under $50,000)

### Decision Tree Structure
- Root Node (First Decision Point): Credit Score
    - High Credit Score
    - Low Credit Score
- Second Decision Point (for both High and Low Credit Score): Employment Status
    - Employed
    - Unemployed
- Third Decision Point (for those who are Employed): Annual Income
    - High Income
    - Low Income
- Leaf Nodes (Final Decision):
    - Approve Loan
    - Decline Loan

### How the Decision Tree Works
- A loan application starts at the root (Credit Score).
- If the Credit Score is high, it moves to the next decision point (Employment Status)
- If the applicant is employed, the tree checks the Annual Income.
- If the income is high, the loan is approved; if low, the loan might still be approved or declined based on other criteria (not shown in this basic tree).
- If the Credit Score is low, the loan might be declined immediately, or it might move to the next decision point (Employment Status), where being unemployed would likely lead to a decline.

```
                     [Credit Score]
                    /             \
           [High Score]       [Low Score]
              /  \                 /    \
       [Employed] [Unemployed] [Employed] [Unemployed]
         /     \                     | 
[High Income] [Low Income]       [Decline Loan]
    |              | 
[Approve Loan] [Approve/Decline based on other criteria]

```
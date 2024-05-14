---
sidebar_position: 6
sidebar_label: Hashing / Indexing
---
# Hashing and Indexing
### Scenario
Imagine a rule engine that processes transactions and applies various rules based on transaction properties like type and amount.

### Rules
- Rule 1: If the transaction is a "refund" and the amount is greater than $1000, flag for review.
- Rule 2: If the transaction is a "purchase" and the amount is less than $50, apply a discount.
- Rule 3: If the transaction is an "international transfer", perform currency conversion.

### Using HashSet and Indexing for Efficient Rule Processing
To efficiently process these rules, you can index them based on the transaction type. A HashSet or similar data structure can be used for quick lookups.

### Implementation
#### Index Creation
- Create a mapping of transaction types to rules 
- For each transaction type, you maintain a HashSet of rules applicable to that type

#### Rule Matching
- When a transaction comes in, you first determine its type.
- Then, look up the set of rules associated with this type.
- Iterate through this set and apply each rule to the transaction.

### Example Code Structure
```
class Rule {
    String type;
    Predicate<Transaction> condition;
    Action action;
}

Map<String, HashSet<Rule>> ruleIndex = new HashMap<>();

// Populate the index
ruleIndex.put("refund", new HashSet<>(Arrays.asList(rule1)));
ruleIndex.put("purchase", new HashSet<>(Arrays.asList(rule2)));
ruleIndex.put("international transfer", new HashSet<>(Arrays.asList(rule3)));

// Function to process a transaction
void processTransaction(Transaction transaction) {
    String type = transaction.getType();
    HashSet<Rule> applicableRules = ruleIndex.get(type);

    if (applicableRules != null) {
        for (Rule rule : applicableRules) {
            if (rule.condition.test(transaction)) {
                rule.action.execute(transaction);
            }
        }
    }
}

```

### Explanation
- Data Structures: The ruleIndex is a HashMap where each key is a transaction type, and the value is a HashSet of rules. This structure allows for quick retrieval of rules based on transaction type.
- Process Flow: When a transaction needs to be processed, the engine quickly identifies the subset of rules that apply to that transaction’s type, thus avoiding the need to evaluate every rule against every transaction.
### Conclusion
In rule engines, this approach of using hash-based structures and indexing significantly improves efficiency, especially when dealing with a large number of rules. It ensures that only a relevant subset of rules is considered for each transaction, reducing the computational overhead.

---
sidebar_position: 0
sidebar_label: Algorithms cheatsheet
---
# Rule engine algorithms
## Rete Algorithm
:::info
📖 Popular and used in many rule engines like drools
:::
#### 📋 Use case
- Designed for system that needs to apply many rules to many data
#### 🛠️ How it works
- Nodes of networks representing conditions and actions of rules
- Network is traversed as facts are asserted or retracted

## Decision Trees
:::info
📖 Flowchart-like structure where each internal node represents a test on an attribute
:::
#### 📋 Use case
- Rule sets that can be expressed as a series of binary decisions
#### 🛠️ How it works
- Starting from root, the tree is traversed according to the values of the attributes of a given object
- Decision in leaf node

## Forward Chaining
:::info
📖 Starts with known facts and applies inference rules to extract more data until a goal is reached
:::
#### 📋 Use case
- When new information is continuously added and conclusions need to be drawn from the data
#### 🛠️ How it works
Rules are examined in sequence, and if conditions of a rule are met, the rule is fired and actions are taken

## Backward Chaining
:::info
📖 Reverse of forward chaining, start with goal and work backwards to determine what facts must be true to reach that goal  
:::
#### 📋 Use case
Situations where the number of solutions is small compared to the number of possible facts
#### 🛠️ How it works
ALgorithm seeks out facts that support the goals

## Rule Priority (Salience)
#### 🛠️ How it works
Each rule is assigned and evaluated based on assigned priority

## Hashing and Indexing
:::info
📖 Using data structures like hashtables for quick lookup and filtering of rules
:::
#### 📋 Use case
Fast execution required
#### 🛠️ How it works
- Rules are indexed based on certian key attributes
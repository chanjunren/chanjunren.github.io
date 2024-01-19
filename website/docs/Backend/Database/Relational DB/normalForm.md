---
sidebar_position: 2
sidebar_label: Normal Forms
---

# Three Database Normal Forms
:::info
🤖 Guideline for designing relational databases
:::

## Unnormalized Table
### Example

| OrderID | Customer Name | BookTitles                           | BookPrices | Delivery Addresses |
|---------|---------------|--------------------------------------|------------|--------------------|
| 1       | John Doe      | "Database Concepts, Cloud Computing" | "50,40"    | 1 Maple St        |
| 2       | Jane Smith    | "Machine Learning                    | "60"       | Delivery Addresses |
| 3       | John Doe      | "Cloud Computing"                    | "40"       | 1 Maple St        |

### Issues
- `BookTitles` and `BookPrices` contain multiple values
- `CustomerName` and `DeliveryAddresses` repeated => redundancy

## First Normal Form (1NF)
### Traits
- `Atomicity`
    - Hold only atomic (indivisible) values
    - Each record contains unique key
- No repeating groups
    - Each intersection of row and column in a table must contain only a single value

### Example

| OrderID | CustomerName | BookTitle         | BookPrice | DeliveryAddress |
|---------|--------------|-------------------|-----------|-----------------|
| 1       | John Doe     | Database Concepts | 50        | 123 Maple St   |
| 1       | John Doe     | Cloud Computing   | 40        | 123 Maple St   |
| 2       | Jane Smith   | Machine Learning  | 60        | 456 Oak Ave    |
| 3       | John Doe     | Cloud Computing   | 40        | 123 Maple St   |

- But there is still redundant data


## Second Normal Form (2NF)
### Traits
- All criteria of 1NF
- `Eliminate redundant data`
    - (If composite primary key) Each non-key column should be dependent on the entire composite key

### Example
Split `Orders` into `Customers` and `Orders`

| CustomerID | CustomerName | DeliveryAddress |
|------------|--------------|-----------------|
| 1          | John Doe     | 123 Maple St   |
| 2          | Jane Smith   | 456 Oak Ave    |

## Third Normal Form (3NF)
### Traits
- All criteria of 2NF
- Eliminate columns not dependent on key
    - No transitive dependency for non-key attributes (non-key attributes must depend only on PK)

## Benefits 
### Reduced redundancy
Minimoize storage space requirements / inconsistent data

### Improved data integrity
Enhance integrity / consistency of database

### Easier maintenance
Simpler to update data, less prone

## Potential Downsides
### Performance implications
- Higher NF > more tables and more complex queries, can impact query performance 
- Denormalization can be helpful for
    - Databases with high read-to-write ratio
    - Performance is critical
### Complexity in Design and Queries
- Database design might be harder to understand, more complex SQL queries 

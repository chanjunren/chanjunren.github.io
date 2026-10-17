🗓️ 02112024 1153

# star_schema

```ad-info
[[olap]] data model
```

| Components               | Description                                                                 |
| ------------------------ | --------------------------------------------------------------------------- |
| `Fact Table`             | **Data table** that contains numerical values related to a business process |
| `Multi dimension tables` | Values that **describe each attribute** in a fact table                     |
>  The fact table refers to **dimensional tables** with foreign keys—unique identifiers that correlate to the respective information in the dimension table

```ad-info
A fact table connects to several dimension tables so the data model looks like a star
```

```mermaid
flowchart LR
    F[Fact table] --> D1[Date dimension]
    F --> D2[Product dimension]
    F --> D3[Customer dimension]
    F --> D4[Store dimension]
    D1 --> Q[Analytical query]
    D2 --> Q
    D3 --> Q
    D4 --> Q
```

## Example

> Example of a fact table for product sales

**Fact table** for product sales:
- Product ID
- Location ID
- Salesperson ID
- Sales amount

**Product Dimension Table**
- Product ID
- Product name
- Product type
- Product cost

**Location Dimension Table**
- Location ID
- Country
- City

**Salesperson table**
- Salesperson ID
- First name
- Last name
- Email

---

## References
- https://aws.amazon.com/what-is/olap/

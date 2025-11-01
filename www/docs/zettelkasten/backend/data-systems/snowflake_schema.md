🗓️ 02112024 1225
📎 

# snowflake_schema

Extension of [[star_schema]] - Some dimension tables might lead to one or more secondary dimension tables

```ad-info
This results in a snowflake-like shape when the dimension tables are put together
```

## Example

**Product Dimension Table**
- Product ID
- Product name
- Product type ID
- Product cost

**Product Type Dimension Table**
- Product type ID
- Type name
- Version
- Variant 


---

## References
- https://aws.amazon.com/what-is/olap/
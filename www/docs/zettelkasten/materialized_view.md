🗓️ 03022025 1601
📎

# materialized_view
 > A physical table that stores the result of a predefined query

Unlike a regular [[view]], it **periodically refreshes** to keep the data up-to-date with the underlying tables

## Use Cases
- Improving query performance for complex or expensive queries by precomputing and storing the results
- Use for dashboards, reports, or frequently accessed aggregated data

```ad-example
Creating a materialized view that stores daily sales totals
> Can be queried quickly without recalculating the totals each time
```

---
# References
- Deepseek

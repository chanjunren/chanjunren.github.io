🗓️ 24092025 1116
📎

# elasticsearch_types

## Core Field Types

| Type             | Description                                             | Use Case                                                 |
|------------------|---------------------------------------------------------|----------------------------------------------------------|
| **text**         | Analyzed field for full-text search. Tokenized, stemmed | Searchable content (descriptions, titles)                |
| **keyword**      | Exact value field. Not analyzed                         | Filtering, sorting, aggregations (IDs, categories, tags) |
| **integer/long** | Whole numbers                                           | Counters, IDs, quantities                                |
| **float/double** | Decimal numbers                                         | Prices, measurements, scores                             |
| **date**         | Timestamps and dates                                    | Created/updated times, events                            |
| **boolean**      | `true`/`false` values                                   | Flags, status indicators                                 |
| **object**       | Nested JSON objects (flattened)                         | Structured data without array relationships              |
| **nested**       | Maintains object relationships in arrays                | Complex nested structures                                |
| **geo_point**    | Latitude/longitude coordinates                          | Location data, mapping                                   |
| **ip**           | IPv4/IPv6 addresses                                     | Network data, security logs                              |

### Best Practices
- Use multi-fields when you need both search (`text`) and aggregation (`keyword`) capabilities
- Choose appropriate numeric types based on value ranges and precision needs

---
# References
- Cursor
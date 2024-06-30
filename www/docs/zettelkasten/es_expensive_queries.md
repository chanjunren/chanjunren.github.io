🗓️ 23052024 1433
📎 #elasticsearch

# es_expensive_queries

- Generally execute slowly
- Can affect cluster

### Linear scans to identify matches

- `script`
- queries on certain fields of types that are _not indexed_ but have _doc values_ enabled
  - `boolean`
  - `numberic`
  - `date`
  - `ip`
  - `geo_point`
  - `keyword`

### High upfront cost

- `fuzzy` queries
- `regexp` queries
- `prefix` queries
- `wildcard` queries
- `range` queries on text / keyword fields

### Joining queries

...

---

# References

- https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html

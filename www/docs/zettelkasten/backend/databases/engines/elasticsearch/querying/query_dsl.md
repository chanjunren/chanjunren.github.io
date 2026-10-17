🗓️ 17102026 2135

# query_dsl

Elasticsearch Query DSL is a JSON structure for expressing search, filtering, and scoring logic.

## Query and filter context

Queries in query context calculate relevance scores. Queries in filter context answer whether a document matches without contributing to `_score`; filters can also be cached when Elasticsearch determines that is useful.

The `bool` query combines clauses:

- `must`: required and scored.
- `filter`: required, not scored.
- `must_not`: excluded, not scored.
- `should`: optional scoring clauses, or required alternatives when `minimum_should_match` makes them required.

```json
{
  "query": {
    "bool": {
      "must": [{ "match": { "title": "distributed storage" } }],
      "filter": [{ "term": { "status": "published" } }],
      "should": [{ "term": { "featured": true } }]
    }
  }
}
```

In this example, `title` is analyzed as full text, while `status` and `featured` are exact structured values. The `should` clause can raise a result's score; because `must` and `filter` are present, it does not make the clause mandatory by default.

Choose query types to match the field mapping: `match` analyzes text, while `term` matches an indexed term and is usually appropriate for `keyword` or other structured fields. See [[analyzers]] and [[types]] before debugging unexpected matches.

## Related notes

- [[prefix_vs_match_phrase_prefix]] — prefix search choices
- [[expensive_queries]] — query costs and guardrails
- [[vector_search]] — nearest-neighbor retrieval

## References

- [Elasticsearch: Query and filter context](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html)
- [Elasticsearch: Boolean query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html)

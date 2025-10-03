🗓️ 04102025 0040
📎

# Elasticsearch Scoring & Relevance

How Elasticsearch ranks search results by relevance.

## Core Concepts

### Relevance Score
Every search result gets a score indicating how well it matches the query. Higher score = more relevant.

### What Affects Scoring?

| Factor                 | Impact                                                                |
|------------------------|-----------------------------------------------------------------------|
| **Term frequency**     | How often search term appears in document                             |
| **Document frequency** | How common the term is across all documents (rare terms score higher) |
| **Field length**       | Shorter fields score higher for same match                            |
| **Boost values**       | Manual weight adjustments                                             |

## Scoring vs Non-Scoring

### Queries that Affect Score
- **must** (in bool query) - Required AND scores
- **should** (in bool query) - Optional OR boosts score
- **match**, **multi_match** - Full-text search with scoring
- **function_score** - Custom scoring functions

### Queries that Don't Affect Score
- **filter** (in bool query) - Yes/no match, no scoring (faster!)
- **term**, **terms** - Exact match, typically in filters
- Any query in `filter` context - Cached, binary yes/no

**Rule of thumb**: Use `must` for search, `filter` for filtering. Filters are faster because they skip scoring and cache results.

## Boosting Strategies

### Field Boosting
Make certain fields more important than others.
- Example: `title^3` means title matches are 3x more valuable than other fields
- Use in `multi_match` to prioritize fields

### Document Boosting
Boost entire documents based on metadata.
- **function_score**: Custom scoring functions
- **field_value_factor**: Boost by numeric field (e.g., popularity, rating)
- **decay functions**: Boost by proximity (date, location, numeric value)

### Query Boosting
Adjust importance of different query clauses.
- Use in `bool` queries: give some `should` clauses higher weight
- Boost specific terms within a query

## Common Patterns

### Search with Filters (Optimal)
- Use `must` for search terms (scored)
- Use `filter` for constraints (not scored, cached)
- Result: Fast filtering + relevant scoring

### Boosting Popular Results
Use `function_score` with `field_value_factor` to boost by popularity, rating, or recency.

### Multi-Field Search with Priorities
Use `multi_match` with field boosting to make titles more important than descriptions.

## Scoring Debugging

### View Scores
Add `"explain": true` to query to see why documents scored the way they did.

### Disable Scoring
Use `constant_score` to wrap queries when you don't need scoring (all results get score of 1.0).

---

# References

- [Elasticsearch Relevance](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html)
- [Function Score Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html)


🗓️ 04102025 0034

# Elasticsearch Text Search Cheatsheet

A quick reference for Elasticsearch search capabilities and when to use each type.

## Core Concepts

### Full-Text vs Exact Match

| Type            | Use Case                                | Example                  |
|-----------------|-----------------------------------------|--------------------------|
| **Full-Text**   | Natural language search, fuzzy matching | "searching for articles" |
| **Exact Match** | IDs, status codes, categories           | `status: "active"`       |

> **Key difference**: Full-text is **analyzed** (lowercased, stemmed, tokenized), exact match is **not**.

## Search Types Overview

| Search Type      | What It Does                   | Best For                       |
|------------------|--------------------------------|--------------------------------|
| **Match**        | Full-text search with analysis | General search, user queries   |
| **Multi-Match**  | Search across multiple fields  | Searching title + description  |
| **Match Phrase** | Exact phrase in order          | "New York", "machine learning" |
| **Term**         | Exact value match              | IDs, enums, keywords           |
| **Fuzzy**        | Typo-tolerant search           | Handling misspellings          |
| **Prefix**       | Starts with...                 | Autocomplete, type-ahead       |
| **Wildcard**     | Pattern matching               | `user*`, `*@gmail.com`         |
| **Regexp**       | Regex patterns                 | Complex pattern matching       |
| **Range**        | Numeric/date ranges            | Price filters, date ranges     |
| **Bool**         | Combine queries                | Complex filtering logic        |


### match vs term
- **match**: Analyzed (lowercased, stemmed) - "Searching" → "search"
- **term**: Exact value - "Searching" ≠ "searching"

### match vs match_phrase
- **match**: Words can be in any order
- **match_phrase**: Words must be in exact order

### must vs filter (in bool)
- **must**: Affects relevance score (use for search)
- **filter**: Yes/no match, faster (use for filtering)

### should vs must
- **should**: Optional, boosts score if matched (OR logic)
- **must**: Required (AND logic)

## Common Patterns

### Search with Filters
Combine search queries (`must`) with filters (`filter`) - filters don't affect relevance score and are cached for performance.

### Fuzzy Search with Minimum Match
Use `fuzziness: "AUTO"` to handle typos, and `minimum_should_match` (e.g., "75%") to require a percentage of search terms to match.

### Wildcard Search
Pattern matching with `*` and `?` - useful but can be slow, especially with leading wildcards.

## Performance Tips

1. **Use filters over queries** when you don't need scoring
2. **Term queries are faster** than match queries
3. **Wildcard with `*` at start is slow** - avoid if possible
4. **Use prefix/edge_ngram** for autocomplete, not wildcard
5. **Cache filters** - ES automatically caches filter results
6. **Limit fields in multi_match** - don't search everything


---

## References

- [[elasticsearch_scoring_relevance]] - How results are ranked and scored
- [[elasticsearch_analyzers]] - How text is processed and tokenized
- [Elasticsearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
- [Match Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html)
- [Bool Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html)
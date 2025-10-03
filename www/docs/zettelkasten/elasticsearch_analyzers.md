🗓️ 04102025 0040
📎

# Elasticsearch Analyzers

How Elasticsearch processes and tokenizes text for searching.

## What is an Analyzer?

An analyzer transforms text into tokens (terms) that can be searched. It runs during:
1. **Indexing** - When documents are added
2. **Searching** - When queries are executed

**Key point**: Query text must be analyzed the same way as indexed text for matches to work!

## Analyzer Components

1. **Character Filters** - Transform characters (e.g., strip HTML, replace `&` → `and`)
2. **Tokenizer** - Split text into tokens (words)
3. **Token Filters** - Modify tokens (lowercase, stemming, synonyms, stop words)

## Built-in Analyzers

| Analyzer               | Example Input      | Output              | Use Case                   |
|------------------------|--------------------|---------------------|----------------------------|
| **Standard** (default) | "Hello World!"     | ["hello", "world"]  | General purpose            |
| **Simple**             | "Hello World-123!" | ["hello", "world"]  | Splits on non-letters      |
| **Whitespace**         | "Hello World!"     | ["Hello", "World!"] | No lowercasing             |
| **English**            | "running quickly"  | ["run", "quick"]    | English text with stemming |
| **Keyword**            | "Hello World!"     | ["Hello World!"]    | No analysis, exact match   |
| **Stop**               | "the quick fox"    | ["quick", "fox"]    | Removes common words       |

## Key Concepts

### Tokenization
Breaking text into words/terms.
- **Standard tokenizer**: Splits on whitespace and punctuation
- **Whitespace tokenizer**: Only splits on spaces
- **Pattern tokenizer**: Custom regex pattern

### Normalization
Making tokens searchable.
- **Lowercase**: "Hello" → "hello" (match case-insensitively)
- **ASCII folding**: "café" → "cafe" (remove accents)
- **Stemming**: "running" → "run" (match word variations)

### Stop Words
Common words removed during analysis (e.g., "the", "is", "at").
- Reduces index size
- Can improve search quality
- May hurt phrase search accuracy

## Analyzer Selection Guide

### Full-Text Search (Natural Language)
- **Standard** - General purpose, good default
- **English/[Language]** - If specific language (stemming, stop words)

### Exact Match (IDs, Codes, Email)
- **Keyword** - No analysis, exact string matching

### Autocomplete / Prefix Search
- **Edge n-gram** - Custom analyzer for prefix matching
- **Completion suggester** - Built-in autocomplete

### Case-Sensitive Search
- **Whitespace** - Keep original casing
- Custom analyzer without lowercase filter

## Common Patterns

### Multi-Field Mapping
Index same field with different analyzers:
- `title` - Standard analyzer (full-text search)
- `title.keyword` - Keyword analyzer (exact match, sorting, aggregations)

### Search-Time vs Index-Time Analysis
- Usually use same analyzer for both
- Exception: Synonym expansion (better at index time)

### Custom Analyzers
Combine character filters, tokenizers, and token filters to create custom analysis chain.

## Analysis vs Search Behavior

| Field Type | Analyzed? | Query Type | Behavior                              |
|------------|-----------|------------|---------------------------------------|
| `text`     | Yes       | `match`    | Both analyzed, fuzzy matching         |
| `text`     | Yes       | `term`     | ⚠️ Query NOT analyzed, usually fails! |
| `keyword`  | No        | `match`    | Query analyzed, usually fails!        |
| `keyword`  | No        | `term`     | ✅ Neither analyzed, exact match       |

**Rule**: Use `match` for `text` fields, `term` for `keyword` fields.

## Testing Analyzers

Use the `_analyze` API to see how text is processed:
```
GET /_analyze
{
  "analyzer": "standard",
  "text": "Hello World!"
}
```

Test custom field analysis:
```
GET /my_index/_analyze
{
  "field": "title",
  "text": "Hello World!"
}
```

---

# References

- [Analyzer Reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-analyzers.html)
- [Custom Analyzers](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-custom-analyzer.html)


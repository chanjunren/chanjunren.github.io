🗓️ 07112025 0015

# Elasticsearch Analyzer Configuration

**Core Concept**: Configure custom analyzers in index settings to control how text fields are tokenized and searched.

## Why It Matters

Analyzers determine how text is broken down and indexed. The right analyzer improves search relevance, enables features like autocomplete, and optimizes for your use case. This builds on [[elasticsearch_analyzers]] which explains analyzer fundamentals.

## When to Use

- **General full-text search** - Use standard or custom analyzer with lowercase + ASCII folding
- **Autocomplete** - Use edge n-gram analyzer
- **Language-specific** - Use language analyzers for stemming (English, Chinese, etc.)
- **Case-insensitive exact match** - Use keyword tokenizer with lowercase filter
- **Multi-language fields** - Different analyzers per language sub-field

## Trade-offs

**Custom Analyzers:**
- More control over tokenization and normalization
- Optimized for specific use cases
- Requires understanding of analyzer components

**Built-in Analyzers:**
- Quick to set up
- Good defaults for most cases
- Less flexibility

```ad-danger
**Critical: Cannot Change Analyzers on Existing Fields**

Analyzer settings are "baked in" at index creation. To change analyzers:
1. Create new index with updated analyzer settings
2. Reindex all data from old → new index
3. Switch application to new index using aliases
4. Delete old index after validation

See [Reindex API docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-reindex.html) for migration strategy.
```

## Quick Reference

### Index Structure with Custom Analyzer

```json
PUT /your_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_text_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "asciifolding"]
        }
      }
    }
  },
  "mappings": {
    "dynamic_templates": [
      {
        "field_values": {
          "path_match": "field_values.*.*",
          "mapping": {
            "type": "text",
            "analyzer": "custom_text_analyzer",
            "fields": {
              "keyword": {"type": "keyword"}
            }
          }
        }
      }
    ],
    "properties": {
      "name": {
        "type": "text",
        "analyzer": "custom_text_analyzer",
        "fields": {"keyword": {"type": "keyword"}}
      }
    }
  }
}
```

**Field structure example:**
```json
{
  "field_values": {
    "title": {"en": "Hello World", "cn": "你好世界"},
    "description": {"en": "Test description", "cn": "测试描述"}
  }
}
```

This matches `field_values.title.en`, `field_values.title.cn`, etc.

### Common Analyzer Recipes

**General Full-Text Search:**
```json
"analyzer": {
  "general_text": {
    "type": "custom",
    "tokenizer": "standard",
    "filter": ["lowercase", "asciifolding"]
  }
}
```

**Autocomplete (Edge N-gram):**
```json
"analyzer": {
  "autocomplete": {
    "type": "custom",
    "tokenizer": "standard",
    "filter": ["lowercase", "autocomplete_filter"]
  }
},
"filter": {
  "autocomplete_filter": {
    "type": "edge_ngram",
    "min_gram": 2,
    "max_gram": 10
  }
}
```

**English with Stemming:**
```json
"analyzer": {
  "english_text": {
    "type": "custom",
    "tokenizer": "standard",
    "filter": ["lowercase", "english_stop", "english_stemmer"]
  }
},
"filter": {
  "english_stop": {
    "type": "stop",
    "stopwords": "_english_"
  },
  "english_stemmer": {
    "type": "stemmer",
    "language": "english"
  }
}
```

**Case-Insensitive Exact Match:**
```json
"analyzer": {
  "case_insensitive": {
    "type": "custom",
    "tokenizer": "keyword",
    "filter": ["lowercase"]
  }
}
```

**Multi-Language Pattern:**
```json
"dynamic_templates": [
  {
    "english_fields": {
      "path_match": "field_values.*.en",
      "mapping": {
        "type": "text",
        "analyzer": "english",
        "fields": {"keyword": {"type": "keyword"}}
      }
    }
  },
  {
    "chinese_fields": {
      "path_match": "field_values.*.cn",
      "mapping": {
        "type": "text",
        "analyzer": "ik_smart",
        "fields": {"keyword": {"type": "keyword"}}
      }
    }
  }
]
```

### Multi-Field Strategy

Use multiple sub-fields for different search patterns:

```json
"field_values.title.en": {
  "type": "text",
  "analyzer": "english",
  "fields": {
    "keyword": {
      "type": "keyword"
    },
    "raw": {
      "type": "text",
      "analyzer": "standard"
    }
  }
}
```

**Usage:**
- `field_values.title.en` - Full-text search with English analyzer
- `field_values.title.en.keyword` - Exact match, sorting, aggregations
- `field_values.title.en.raw` - Alternative search pattern (no stemming)

### Test Analyzer Output

```json
GET /your_index/_analyze
{
  "analyzer": "custom_text_analyzer",
  "text": "Hello World! Testing 123"
}
```

Test specific field:
```json
GET /your_index/_analyze
{
  "field": "field_values.title.en",
  "text": "Running quickly"
}
```

```ad-warning
**Gotcha: Define Analyzers Before Mappings**

All custom analyzers must be defined in `settings.analysis` BEFORE referencing them in mappings. Elasticsearch validates analyzer names at index creation time.
```

---

## References

- [Elasticsearch Analyzers](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-analyzers.html)
- [Custom Analyzers](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-custom-analyzer.html)
- [[elasticsearch_analyzers]] - Understanding how analyzers work
- [[es_ngram]] - N-gram configuration for autocomplete

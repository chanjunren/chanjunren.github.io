---
sidebar_position: 7
sidebar_label: Full-Body Search
---

# Full-Body Search

## Empty Search
`GET /_search`
```
Body: {}
Result: Returns all documents in all indices
```

`GET /_search`
```
Body: {
    "query": {
        "match_all": {}
    }
}
Result: Returns all documents in all indices
```


_Searching one, many or _all indices_
`GET /index_2014*/type1,type2/_search`
```
Body: {}
Result: ?? Idk
```

_Paginated result_
`GET /_search`
```
body: {
    "from": 30,
    "size": 10
}
```

:::info
The authors of Elasticsearch prefer using GET for a search request because they feel
that it describes the action—retrieving information—better than the POST verb. How‐
ever, because GET with a request body is not universally supported, the search API
also accepts POST requests:
:::
`POST /_search`
```
{
 "from": 30,
 "size": 10
}
```

## Query DSL
- Search language that is used to interact with Lucene

### Structure of a Query clause
```
Typical Structure:
{
    QUERY_NAME: {
        ARGUMENT: VALUE,
        ARGUMENT: VALUE...
    }
}

Targeting a specific field
{
    QUERY_NAME: {
        FIELD_NAME: {
            ARGUMENT: VALUE,
            ARGUMENT: VALUE,
        }
    }
}
```

### Combining Multiple Queries
| Term | Description |
| ---- | ----------- |
| Leaf | Used to compare a field / fields to a query string |
| Compound | Used to combineother query clauses |

### Queries and Filters
- Filter
    - Asks yes | no question of every document
    - Used for fields with exact values
- Query
    - Similar to filter
    - Also ask: _how well does this document match?_
    - Calculates how relevant a document is to the query
    - Assigns document a relevance score

#### Performance Differences:
- Filters quick to caulculate, cacheable
- Query calculates relevance as well
    - Not cacheable
- Basically, filters more performant than queries

## Filters
### `term`
- Filter by exact values
```
{ "term": { "age": 26 }}
{ "term": { "date": "2014-09-01" }}
{ "term": { "public": true }}
{ "term": { "tag": "full_text" }}
```
### `terms`
- Same as term filter, but can specify multiple values to match
```
{ "terms": { "tag": ["search", "full_text", "nosql" ]}}
```

### `range`
- Numbers / date
- Opeartors
    - gt
    - gte
    - lt
    - lte
```
{
    "range": {
        "age": {
            "gte": 20,
            "lt": 30,
        }
    }
}
```

### `exist` and `missing`
- `exist`: field contains one or more specified values
- `missing`: doesn't have specified values
```
{
    "exists": {
        "field": "title"
    }
}
```

### `bool`
- Used to combine multiple filter clauses
- Params:
    - `must`: clauses MUST match
    - `must_not`: clauses MUST NOT match
    - `should`: at least one clause must match
- Each param can accept single filter clause / array of filter clauses
```
{
    "bool": {
        "must": {
            "term": {
                "folder": "inbox"
            }
        },
        "must_not": {
            "term": {
                "tag": "spam"
            }
        },
        "should": [
            {
                "term": {
                    "starred": true
                }
            },
            {
                "term": {
                    "unread": true
                }
            }
        ]
    }
}
```

## Queries
### `match_all`
- Simply matches all documents
- Default query used if non specified
- Used if no query is specified

### `match`
- Standard query used for full-text / exact value in almost any field
    - Analysis will be performed for full-text field
    - Exact match for fields containing exact values
:::note
Better to use filter instead of query for exact value matches
:::

```
{ "match": {"age": 26 }}
{ "match": {"date": "2023-08-07" }}
{ "match": {"public": true }}
{ "match": {"tag": "full_text" }}
```

### `multi_match`
- Allows you to run the same match query on multiple fields
```
{
    "multi_match": {
        "query": "full text search",
        "fields": ["title", "body" ]
    }
}
```

### `bool`
- Used to combine multiple query clauses
- Combines the _score from each `must` / `should` clause
- Params:
    - `must` clauses that MUST match for document to be included
    - `must_not` clauses that MUST NOT match for document to be included
    - `should`: increase _score if clauses match

```
{
    "bool": {
        "must": {
            "match": {
                "title": "how to make millions"
            }
        },
        "must_not": {
            "match": {
                "tag": "spam"
            }
        },
        "should": [
            {
                "match": {
                    "tag": "starred"
                }
            },
            {
                "range": {
                    "date": {
                        "gte": "2014-01-01"
                    }
                }
            }
        ]
    }
}
```
## Combining Queries with Filters
### Filtering a Query
```
Query:
{
    "match": {
        "email": "business opportunity"
    }
}
Filter:
{
    "term": {
        "folder": "inbox"
    }
}
Beepboopbeepcombined:
{
    "filtered": {
        "query": {
            "match": {
                "email": "business opportunity"
            }
        },
        "filter": {
            "term": {
                "folder": "inbox"
            }
        }
    }
}
```

### Just filter
```
{
    "query": {
        "filtered": {
            "filter": {
                "term": {
                    "folder": "inbox"
                }
            }
        },
        "query": { // Can be omited
            "match_all": {}
        }
    }
}
```
### Query as a filter
{
    "query": {
        "filtered": {
            "filter: {
                "bool": {
                    "must": {
                        "term": {
                            "folder": "inbox"
                        }
                    },
                    "must_not": {
                        "query": {
                            "match": {
                                "email": "urgent business proposal"
                            }
                        }
                    }
                }
            }
        }
    }
}

## Validating Queries
- Used to check whether a query is valid
```
GET /gb/tweet/_validate/query
Body: {
    "query": {
        "tweet": {
            "match": "really powerful"
        }
    }
}

Response: {
    "valid": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "failed": 0,
    }
}
```

## Understanding errors
```
GET /gb/tweet/_validate/query?explain
{
    "query": {
        "tweet": {
            "match": "really powerful"
        }
    }
}

Response
{
    "valid": false,
    "_shards": {...},
    "explanations: [{
        "index": "gb",
        "valid": false,
        "error": "org.elasticsearch.index.query.QueryParsingException: [gb] No query registered for [tweet]"
    }]
}
```

## Understanding Queries
- For understanding how query is interpreted by ES
```
GET /_validate/query?explain
Body: {
    "query": {
        "match": {
            "tweet": "really powerful"
        }
    }
}
Response: {
    "valid": true,
    "_shards": { ... },
    "explanations": [
        {
            "index": "us",
            "valid": true,
            "explanation": "tweet: really tweet:powerful"
        }, {
            "index": "gb",
            "valid": true,
            "explanation": "tweet:realli tweet:power"
        }
    ]
}
```

- Shows how the terms are analyzed / transformed
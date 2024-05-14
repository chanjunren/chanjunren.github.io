---
sidebar_position: 8
sidebar_label: Sorting and Relevance
---

# Sorting and Relevance

## Sorting
## Sorting by Field Values
- `_score` is not calculated
    - it is expensive to calculate score
- `sort`  value returned

### Single Value
`GET /_search`
```json
{
     ...
     "sort": {
        "date": {
            "order": "desc"
        }
    }
}
```

### Multilevel sorting
```json
{
    ...
    "sort": [
        {
            "date": {
                "order": "desc"
            }
        },
        {
            "_score": {
                "order": "desc"
            }
        }
    ]
}
```

### Multivalue sorting
```json
{
    ...
    "sort": [
        {
            "dates": {
                "order": "desc",
                "modes": "min" // min, max, avg, sum
            }
        },
    ]
}
```

### String Sorting
- Analyzed string cannot be sorted in lexocological order
- Use multifield mapping => field is not stored twice but indexed in 2 different ways

```json
"tweet": {
    "type": "string",
    "analyzer": "english",
    "fields": {
        "raw": {
            "type": "string",
            "index": "not_analyzed"
        }
    }
}
```

## Relevance
- Relevance score depends on type of query caluse
- Standard algorithm used to calculate relevance => **Term Frequency / Inverse Document Frequency (TF / IDF)**

| Term                       | Description                                                |
|----------------------------|------------------------------------------------------------|
| Term Frequency             | How often term appears in field (more often more relevant) |
| Inverse document frequency | How often term appears in index (more often less relevant) |
| Field-length norm          | Field length (longer => less relevant)                     |

### Understanding the score
`GET /_search?explain`

```json
{
    "query": {
        "match": {
            "tweet": "honeymoon"
        }
    }
}
```

`Output`
```json
{
    // Metadata
    "_index": "us",
    "_type: "tweet",
    "_id": "12",
    "_score": 0.076713204,
    "_source": { ...trimed... },
    // Shard / Node info, score is callculated per shard level (rather than index)
    "_shard": 1,
    "_node": "asdoaskfnadsf3412",
    "_explanation": {
        "description": "weight(tweeit:honeymoon in 0)
                        [PerFieldSimilarity], result of:",
        "value": 0.076713204,
        "details": [
            {
                "description": "tf(freq=1.0), with freq of:",
                "value": 1,
                "details": [
                    {
                        "description": "termFreq=1.0",
                        "value": 1,
                    }
                ]
            },
            {
                "description": "idf(docFreq=1, maxdocs=1)",
                "value": 0.30685282
            },
            {
                "description": "fieldNorm(doc=0")",
                "value": 0.25
            }
        ]
    }
}
```
:::note
Can be formatted to JSON too
:::

## Fielddata
- Values for a field that has been loaded into memory
    - Because uninverting from disk is slow

:::warning
- ES loads the values from every document in your index regardless of document type
- Can consume a lot of memory for high cardinality fields
:::

- Usage
    - Sorting on a field
    - Aggregations on a field
    - Certain filters
    - Scripts that refer to fields
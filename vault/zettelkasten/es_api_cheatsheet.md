20240325 1812

Tags: #elasticsearch

# es_api_cheatsheet

### Get index mapping
```json
GET /{index_name}/_mapping

GET /{index1},{index2}/_mapping
```

### New index
> _PUT /user_alerts_ 
```json
PUT /user_alerts
{
  "mappings": {
    "properties": {
      "user_id": {
        "type": "long"
      },
      "created_date": {
        "type": "date",
        "format": "epoch_millis"
      },
      "modified_date": {
        "type": "date",
        "format": "epoch_millis"
      },
      "country_id": {
        "type": "keyword"
      },
      "handled": {
        "type": "boolean"
      },
      "occurrences": {
        "type": "nested", 
        "properties": {
          "id": {
            "type": "long"
          },
          "created_date": {
            "type": "date",
            "format": "epoch_millis"
          },
          "modified_date": {
            "type": "date",
            "format": "epoch_millis"
          },
          "handle_type": {
            "type": "integer"
          },
          "type": {
            "type": "integer"
          },
          "metadata": {
            "type": "text"
          }
        }
      }
    }
  }
}

```

### Nested Query
> GET /my-index-000001/_search
```json
{
  "query": {
    "nested": {
      "path": "obj1",
      "query": {
        "bool": {
          "must": [
            { "match": { "obj1.name": "blue" } },
            { "range": { "obj1.count": { "gt": 5 } } }
          ]
        }
      },
      "score_mode": "avg"
    }
  }
}
```

--- 
# References
- https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-get-mapping.html

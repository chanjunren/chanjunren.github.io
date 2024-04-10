20240325 1812

Tags: #elasticsearch

# es_api_cheatsheet

### Get Mapping
```json
GET /{index_name}/_mapping

GET /{index1},{index2}/_mapping
```

### New index
> _PUT /user_alerts_ 
```json
PUT /otc_user_alert_index
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
	"bool": {
		"must": [
			{
				"nested": {
					"path": "occurrences",
					"query": {
						"bool": {
							"must": [
								"terms": {
									"occurrences.type"
								}
							]
						}
					}
				}
			}
		]
	}
  }
}
```

### Query with script
> POST /.../{index}/_update/90000460211 
```json
{
    "script": {
        "source": "if (ctx._source.occurrences == null) { ctx._source.occurrences = []; } boolean updated = false; for (item in ctx._source.occurrences) { if (item.id == params.occurrence.id) { item.putAll(params.occurrence); updated = true; break; } } if (!updated) { ctx._source.occurrences.add(params.occurrence); }",
        "params": {
            "occurrence": {
                "id": 15,
                "created_date": 1683602203000,
                "modified_date": 1683602203000,
                "user_id": 90000460211,
                "handle_type": 2,
                "type": 1,
                "metadata": "230509111336868",
                "assigneeId": 564563454,
                "handlerId": 123
            }
        }
    },
    "scripted_upsert": true,
    "upsert": {}
}
```

### Nested

--- 
# References
- https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-get-mapping.html

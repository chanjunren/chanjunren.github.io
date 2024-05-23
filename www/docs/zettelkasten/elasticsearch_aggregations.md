🗓️ 20240515 1438
📎 #elasticsearch 

# elasticsearch_aggregations
- Summary of data

## Categories
| Category              | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| Metric aggregations   | calculate metrics from field values (e.g. `sum`, `average`)    |
| Bucket aggregations   | group documents into buckets (bins) based on certain criterias |
| Pipeline aggregations | take input from other aggregations                             |
|                       |                                                                |

### Bucket aggregations
- Create *buckets* of documents
	- each bucket is associated with a criterion
- can hold `sub-aggregations`
```json
{
  "size": 0,
  "query": {
    "bool": {
      "must": [
        {
          "terms": {
            "orderSource": ["source1", "source2"] // Adjust as needed
          }
        },
        {
          "range": {
            "orderDate": {
              "gte": "now-30d/d", // Adjust date range
              "lte": "now/d"
            }
          }
        },
      ]
    }
  },
  "aggs": {
    "orderSum": {
      "sum": {
        "field": "orderAmount" // Adjust to your field name
      }
    },
    "orderStatusCounts": {
      "terms": {
        "field": "orderStatus",
        "size": 10 // Adjust as needed
      },
      "aggs": {
        "statusCount": {
          "value_count": {
            "field": "orderStatus"
          }
        }
      }
    }
  }
}

```

---

# References
- https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html

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
                  {
                    "terms": {
                      "occurrences.type": [1, 2, 3]  // Example types
                    }
                  },
                  {
                    "terms": {
                      "occurrences.handle_type": [1]  // Assuming UNHANDLED code is 1
                    }
                  }
                ],
                "must_not": [
                  {
                    "terms": {
                      "occurrences.handle_type": [1]
                    }
                  }
                ]
              }
            },
            "score_mode": "none"
          }
        }
      ],
      "must_not": [
        {
          "term": {
            "handle_type": 1  // Assuming UNHANDLED code is 1
          }
        }
      ],
      "filter": [
        {
          "terms": {
            "user_id": [123, 456]  // Example user IDs
          }
        },
        {
          "range": {
            "created_date": {
              "gte": "1633036800000",  // Example start date in epoch_millis
              "lte": "1635725199000"   // Example end date in epoch_millis
            }
          }
        }
      ]
    }
  }
}
```
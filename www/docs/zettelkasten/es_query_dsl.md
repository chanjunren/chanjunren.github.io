🗓️ 16042024 1107
📎 #elasticsearch #wip

# es_query_dsl

## Compound Query Clauses

- _Use_:
  - For combining clauses
  - Alter behavior (e.g. `constant_score`)
- Wraps leaf / other compound clauses
- `bool`, `dis_max`
- `must` - logical _AND_
- `must_not` - logical _NOT_
- `should` - logical _OR_

### Logical "AND" Conditions

- `must` or `filter`
  - `filter` does not affect `score`
- **All conditions specified must be satisfied** within these clauses for a document to match

```json
{
  "query": {
    "bool": {
      "must": [
        { "term": { "field1": "value1" } },
        { "term": { "field2": "value2" } }
      ]
    }
}

{
  "query": {
    "bool": {
      "filter": [
        { "term": { "field1": "value1" } },
        { "term": { "field2": "value2" } }
      ]
    }
 }
```

> match documents where `field1 == value1` and `field2 == value2`

### Logical "OR" Conditions

- use `should` clause
- **At least one** conditions in should satisfied > document match
  - Can control this number with `minimum_should_match`

```json
{
  "query": {
    "bool": {
      "should": [
        { "term": { "field1": "value1" } },
        { "term": { "field2": "value2" } }
      ],
      "minimum_should_match": 1
    }
}
```

> match documents where `field1 == value1` OR `field2 == value2`

### Combining "AND" and "OR" Conditions

```json
{
  "query": {
    "bool": {
      "must": [{ "term": { "field1": "value1" } }],
      "should": [
        { "term": { "field2": "value2" } },
        { "term": { "field3": "value3" } }
      ],
      "filter": [{ "term": { "field4": "value4" } }],
      "minimum_should_match": 1
    }
  }
}
```

- Match documents where
  - `field1 == value1` AND
  - `field4 == value4` AND
  - `field2 == value2` || `field3 == value3`

### Logical NOT

- `must_not`

## Leaf Query Clauses

![[Pasted image 20240523174730.png]]

### `match`

### `term`

### `range`

### `exists`

### `prefix`

### `ids`

### `fuzzy`

---

# References

- https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html
- ChatGPT

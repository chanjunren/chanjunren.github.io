20240416 1107

Tags: 

# es_query_dsl
```ad-quote
_Think of the query DSL as AST of queries_
> Es docs lol
```

## Leaf Query Clauses
- *Use*: For matching particular values
- `match`, `term`, `range`
## Compound Query Clauses
- *Use*: 
	- For combining clauses
	- Alter behavior (e.g. `constant_score`)
- Wraps leaf / other compound clauses
- `bool`, `dis_max`
- `must` - logical *AND*
- `must_not` - logical _NOT_
- `should`  - logical _OR_

## Expensive Queries
- Generally execute slowly
- Can affect cluster
### Linear scans to identify matches
- `script`
- queries on certain fields of types that are *not indexed* but have *doc values* enabled
	- `boolean`
	- `numberic`
	- `date`
	- `ip`
	- `geo_point`
	- `keyword`

### High upfront cost
- `fuzzy` queries
- `regexp` queries
- `prefix` queries
- `wildcard` queries
- `range` queries on text / keyword fields
### Joining queries
...

--- 
# References
- https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html
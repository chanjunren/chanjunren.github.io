---
sidebar_position: 5
sidebar_label: Basic Searching Tools
---
# Basic Searching Tools

## Why ES Stonks
- Ability to make sense out of chaos - turning big data into big information
- Every field is indexed and can be queried
- Every index can be used, to return results very kuai
- Search:
	- Strutured query on concrete fields
	- Full-text query
		- Find all documents matching search keywords
		- Result sorted by _relevance_
	- Combination of the two

- To use ES to full potential, need to understand three subjects:
	- Mapping
	- Analysis
	- Query DSL

## The Empty Search
- Doesn't specify any query
- Returns all doucments in all indices in the cluster

```
{
 "hits" : {
 "total" : 14,
 "hits" : [
 {
 "_index": "us",
 "_type": "tweet",
 "_id": "7",
 "_score": 1,
 "_source": {
 "date": "2014-09-17",
 "name": "John Smith",
 "tweet": "The Query DSL is really powerful and flexible",
 "user_id": 2
 }
 },
 ... 9 RESULTS REMOVED ...
 ],
 "max_score" : 1
 },
 "took" : 4,
 "_shards" : {
 "failed" : 0,
 "successful" : 10,
 "total" : 10
 },
 "timed_out" : false
}
```

| Term | Description | 
| ---- | ----------- | 
|`hits` | Total number of documents matching our query, and array of the first 10 documents|
|`max_score` | highest `_score` of any document|
|`took` | Time for search request to execute|
|`shards` | Total number of shards involved (how many succeeded / failed) |
| `timeout` | Whether search request timed out| 

:::note
`timeout` of *request* does not halt execution of query, merely tells coordinating node to return results collected so far and return the result

Use this for SLA (not for aborting execution)
:::

## Multi-index, Multitype
|Query | Description|
|----- | -----------|
| `/_search` |  All types in all indices |
| `/gb/_search` |  All types in gb index |
| `/gb,us/_search` |  All types in gb and us indices |
| `g*,u*/_search` |  All types in any indices beginning with g or u |
| `/gb/user/_search` |  Search type user in gb index |
| `/gb,us/user,tweet/_search` |  Search type user and tweet in gb and us indices |
| `/_all/user,tweet/_search` |  Search type user and tweet in all indices |

## Pagination
- Just need to specify parameters
- `size`
	- number of results returned
	- default: 10
- `from`
	- number of initial results to be skipped
	- default: 0
- results usually sorted before being returned

:::warning
Deep Paging in Distributed Systems

Basically, it's problematic because each shard needs to produce PAGE_SIZE results, and then all PAGE_SIZE * NUM_SHARDS results need to be processed 
:::

## Search Lite
- Lite query string: expects all parameters to be passed in query string
- Full rqeuest body version: Expects JSON request body DSL

## `_all` Field
`GET /_search?q=mary`
- Returns
	- User whose name is Mary
	- Six tweets by Mary
	- One tweet directed @mary
- How?
	- Document indexed => ES takes atring values of all its fields and concatenates them into one string
	- Indexed as special _all field

## More Complicated Queries
- TLDR: Use full request body version for complicated queries because complicated queries are not as easy to decipher as lite query strings
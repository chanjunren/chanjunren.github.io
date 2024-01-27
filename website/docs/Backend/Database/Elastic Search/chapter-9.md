---
sidebar_position: 9
sidebar_label: Distributed Search Execution
---

# Distributed Search Execution
:::info
Returning a "page" of results is split into 2 phases because:
1. Find all matching documents  (`QUERY`)
2. Combine into single sorted list (Because documents are on different shards) (`FETCH`)
:::

## Query Phase
1. Client sends search request to `coordinating_node` (node that receives the request)
    - Node creates empty PQ of size `from` + `size`
2. Coordinating node forwards requets to shard copy of every shard
    - Each shard executes query locally
    - Builds local priority queue of size `from` + `size`
    - Returns result + sort values
3. `coordinating_node` merges values to produce globally sorted list

## Fetch Phase
1. Coordinating node identifies which documents need to be fetched and issues a `MGET` rqeuest
2. Each shard loads and enriches documents => returns to `coordinating_node`
3. `coordinating_node` returns result to client

:::warning
Limits of pagination because each shard must build a PQ of `from` + `size`
Sorting can get very expensive on very large results ( > 5000 pages)

Can disable sorting with the `scan` search type 
:::

## Search Options
Parameters that influence the search process


| Option        | Description                                                                                                                                                                                                                                                                                                                                                                                                                  |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `preference`  | Control which shards / nodes to handle search request (avoid bouncing results problem)                                                                                                                                                                                                                                                                                                                                       |
| `timeout`     | Tells `coordinating_node` how long to wait before returning resutls (returns SOME results)                                                                                                                                                                                                                                                                                                                                   |
| `routing`     | Specified to limit which shard to search                                                                                                                                                                                                                                                                                                                                                                                     |
| `search_type` | <ul><li>`count`: only has a query phase (for document count / aggregations)</li><li>`query_and_fetch`: combines `query` and `fetch` into a single step (only when single shard targeted)</li><li>`dfs_query_then_fetch` / `dfs_query_and_fetch`: prequery phase that fetches term frequencies from involved shards</li><li>`scan`: Used together with `scroll` API to retrieve large number of resutls efficiently</li></ul> |

## `scan` and `scroll`
Used together to retrieve large numbers of documents efficiently without the overhead of deep pagination

### `scroll`
    - Allows initial search to keep pulling batches of results from ES
    - Similar to cursor

### `scan`
    - Disables global sorting of results (main overhead of deep pagination)

### Steps
 1. Execute search request
    - Keep scroll open for 1 minute
    - `_scroll_id` returned (hits not included)

`GET /old_index/_search?search_type=scan&scroll=1m`

 ```json
 {
    "query": { 
        "match_all": {}
    },
    "size: 1000
 }
 ```

 2. Retrieve first batch of results
    - `_scroll_id` passed in body / query param
    - Keep the scroll open for another minute
    - A new `_scroll_id` is returned

`GET /_search/scroll?scroll=1m
 c2Nhbjs1OzExODpRNV9aY1VyUVM4U0NMd2pjWlJ3YWlBOzExOTpRNV9aY1VyUVM4U0
NMd2pjWlJ3YWlBOzExNjpRNV9aY1VyUVM4U0NMd2pjWlJ3YWlBOzExNzpRNV9aY1Vy
UVM4U0NMd2pjWlJ3YWlBOzEyMDpRNV9aY1VyUVM4U0NMd2pjWlJ3YWlBOzE7dG90YW
xfaGl0czoxOw==` 

:::note
- Number of results is `size` * `number_of_primary_shards`
- No more hits => all documents processed
:::
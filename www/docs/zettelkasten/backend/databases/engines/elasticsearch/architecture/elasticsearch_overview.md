🗓️ 17102026 2135

# elasticsearch_overview

Elasticsearch is a distributed search and analytics engine built on Apache Lucene.

## Mental model

Applications send JSON documents to an index. Elasticsearch maps document fields, indexes searchable values, and distributes index shards across cluster nodes. Search requests are coordinated across relevant shards, then their results are combined.

An Elasticsearch index is not a relational table. Documents are grouped into indices and contain fields; modern Elasticsearch uses mappings and data streams rather than the old, removed index-type model. A field is searchable or aggregatable according to its mapping and indexing options, so “every field is searchable” is not a safe assumption.

Elasticsearch is a strong fit for text search, filtering, and aggregations over indexed documents. It is not a drop-in replacement for a relational database’s transactions and constraints. Plan mappings and shard counts around query patterns and data volume.

## Related notes

- [[analyzers]] — how text is transformed for search
- [[query_dsl]] — expressing searches
- [[search_cluster_topology]] — distributing indices and requests

## References

- [Elasticsearch: Getting started](https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html)
- [Elasticsearch: Mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html)

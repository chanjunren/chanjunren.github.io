🗓️ 17102026 2135

# vector_search

Vector search ranks records by similarity between numeric vector representations called embeddings.

An embedding model converts an item, such as a text passage, into a vector. The query must use a compatible model and vector dimension. Elasticsearch stores dense or sparse vectors and can run approximate or exact nearest-neighbor search. Approximate search trades some recall for speed and scale; exact search scores every candidate and is useful for smaller or tightly filtered sets.

Vector similarity is not the same as understanding intent. Results depend on the embedding model, data domain, metric, filters, and retrieval configuration. Evaluate search quality on representative queries, and consider combining lexical and vector retrieval when exact terms still matter.

## Typical flow

1. Split source content into units that make sense to retrieve.
2. Generate embeddings using one compatible model.
3. Store vectors with identifiers and useful metadata.
4. Embed the query and retrieve nearest neighbors.
5. Apply access filters and evaluate result relevance.

## Related notes

- [[elasticsearch_overview]] — index and cluster mental model
- [[query_dsl]] — composing text, filters, and vector queries
- [[scoring_relevance]] — ranking search results

## References

- [Elasticsearch: Vector search](https://www.elastic.co/docs/solutions/search/vector)
- [Elasticsearch: kNN search](https://www.elastic.co/docs/solutions/search/vector/knn)

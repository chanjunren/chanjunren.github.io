🗓️ 21102024 1516
📎 #elasticsearch 

# es_search_after

## Deep Pagination Problem

The **deep pagination problem** occurs when you need to fetch results far beyond the first page in a dataset with many documents

##  Traditional pagination 
- with `from` and `size`
- Elasticsearch must 
	1. compute
	2. sort
	3. discard a large number of documents to provide the results for deep pages 

```ad-warning
This causes performance degradation because the number of discarded documents grows with each page
```

## `search_after`

Address this issue by avoiding the need to sort and compute all previous pages' results

Instead, it uses the **sort values** from the last document of the previous page to retrieve the next page directly, eliminating the need to discard documents.

### What is `_shard_doc`?

`_shard_doc` is a special **internal field** that Elasticsearch uses to refer to the **position of a document within a shard**. It is an efficient way to order documents without having to explicitly sort them by an application-defined field, such as a timestamp or an ID. When using `_shard_doc` for sorting, Elasticsearch returns the documents in the order they are stored in the shard, avoiding the overhead of computing and sorting by other fields.

#### Key Benefits of `_shard_doc`:

- **No Sorting Overhead**: Sorting by `_shard_doc` avoids the need to compute a sort order on other fields, which can be expensive, especially for deep pagination.
- **Efficient for Large Data**: If you need to iterate over a large number of documents (e.g., for processing or export), using `_shard_doc` is the most efficient way to paginate.

---

# References

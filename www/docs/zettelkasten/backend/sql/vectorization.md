🗓️ 17102026 2135

# vectorization

Vectorized query execution processes a batch of values through an operator instead of invoking the operator once per row.

A columnar engine may pass typed vectors from one operator to the next. Batching reduces per-row dispatch overhead and can improve cache use; some operations can also use SIMD instructions. The gains depend on the operator, data representation, batch size, and hardware. Vectorization does not automatically mean parallel execution.

For example, a filter can compare a vector of prices with a threshold and produce a selection vector of matching row positions. A later projection can use those positions to build result columns. This lets the engine process many rows while preserving row-level query semantics.

## Related notes

- [[column_oriented_storage]] — storing values by column
- [[olap]] — analytical query workloads
- [[processing_architectures]] — broader execution choices

## References

- [DuckDB: Execution format and vectors](https://duckdb.org/docs/current/internals/vector)

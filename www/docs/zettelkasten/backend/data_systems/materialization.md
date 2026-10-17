🗓️ 03022025 1200

# materialization

**Materialization** stores an intermediate or final computation result so later work can read it instead of recomputing it. A query engine may materialize temporary results during execution; a [[materialized_view]] persists a query result across reads.

## Why an engine materializes results

- An operator needs to read its full input before producing output, such as a sort.
- A result is reused by multiple parts of a plan.
- Memory limits require the engine to spill intermediate data to disk.

Materialization can reduce repeated work, but it adds memory, storage, or I/O cost. Whether it helps depends on reuse, result size, and the execution plan.

## References

- [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
- [[materialized_view]]

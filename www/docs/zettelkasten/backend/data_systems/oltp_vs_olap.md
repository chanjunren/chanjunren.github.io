🗓️ 01112024 2108
📎 #data_processing #database

# oltp_vs_olap

[[oltp]] and [[olap]] describe workload patterns. A system may support both patterns, but mixed workloads can compete for compute, memory, and I/O.

| Dimension | OLTP workload | OLAP workload |
|---|---|---|
| Goal | Serve application transactions | Analyze data and answer aggregate questions |
| Typical access | Small set of rows, frequent reads and writes | Large scans, joins, and aggregations |
| Response objective | Low and predictable request latency | Complete complex analysis within an acceptable time |
| Data layout | Often row-oriented, with indexes for point access | Often column-oriented or otherwise scan-optimized |
| Common consistency need | Current operational state | Freshness may range from seconds to scheduled batches |

These are tendencies, not rules. Analytical systems can accept updates, and operational databases can run analytical queries. [[htap]] describes systems designed to serve both kinds of work.

## References

- [Oracle: What is OLTP?](https://www.oracle.com/sg/database/what-is-oltp/)
- [AWS: What is OLAP?](https://aws.amazon.com/what-is/olap/)

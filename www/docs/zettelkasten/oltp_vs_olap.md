🗓️ 01112024 2108
📎 #data_processing #database

# oltp_vs_olap

| [[oltp]] Systems                                                                              | [[olap]] systems                                                                   |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Large number of transactions by large number of people                                        | Querying many records                                                              |
| Fast response                                                                                 | Response can be much much slower than that of OLTP                                 |
| Modify small amounts of data **frequently** and usually involve a balance of reads and writes | **Do not modify data at all** -  usually read-intensive                            |
| **Indexed data** to improve response times                                                    | Store data in **columnar format** to allow easy access to large numbers of records |
| Frequent / concurrent database backups                                                        | Far less frequent database backup                                                  |
| Relatively little storage space                                                               | Significant storage space requirements (a lot of data)                             |
| Simple queries involving just one or a few records                                            | Run complex queries involving large numbers of records                             |

---


# References
- https://www.oracle.com/sg/database/what-is-oltp/

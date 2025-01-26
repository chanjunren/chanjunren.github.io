****🗓️ 01112024 2102
📎 #data_processing

# online_transactional_processing

```ad-tldr
Type of data processing for large number of **concurrent transactions**

Typically user facing
```

## Access Pattern

> Usually only touch a small number of records in one query

- Application requests records using some kind of key, and the storage engine uses an index to find the data for the requested key
- Disk seek time is often the bottleneck

## Requirements
| Requirement                             | Description                                                           |
| --------------------------------------- | --------------------------------------------------------------------- |
| [[ACID]] compliant                      | Refer to internal link                                                |
| Concurrent                              | Able to handle large amounts of **concurrent** operations             |
| Scale                                   | Must be able to scale up / down to meet demand irrespective of volume |
| Availability                            | Must always be available / always ready to accept transactions        |
| High throughput and short response time | Nanoseconds / even shorter response times                             |
| Reliability                             | Typically read / manipulate selective & small amounts of data         |
| Security                                | Since OLTP can store sensitive customer information                   |
| Recoverability                          | Must have the ability to                                              |

> Relational DBs were built specifically for transaction applications

---

# References
- https://www.oracle.com/sg/database/what-is-oltp/
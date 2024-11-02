🗓️ 01112024 2102
📎 #data_processing

# online_transactional_processing

```ad-tldr
Type of data processing for large number of concurrent transactions
```

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
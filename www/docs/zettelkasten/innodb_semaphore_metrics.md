🗓️ 13082024 1015
📎 #deadlock #sql #mysql

# innodb_semaphore_metrics

## `SHOW ENGINE INNODB STATUS;` study
```
----------
SEMAPHORES
----------
OS WAIT ARRAY INFO: reservation count 9441065
OS WAIT ARRAY INFO: signal count 8293591
RW-shared spins 0, rounds 29778623, OS waits 5644464
RW-excl spins 0, rounds 52192763, OS waits 846515
RW-sx spins 102704, rounds 1242783, OS waits 15699
Spin rounds per wait: 29778623.00 RW-shared, 52192763.00 RW-excl, 12.10 RW-sx
```

**OS WAIT ARRAY INFO**

| Term                 | Description                                  |
| -------------------- | -------------------------------------------- |
| `reservation  count` | number of times threads have reserved a spot |
| `signal count`       | number of times threads have been signalled  |

**Sempaphores**

| Sempaphore type | Description                                                                |
| --------------- | -------------------------------------------------------------------------- |
| `RW-shared`     | used for shared access (read)                                              |
| `RW-excl`       | used for exclusive access (write)                                          |
| `RW-sx`         | for special case where thread upgrades from `shared` to `exclusive` access |

| Metric                 | Description                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `spins`                | number of times a thread has "spun" (busy-waited) while trying to acquire the semaphore     |
| `rounds`               | total number of times threads have attempted to acquire the semaphore                       |
| `OS waits`             | number of times threads have had to wait in OS's wait queue because semaphore not available |
| `Spin rounds per wait` | The average number of spin attempts before resorting to an OS wait                          |

---

# References
- https://dev.mysql.com/doc/refman/8.4/en/innodb-deadlock-example.html
- gemini
🗓️ 20052025 0952

# timeout_configs

Timeouts limit different waits in a request path. Set each from the service's latency budget and downstream behavior; values with similar names often govern different phases.

## HikariCP

| Setting | Controls | HikariCP default |
|---|---|---:|
| `connectionTimeout` | Wait for a pooled connection to become available. | 30 seconds |
| `validationTimeout` | Check whether a connection is alive. Must be below `connectionTimeout`. | 5 seconds |
| `idleTimeout` | Retire an idle connection when the pool has more than `minimumIdle`. | 10 minutes |
| `maxLifetime` | Retire a connection after its lifetime; in-use connections retire when returned. | 30 minutes |
| `keepaliveTime` | Validate an idle connection to prevent it expiring in the network path. | 2 minutes |

Defaults can change by HikariCP release. Set connection lifetime below database or network limits where needed.

## MySQL

`wait_timeout` controls how long the server waits for activity on a noninteractive connection before closing it. At connection start, a session's value is initialized from `wait_timeout` or `interactive_timeout`, depending on the client connection mode. In MySQL 8.4, `wait_timeout` defaults to 28,800 seconds.

```sql
SHOW VARIABLES LIKE '%timeout%';
```

This lists server settings, not application request deadlines. A pool's lifetime, a JDBC acquisition timeout, a SQL statement timeout, and the server's idle timeout should be configured as separate controls.

## References

- [HikariCP: Configuration](https://github.com/brettwooldridge/HikariCP#configuration-knobs-baby)
- [MySQL 8.4: Server system variables](https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html)

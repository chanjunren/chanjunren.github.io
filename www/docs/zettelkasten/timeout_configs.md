🗓️ 20052025 0952

# timeout_configs

## hikariCP

| variable      | description                                                                                        | default |
| ------------- | -------------------------------------------------------------------------------------------------- | ------- |
| maxLifetime   | How long a connection is kept before hikari closes + replaces it (regardless of whether it is act) | 30 min  |
| keepaliveTime | how often to ping idle connections                                                                 |         |
| idleTimeout   | How long an idle connection stays in pool before Hikari removes it	                                |         |


## mysql

| variable            | description                                                                         |
| ------------------- | ----------------------------------------------------------------------------------- |
| `wait_timeout`      | How long (in seconds) the server waits to kill an idle connection (JDBC / HikariCP) |
| interactive_timeout | How long server waits to kill an interactive session (CLI / GUI)                    |
```
SHOW VARIABLES LIKE '%timeout%';
```

---
## References
- https://github.com/brettwooldridge/HikariCP?tab=readme-ov-file#gear-configuration-knobs-baby
- ChatGPT
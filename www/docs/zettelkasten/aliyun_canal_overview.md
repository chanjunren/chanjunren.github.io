🗓️ 05042024 1432

# aliyun_canal_overview

```ad-info
Data synchronization system based on MySQL binary log
```

## Use case

- **High performance, real-timed data synchronisation**

## Features

- Supports all platforms
- Prometheus monitoring
- Canal Server / Client supports HA / Scalability
  - Powered by Apache ZooKeeper
- Docker

## Implementation

### MySQL Master-Slave Replication Implementation

- `master` records changes to _binlog_
- `slave` copies `master`'s binlog to _relay log_
- `slave` redo events in `relay log` > updates data

### Canal

- Simulates `slave` interaction protocol
- Sends `dump` protoocl to MySQL master server
- Parses binary log to own data type

---

## References

- https://github.com/alibaba/canal/wiki/Introduction
- https://github.com/alibaba/canal/wiki/Performance

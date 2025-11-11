🗓️ 11112024 1455

# docker_volumes

**Core Concept**:
- Persistent data storage mechanism for Docker containers
- Exists outside container filesystem
- Survives container deletion and recreation
- Managed by Docker or mounted from host filesystem

## Why It Matters

- **Data persistence**: Container data is ephemeral by default
- **Data sharing**: Multiple containers can share same volume
- **Performance**: Better I/O performance than bind mounts on some platforms

## When to Use

- Need **persistent data** beyond container lifecycle (databases, uploads)
- Want **data sharing** between containers
- Need **backup and restore** capabilities
- Want **Docker-managed storage** with better performance
- Need **data migration** between hosts
- Want to **separate data from container**

## When Not to Use

- **Temporary data** that doesn't need persistence (use tmpfs)
- **Configuration files** in development (bind mounts more convenient)
- **Source code** during development (bind mounts for live reload)
- **Read-only data** that's part of image (bake into image instead)

## Trade-offs

**Benefits:**
- Survives container deletion
- Managed by Docker (automatic cleanup)
- Better performance than bind mounts
- Works across different host OSs
- Can be backed up and restored
- Shared between containers

**Drawbacks:**
- Less transparent than bind mounts
- Harder to locate on host filesystem
- Requires Docker commands to manage
- Can accumulate and consume disk space
- Cleanup requires explicit removal

## Key Distinctions

**Volume vs Bind Mount:**
- **Volume**: Docker-managed, stored in Docker area (`/var/lib/docker/volumes/`)
- **Bind Mount**: Host directory mounted into container
- Volumes are portable; bind mounts are host-specific

**Named Volume vs Anonymous Volume:**
- **Named Volume**: Explicitly named, reusable, persistent
- **Anonymous Volume**: Auto-generated name, harder to manage
- Always use named volumes for important data

**Volume vs tmpfs:**
- **Volume**: Persistent on disk
- **tmpfs**: Stored in memory, lost on container stop
- Use tmpfs for sensitive temporary data

This enables data persistence for [[docker_container]] instances and is commonly configured in [[docker_compose]] files.

## Volume Types

**Named Volume:**
```bash
docker volume create my_volume
docker run -v my_volume:/data nginx
```

**Anonymous Volume:**
```bash
docker run -v /data nginx
# Docker generates random name
```

**Bind Mount:**
```bash
docker run -v /host/path:/container/path nginx
```

**tmpfs Mount:**
```bash
docker run --tmpfs /tmp nginx
```

## Common Pitfalls

```ad-danger
**Data loss with anonymous volumes**: Anonymous volumes are hard to track and may be deleted. Always use named volumes for important data.
```

```ad-warning
**Permission issues**: Container user may not have permissions on mounted volumes. Match UIDs or use proper permissions.
```

## Volume Management Commands

| Command | Purpose |
|---------|---------|
| `docker volume create name` | Create named volume |
| `docker volume ls` | List all volumes |
| `docker volume inspect name` | View volume details |
| `docker volume rm name` | Remove volume |
| `docker volume prune` | Remove unused volumes |
| `docker run -v name:/path` | Mount volume to container |
| `docker run -v /host:/container` | Bind mount host directory |
| `docker run --mount type=volume,src=name,dst=/path` | Explicit mount syntax |

## Volume in Docker Run

**Named Volume:**
```bash
docker run -d \
  --name myapp \
  -v mydata:/app/data \
  myimage
```

**Bind Mount:**
```bash
docker run -d \
  --name myapp \
  -v /host/config:/app/config:ro \
  myimage
```

**Multiple Volumes:**
```bash
docker run -d \
  --name myapp \
  -v data:/app/data \
  -v logs:/app/logs \
  -v /host/config:/app/config:ro \
  myimage
```

**Mount Syntax (Explicit):**
```bash
docker run -d \
  --mount type=volume,source=mydata,target=/app/data \
  --mount type=bind,source=/host/config,target=/app/config,readonly \
  myimage
```

## Volume in Docker Compose

**Named Volumes:**
```yaml
version: "3.8"

services:
  db:
    image: postgres:16
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Bind Mounts:**
```yaml
services:
  app:
    image: myapp
    volumes:
      - ./config:/app/config:ro
      - ./logs:/app/logs
```

**Mixed Usage (From Your docker-compose.yml):**
```yaml
services:
  backies:
    volumes:
      # Bind mount for config (read-only)
      - ../../config/config.toml:/app/config/config.toml:ro

  postgres:
    volumes:
      # Named volume for data persistence
      - postgres_data:/var/lib/postgresql/data
      # Bind mount for init scripts (read-only)
      - ../../migrations:/docker-entrypoint-initdb.d:ro

  prometheus:
    volumes:
      # Bind mount for config
      - ../../config/prometheus.local.yml:/etc/prometheus/prometheus.yml:ro
      # Named volume for metrics data
      - prometheus_data:/prometheus

volumes:
  postgres_data:
  prometheus_data:
```

**Why This Pattern:**
- **Named volumes** for data that must persist (database, metrics)
- **Bind mounts** for configuration files (easy to edit on host)
- **Read-only (`:ro`)** for configs to prevent container modification

## Volume Drivers

**Local Driver (Default):**
```yaml
volumes:
  mydata:
    driver: local
```

**Custom Driver Options:**
```yaml
volumes:
  mydata:
    driver: local
    driver_opts:
      type: nfs
      o: addr=192.168.1.100,rw
      device: ":/path/to/dir"
```

**Third-Party Drivers:**
- **NFS**: Network file system
- **AWS EBS**: Amazon Elastic Block Store
- **Azure File**: Azure file storage
- **GlusterFS**: Distributed filesystem

## Volume Permissions

**Permission Issues:**
```dockerfile
# In Dockerfile
RUN adduser -D -u 1000 appuser
USER appuser

# Volume owned by root, appuser can't write
# Solution: Change ownership or match UIDs
```

**Fix Permissions:**
```dockerfile
# Option 1: Change ownership in Dockerfile
RUN chown -R appuser:appuser /app/data

# Option 2: Use entrypoint script
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
```

**Entrypoint Script:**
```bash
#!/bin/sh
# Fix permissions on mounted volume
chown -R appuser:appuser /app/data
exec su-exec appuser "$@"
```

## Volume Backup and Restore

**Backup Volume:**
```bash
# Create backup container
docker run --rm \
  -v mydata:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz /data
```

**Restore Volume:**
```bash
# Restore from backup
docker run --rm \
  -v mydata:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/backup.tar.gz -C /
```

**Copy Between Volumes:**
```bash
docker run --rm \
  -v source_volume:/source \
  -v dest_volume:/dest \
  alpine cp -a /source/. /dest/
```

## Volume Inspection

**View Volume Details:**
```bash
docker volume inspect postgres_data
```

**Output:**
```json
[
  {
    "CreatedAt": "2025-11-11T14:30:00Z",
    "Driver": "local",
    "Labels": {},
    "Mountpoint": "/var/lib/docker/volumes/postgres_data/_data",
    "Name": "postgres_data",
    "Options": {},
    "Scope": "local"
  }
]
```

**Find Volume Location:**
```bash
docker volume inspect postgres_data --format '{{ .Mountpoint }}'
# /var/lib/docker/volumes/postgres_data/_data
```

## Volume Cleanup

**Remove Specific Volume:**
```bash
docker volume rm mydata
```

**Remove All Unused Volumes:**
```bash
docker volume prune
```

**Remove Volumes with Compose:**
```bash
# Stop and remove containers + volumes
docker-compose down -v
```

```ad-warning
**Prune carefully**: `docker volume prune` removes ALL unused volumes. Ensure no important data is orphaned.
```

## Best Practices

**Always Use Named Volumes for Data:**
```yaml
# Good
volumes:
  - postgres_data:/var/lib/postgresql/data

# Bad (anonymous)
volumes:
  - /var/lib/postgresql/data
```

**Read-Only When Possible:**
```yaml
volumes:
  - ./config:/app/config:ro
```

**Separate Data from Code:**
```yaml
services:
  app:
    volumes:
      # Data (persistent)
      - app_data:/app/data
      # Logs (persistent)
      - app_logs:/app/logs
      # Code (bind mount for dev)
      - ./src:/app/src
```

**Volume Labels for Organization:**
```yaml
volumes:
  postgres_data:
    labels:
      com.example.description: "PostgreSQL data"
      com.example.environment: "production"
```

**Backup Strategy:**
- Regular automated backups
- Test restore procedures
- Store backups off-host
- Version control backup scripts

## Performance Considerations

**Volume vs Bind Mount Performance:**
- **Linux**: Similar performance
- **macOS/Windows**: Volumes significantly faster (no filesystem translation)
- Use volumes for I/O intensive workloads on non-Linux hosts

**tmpfs for Temporary Data:**
```bash
docker run --tmpfs /tmp:rw,size=100m,mode=1777 nginx
```

**Volume Caching (macOS/Windows):**
```yaml
volumes:
  - ./src:/app/src:cached     # Host writes, container reads
  - ./src:/app/src:delegated  # Container writes, host reads
```

---

## References

- https://docs.docker.com/storage/volumes/
- https://docs.docker.com/storage/bind-mounts/


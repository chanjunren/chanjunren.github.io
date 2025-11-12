🗓️ 11112024 1455

# docker_volumes

**What it is:**
- Persistent data storage for containers
- Exists outside container filesystem
- Survives container deletion and recreation

**Problem it solves:**
- Containers are ephemeral - deleting container destroys all data inside
- For databases, uploaded files, or any persistent data, this is unacceptable
- Volumes separate data from container lifecycle

## Volume Types

### Named volumes
- Docker-managed storage with explicit names
- Created with `docker volume create` or automatically when referenced
- Stored in Docker's managed area
- Use for databases, application data, anything that needs to persist

### Bind mounts
- Map host directory into container
- Directory exists on your host filesystem
- Use for development when you want live code reloading or need direct access to files

### tmpfs mounts
- In-memory storage, lost when container stops
- Use for sensitive temporary data you don't want written to disk

Pattern: Named volumes for production data, bind mounts for development, tmpfs for temporary secrets.

## Named vs Anonymous Volumes

Named volumes:
- Explicit names you control (`postgres_data`)
- Easy to track and manage

Anonymous volumes:
- Random names (`a8f3b2e...`)
- Hard to track, easy to accidentally delete with `docker volume prune`

Always use named volumes for important data.

## Sharing Data

Multiple [[docker_container]] instances can mount same volume:
- Common in [[docker_compose]] where multiple services need shared files
- Changes by one container immediately visible to others

Warning: Concurrent writes to same files can cause corruption. Design application to handle this or use file locking.

## Volume vs Bind Mount Trade-offs

### Volumes
- Managed by Docker
- Better performance on Mac/Windows
- Work same across different host OSs
- Can be backed up with Docker commands
- Harder to find on host filesystem

### Bind mounts
- Full control over host path
- Easy to edit files directly on host
- Host-specific paths reduce portability
- Can have permission issues between host and container users

Choose volumes when you want Docker to manage storage and performance. Choose bind mounts when you need direct access to files on host.

## Persistence in Compose

In [[docker_compose]], declare volumes in two places:
1. Within services - mount the volume to a container path
2. At top level - declare the volume exists

This pattern ensures data persists between `docker compose down` and `docker compose up`. Without declaring volume at top level, Docker creates anonymous volume and data is lost on recreation.

## Common Pitfalls

```ad-danger
**Forgetting to declare volumes in Compose**: If you only mount path without declaring volume, Docker creates anonymous volume. When you recreate stack, you get new anonymous volume and data is gone.
```

```ad-warning
**Permission mismatches**: Container runs as user 999, volume owned by root on host. Result: permission denied. Solution: match UIDs between container and host, or configure container to run as specific user.
```

---

## References

- https://docs.docker.com/storage/volumes/
- https://docs.docker.com/compose/compose-file/compose-file-v3/#volumes

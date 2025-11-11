🗓️ 11112024 1450

# docker_compose

**Core Concept**:
- Tool for defining and running multi-container Docker applications
- Uses YAML file to configure application services
- Single command to start/stop entire application stack
- Manages container dependencies, networks, and volumes

## Why It Matters

- **Simplified orchestration**: Define complex multi-container apps declaratively
- **Reproducible environments**: Same configuration across dev, test, prod
- **Dependency management**: Automatic service startup ordering

## When to Use

- **Multi-container applications** (app + database + cache)
- **Local development** environments with multiple services
- **Integration testing** requiring full stack
- **Small production deployments** (single host)
- Need **service dependencies** and startup ordering
- Want **declarative configuration** over imperative commands

## When Not to Use

- **Single container** applications (use `docker run`)
- **Production at scale** (use Kubernetes, Docker Swarm)
- **Multi-host deployments** (Compose is single-host by default)
- Need **advanced orchestration** (auto-scaling, rolling updates)
- **Complex networking** across multiple hosts

## Trade-offs

**Benefits:**
- Simple YAML configuration
- Easy local development setup
- Automatic network creation
- Volume management
- Environment variable substitution
- Service dependency handling

**Drawbacks:**
- Single host limitation
- No built-in load balancing
- Limited scaling capabilities
- No automatic failover
- Not production-grade for large deployments

## Key Distinctions

**Docker Compose vs Kubernetes:**
- **Compose**: Single-host, simple, development-focused
- **Kubernetes**: Multi-host, complex, production-grade
- Compose for dev/test; Kubernetes for production at scale

**Docker Compose vs Docker Swarm:**
- **Compose**: Orchestration tool, not a cluster manager
- **Swarm**: Docker's native clustering solution
- Compose files can be used with Swarm

This orchestrates multiple [[docker_container]] instances and manages [[docker_volumes]] and [[docker_networking]] automatically.

## Basic Structure

```yaml
version: "3.8"

services:
  service-name:
    image: image:tag
    # or
    build: ./path
    ports:
      - "host:container"
    environment:
      - KEY=value
    volumes:
      - host:container
    depends_on:
      - other-service

volumes:
  volume-name:

networks:
  network-name:
```

## Real-World Example (From Your docker-compose.yml)

```yaml
version: "3.8"

services:
  backies:
    build:
      context: ../..
      dockerfile: deployments/docker/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - ENVIRONMENT=development
    volumes:
      - ../../config/config.toml:/app/config/config.toml:ro
    depends_on:
      - postgres
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", 
             "http://localhost:3000/health/live"]
      interval: 30s
      timeout: 3s
      start_period: 5s
      retries: 3

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=backies
      - POSTGRES_PASSWORD=backies_dev
      - POSTGRES_DB=backies
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ../../migrations:/docker-entrypoint-initdb.d:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U backies"]
      interval: 10s
      timeout: 5s
      retries: 5

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ../../config/prometheus.local.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
    restart: unless-stopped
    depends_on:
      - backies

volumes:
  postgres_data:
  prometheus_data:
```

**What This Does:**
- **3 services**: Application, database, monitoring
- **Dependencies**: Postgres starts before app, app before Prometheus
- **Health checks**: Automatic restart on failure
- **Persistent data**: Named volumes for database and metrics
- **Configuration**: Mounted config files
- **Networking**: Automatic network for service communication

## Common Pitfalls

```ad-warning
**depends_on doesn't wait for ready**: Only waits for container start, not application readiness. Use health checks or wait scripts.
```

```ad-danger
**Secrets in compose file**: Never commit passwords. Use environment files (`.env`) or Docker secrets for sensitive data.
```

## Essential Commands

| Command | Purpose |
|---------|---------|
| `docker-compose up` | Start all services |
| `docker-compose up -d` | Start in detached mode |
| `docker-compose down` | Stop and remove containers |
| `docker-compose down -v` | Also remove volumes |
| `docker-compose ps` | List running services |
| `docker-compose logs` | View logs from all services |
| `docker-compose logs -f service` | Follow logs for specific service |
| `docker-compose exec service sh` | Execute command in service |
| `docker-compose build` | Build/rebuild services |
| `docker-compose pull` | Pull latest images |
| `docker-compose restart service` | Restart specific service |
| `docker-compose stop` | Stop services without removing |
| `docker-compose start` | Start stopped services |

## Service Configuration Options

**Build Configuration:**
```yaml
services:
  app:
    build:
      context: ./app
      dockerfile: Dockerfile.dev
      args:
        - BUILD_ENV=development
```

**Port Mapping:**
```yaml
ports:
  - "8080:80"           # host:container
  - "127.0.0.1:8080:80" # bind to specific interface
  - "8080-8085:80-85"   # port range
```

**Environment Variables:**
```yaml
environment:
  - KEY=value
  - KEY                 # from host environment
env_file:
  - .env
  - .env.local
```

**Volumes:**
```yaml
volumes:
  - ./host/path:/container/path          # bind mount
  - ./config.yml:/app/config.yml:ro      # read-only
  - named_volume:/data                   # named volume
  - /container/path                      # anonymous volume
```

**Restart Policies:**
```yaml
restart: "no"              # Never restart
restart: always            # Always restart
restart: on-failure        # Restart on error
restart: unless-stopped    # Restart unless manually stopped
```

## Networking

**Default Network:**
- Compose creates default network for all services
- Services can reach each other by service name
- Example: `postgres:5432` from app service

**Custom Networks:**
```yaml
services:
  frontend:
    networks:
      - frontend-net
  backend:
    networks:
      - frontend-net
      - backend-net
  database:
    networks:
      - backend-net

networks:
  frontend-net:
  backend-net:
```

**Network Isolation:**
- Services only communicate if on same network
- Useful for security boundaries

## Volume Management

**Named Volumes:**
```yaml
volumes:
  postgres_data:              # Default driver
  custom_data:
    driver: local
    driver_opts:
      type: none
      device: /path/on/host
      o: bind
```

**Volume Lifecycle:**
- Created automatically on first `up`
- Persist after `down` (unless `-v` flag)
- Shared across container restarts
- Can be backed up and restored

## Dependency Management

**Basic Dependencies:**
```yaml
services:
  app:
    depends_on:
      - db
      - cache
```

**With Health Checks (Compose v2.1+):**
```yaml
services:
  app:
    depends_on:
      db:
        condition: service_healthy
  db:
    healthcheck:
      test: ["CMD", "pg_isready"]
      interval: 10s
```

## Environment Files

**.env File:**
```env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
APP_PORT=3000
```

**Usage in Compose:**
```yaml
services:
  db:
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
  app:
    ports:
      - "${APP_PORT}:3000"
```

**Best Practice:**
- Add `.env` to `.gitignore`
- Provide `.env.example` with dummy values
- Use different `.env` files per environment

## Best Practices

**Service Naming:**
```yaml
# Good: Descriptive names
services:
  api-gateway:
  user-service:
  postgres-db:
```

**Health Checks:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**Resource Limits:**
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

**Logging:**
```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Development vs Production

**Development:**
```yaml
services:
  app:
    build: .
    volumes:
      - ./src:/app/src  # Live reload
    environment:
      - DEBUG=true
```

**Production:**
```yaml
services:
  app:
    image: registry/app:1.0.0
    restart: always
    environment:
      - DEBUG=false
    deploy:
      resources:
        limits:
          memory: 512M
```

**Multiple Compose Files:**
```bash
# Base configuration
docker-compose.yml

# Development overrides
docker-compose.override.yml

# Production
docker-compose.prod.yml

# Use specific file
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

---

## References

- https://docs.docker.com/compose/
- https://docs.docker.com/compose/compose-file/


🗓️ 11112024 1505

# docker_healthcheck

**Core Concept**:
- Mechanism to test if container is functioning correctly
- Runs periodic command inside container to verify health
- Reports health status: starting, healthy, unhealthy
- Enables automatic restart or replacement of unhealthy containers

## Why It Matters

- **Automatic recovery**: Orchestrators restart unhealthy containers
- **Load balancer integration**: Remove unhealthy instances from rotation
- **Early problem detection**: Catch issues before users affected

## When to Use

- **Production deployments** requiring high availability
- **Load-balanced services** needing health-based routing
- **Long-running services** that may degrade over time
- **Database connections** that may become stale
- **Microservices** with complex dependencies

## When Not to Use

- **Short-lived containers** (batch jobs, one-off tasks)
- **Development environments** where manual restart acceptable
- **Containers without health endpoints** (adds complexity)
- **Resource-constrained environments** (health checks consume resources)

## Trade-offs

**Benefits:**
- Automatic failure detection
- Self-healing systems
- Better uptime
- Integration with orchestrators
- Prevents routing to failed containers

**Drawbacks:**
- Resource overhead (CPU, memory)
- False positives can cause restarts
- Adds complexity to container config
- Requires proper health endpoint design
- Can mask underlying issues

## Key Distinctions

**Health Check vs Liveness Probe (Kubernetes):**
- **Docker Health Check**: Basic health monitoring
- **Kubernetes Liveness**: More sophisticated with readiness probes
- Docker health checks are simpler; K8s probes more configurable

**Healthy vs Running:**
- **Running**: Container process is active
- **Healthy**: Container is functioning correctly
- Container can be running but unhealthy

**Health Check vs Monitoring:**
- **Health Check**: Internal container-level check
- **Monitoring**: External system-level observability
- Health checks trigger restarts; monitoring provides insights

This enhances [[docker_container]] reliability and is commonly used in [[docker_compose]] production setups.

## Health States

| State | Description |
|-------|-------------|
| **starting** | Container starting, health check not yet passed |
| **healthy** | Health check passing consistently |
| **unhealthy** | Health check failing after retries |

**State Transitions:**
- Container starts → `starting`
- First successful check → `healthy`
- Check fails → remains `healthy` (until retries exhausted)
- Retries exhausted → `unhealthy`
- Check succeeds again → `healthy`

## Common Pitfalls

```ad-warning
**Too aggressive intervals**: Frequent health checks waste resources. Balance between responsiveness and overhead.
```

```ad-danger
**No start period**: Container may be marked unhealthy during initialization. Always set `start_period` for slow-starting apps.
```

## Dockerfile Health Check

**Basic Syntax:**
```dockerfile
HEALTHCHECK [OPTIONS] CMD command
```

**Options:**
- `--interval=DURATION` (default: 30s) - Time between checks
- `--timeout=DURATION` (default: 30s) - Max time for check to complete
- `--start-period=DURATION` (default: 0s) - Grace period during startup
- `--retries=N` (default: 3) - Consecutive failures before unhealthy

**HTTP Health Check:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
```

**Database Health Check:**
```dockerfile
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD pg_isready -U postgres || exit 1
```

**Custom Script:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s \
  CMD /app/healthcheck.sh
```

**Disable Health Check:**
```dockerfile
HEALTHCHECK NONE
```

## Docker Run Health Check

**Override Dockerfile Health Check:**
```bash
docker run -d \
  --name myapp \
  --health-cmd="curl -f http://localhost/health || exit 1" \
  --health-interval=30s \
  --health-timeout=3s \
  --health-retries=3 \
  --health-start-period=5s \
  myimage
```

## Docker Compose Health Check

**Basic Example:**
```yaml
services:
  api:
    image: myapi
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s
```

**Alternative Test Formats:**
```yaml
# CMD format (recommended)
test: ["CMD", "curl", "-f", "http://localhost/health"]

# CMD-SHELL format
test: ["CMD-SHELL", "curl -f http://localhost/health || exit 1"]

# Shell string (deprecated)
test: curl -f http://localhost/health || exit 1

# Disable
test: ["NONE"]
```

**Real-World Examples (From Your docker-compose.yml):**

**Application Health Check:**
```yaml
backies:
  healthcheck:
    test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", 
           "http://localhost:3000/health/live"]
    interval: 30s
    timeout: 3s
    start_period: 5s
    retries: 3
```

**Database Health Check:**
```yaml
postgres:
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U backies"]
    interval: 10s
    timeout: 5s
    retries: 5
```

**Why These Settings:**
- **Application**: 30s interval (not critical), 5s start period (quick startup)
- **Database**: 10s interval (more critical), no start period (fast startup)
- **Retries**: 3 for app (tolerant), 5 for DB (more conservative)

## Depends On with Health Checks

**Wait for Healthy Service:**
```yaml
version: "3.8"

services:
  db:
    image: postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    image: myapp
    depends_on:
      db:
        condition: service_healthy
```

**Dependency Conditions:**
- `service_started` - Default, just wait for container start
- `service_healthy` - Wait for health check to pass
- `service_completed_successfully` - Wait for container to exit with 0

## Health Check Commands

**HTTP Endpoint:**
```bash
# curl
curl -f http://localhost:8080/health || exit 1

# wget
wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# nc (netcat)
nc -z localhost 8080 || exit 1
```

**Database:**
```bash
# PostgreSQL
pg_isready -U username

# MySQL
mysqladmin ping -h localhost

# Redis
redis-cli ping

# MongoDB
mongo --eval "db.adminCommand('ping')"
```

**File Check:**
```bash
# Check if file exists
test -f /app/ready || exit 1

# Check file age
find /app/heartbeat -mmin -1 | grep -q . || exit 1
```

**Process Check:**
```bash
# Check if process running
pgrep -f myapp || exit 1

# Check specific PID
kill -0 $(cat /var/run/app.pid) || exit 1
```

## Health Check Best Practices

**Lightweight Checks:**
```dockerfile
# Good: Simple endpoint
HEALTHCHECK CMD curl -f http://localhost/health

# Bad: Heavy operation
HEALTHCHECK CMD curl -f http://localhost/run-full-test-suite
```

**Appropriate Intervals:**
```yaml
# Web service (less critical)
interval: 30s
timeout: 3s

# Database (more critical)
interval: 10s
timeout: 5s

# Background worker (least critical)
interval: 60s
timeout: 10s
```

**Start Period for Slow Apps:**
```yaml
# Application takes 30s to initialize
healthcheck:
  start_period: 40s  # Give extra buffer
  interval: 30s
```

**Meaningful Exit Codes:**
```bash
#!/bin/bash
# healthcheck.sh

# Check database connection
if ! pg_isready -U postgres; then
  echo "Database not ready"
  exit 1
fi

# Check critical service
if ! curl -f http://localhost:8080/health; then
  echo "Health endpoint failed"
  exit 1
fi

echo "All checks passed"
exit 0
```

## Health Endpoint Design

**Simple Health Endpoint:**
```go
// Go example
func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("OK"))
}
```

**Comprehensive Health Endpoint:**
```go
type HealthResponse struct {
    Status    string            `json:"status"`
    Timestamp time.Time         `json:"timestamp"`
    Checks    map[string]string `json:"checks"`
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
    health := HealthResponse{
        Status:    "healthy",
        Timestamp: time.Now(),
        Checks:    make(map[string]string),
    }

    // Check database
    if err := db.Ping(); err != nil {
        health.Status = "unhealthy"
        health.Checks["database"] = "failed"
    } else {
        health.Checks["database"] = "ok"
    }

    // Check cache
    if err := cache.Ping(); err != nil {
        health.Status = "degraded"
        health.Checks["cache"] = "failed"
    } else {
        health.Checks["cache"] = "ok"
    }

    statusCode := http.StatusOK
    if health.Status == "unhealthy" {
        statusCode = http.StatusServiceUnavailable
    }

    w.WriteHeader(statusCode)
    json.NewEncoder(w).Encode(health)
}
```

**Health vs Readiness:**
```go
// Liveness: Is the app alive?
func livenessHandler(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("alive"))
}

// Readiness: Can the app serve traffic?
func readinessHandler(w http.ResponseWriter, r *http.Request) {
    if !db.IsReady() || !cache.IsReady() {
        w.WriteHeader(http.StatusServiceUnavailable)
        return
    }
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("ready"))
}
```

## Monitoring Health Status

**Check Container Health:**
```bash
docker ps
# Shows health status in STATUS column
```

**Inspect Health:**
```bash
docker inspect --format='{{json .State.Health}}' container_name | jq
```

**Output:**
```json
{
  "Status": "healthy",
  "FailingStreak": 0,
  "Log": [
    {
      "Start": "2025-11-11T14:30:00Z",
      "End": "2025-11-11T14:30:01Z",
      "ExitCode": 0,
      "Output": "OK"
    }
  ]
}
```

**Filter by Health:**
```bash
# List only healthy containers
docker ps --filter health=healthy

# List unhealthy containers
docker ps --filter health=unhealthy
```

## Troubleshooting

**Health Check Failing:**
```bash
# View health check logs
docker inspect container_name | jq '.[0].State.Health.Log'

# Check last health check output
docker inspect --format='{{json .State.Health.Log}}' container_name | jq '.[-1]'

# Execute health check manually
docker exec container_name curl -f http://localhost/health
```

**Common Issues:**

**Timeout Too Short:**
```yaml
# Increase timeout
healthcheck:
  timeout: 10s  # Was 3s
```

**Missing Dependencies:**
```dockerfile
# Install curl for health check
RUN apt-get update && apt-get install -y curl
```

**Wrong Start Period:**
```yaml
# App takes 60s to start
healthcheck:
  start_period: 90s  # Increase from 5s
```

**False Positives:**
```bash
# Check if health endpoint is too sensitive
docker exec container_name curl -v http://localhost/health
```

## Integration with Orchestrators

**Docker Swarm:**
- Automatically removes unhealthy replicas
- Starts new replicas to maintain desired count

**Kubernetes:**
- Uses liveness and readiness probes (similar concept)
- More sophisticated than Docker health checks

**AWS ECS:**
- Integrates with ALB health checks
- Replaces unhealthy tasks

---

## References

- https://docs.docker.com/engine/reference/builder/#healthcheck
- https://docs.docker.com/compose/compose-file/#healthcheck


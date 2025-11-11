🗓️ 11112024 1445

# docker_multistage_build

**Core Concept**:
- Dockerfile with multiple `FROM` statements
- Each `FROM` starts a new build stage
- Copy artifacts from earlier stages to later stages
- Final image contains only what's needed for runtime

## Why It Matters

- **Smaller images**: Exclude build tools and dependencies from final image
- **Security**: Fewer packages mean smaller attack surface
- **Build efficiency**: Separate build and runtime environments

## When to Use

- **Compiled languages** (Go, Java, C++) where build tools not needed at runtime
- Need **separate build and runtime dependencies**
- Want **minimal production images** without build artifacts
- Need **different base images** for build vs runtime
- Want to **reduce image size** significantly (often 10x smaller)

## When Not to Use

- **Interpreted languages** where source code runs directly (unless optimizing dependencies)
- **Simple applications** with no build step
- **Development images** where build tools needed for debugging
- When **build caching** across stages causes confusion

## Trade-offs

**Benefits:**
- Dramatically smaller final images
- Improved security (fewer packages)
- Faster deployment (smaller transfer size)
- Cleaner separation of concerns
- No need for separate build scripts

**Drawbacks:**
- More complex Dockerfile
- Harder to debug build issues
- Need to explicitly copy artifacts
- Can't access build stage in final image
- Longer initial build time

## Key Distinctions

**Single-Stage vs Multi-Stage:**
- **Single-Stage**: All build tools in final image (bloated)
- **Multi-Stage**: Build tools only in build stage (lean)
- Multi-stage can reduce image from 1GB to 10MB

**Build Stage vs Runtime Stage:**
- **Build Stage**: Contains compilers, build tools, test dependencies
- **Runtime Stage**: Contains only runtime dependencies and binary
- Artifacts copied from build to runtime stage

This optimizes [[docker_image]] creation and is essential for production [[docker_container]] deployments.

## Basic Example

**Without Multi-Stage (Go):**
```dockerfile
FROM golang:1.23
WORKDIR /app
COPY . .
RUN go build -o app
CMD ["./app"]
# Result: ~800MB image
```

**With Multi-Stage (Go):**
```dockerfile
# Build stage
FROM golang:1.23 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o app

# Runtime stage
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/app .
CMD ["./app"]
# Result: ~10MB image
```

## Common Patterns

**Named Stages:**
```dockerfile
FROM golang:1.23 AS builder
# Build stage named "builder"

FROM alpine:latest
COPY --from=builder /app/app .
# Reference by name
```

**Multiple Build Stages:**
```dockerfile
# Stage 1: Dependencies
FROM node:18 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build
FROM node:18 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runtime
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

**Copy from External Image:**
```dockerfile
FROM alpine:latest
COPY --from=nginx:latest /etc/nginx/nginx.conf /nginx.conf
```

## Common Pitfalls

```ad-warning
**Missing runtime dependencies**: Ensure runtime stage includes all necessary libraries. Static binaries avoid this issue.
```

```ad-danger
**Copying entire context**: Don't `COPY . .` in build stage without `.dockerignore`. Excludes unnecessary files for faster builds.
```

## Real-World Example (From Your Dockerfile)

```dockerfile
# Stage 1: Build
FROM golang:1.23-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/api cmd/api/main.go

# Stage 2: Runtime
FROM alpine:latest
WORKDIR /app

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

# Create non-root user
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

# Copy binary from builder
COPY --from=builder /app/bin/api .

# Copy config directory
COPY --from=builder /app/config/config.example.toml ./config/

# Copy migrations
COPY --from=builder /app/migrations ./migrations/

# Change ownership
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

EXPOSE 3000

CMD ["./api"]
```

**Why This Works:**
- Builder stage: ~800MB (includes Go compiler, git, build tools)
- Runtime stage: ~20MB (only Alpine + binary + ca-certificates)
- 40x size reduction
- Improved security (no build tools in production)

## Build Flags for Static Binaries

**Go Static Binary:**
```dockerfile
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app
```

**Rust Static Binary:**
```dockerfile
RUN cargo build --release --target x86_64-unknown-linux-musl
```

**C++ Static Binary:**
```dockerfile
RUN g++ -static -o app main.cpp
```

## Target Specific Stage

**Build Only Build Stage:**
```bash
docker build --target builder -t myapp:builder .
```

**Use Cases:**
- Testing build stage independently
- Creating development images with build tools
- Debugging build issues

## Best Practices

**Order Dependencies First:**
```dockerfile
# Good: Dependencies cached separately
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build
```

**Use Minimal Base Images:**
```dockerfile
# Minimal options
FROM scratch              # Empty (only for static binaries)
FROM alpine:latest        # ~5MB
FROM distroless/static    # Google's minimal image
```

**Security in Runtime Stage:**
```dockerfile
# Create non-root user
RUN adduser -D -u 1000 appuser
USER appuser

# Install only runtime dependencies
RUN apk --no-cache add ca-certificates
```

**Clean Up in Build Stage:**
```dockerfile
RUN apt-get update && \
    apt-get install -y build-essential && \
    # Build steps
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

---

## References

- https://docs.docker.com/build/building/multi-stage/
- https://docs.docker.com/develop/develop-images/multistage-build/


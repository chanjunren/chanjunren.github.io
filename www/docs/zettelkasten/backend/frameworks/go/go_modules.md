🗓️ 26102024 1515

# go_modules

**Core Concept**: Go modules are Go's dependency management system - each module is defined by a `go.mod` file that tracks dependencies and versions.

## Initialize Module

```bash
go mod init github.com/username/project
```

Creates `go.mod`:
```go
module github.com/username/project

go 1.21
```

## Adding Dependencies

```bash
# Automatically adds to go.mod
go get github.com/go-chi/chi/v5

# Specific version
go get github.com/pkg/errors@v0.9.1

# Latest
go get -u github.com/pkg/errors
```

## go.mod File

```go
module github.com/username/yiyu-backend

go 1.21

require (
    github.com/go-chi/chi/v5 v5.0.11
    github.com/go-chi/cors v1.2.1
)
```

## go.sum File

Checksums of dependencies (don't edit manually):
```
github.com/go-chi/chi/v5 v5.0.11 h1:BnpYbFZ...
github.com/go-chi/chi/v5 v5.0.11/go.mod h1:DslCQ...
```

## Common Commands

```bash
go mod tidy        # Add missing, remove unused
go mod download    # Download dependencies
go mod verify      # Verify checksums
go mod vendor      # Copy deps to vendor/
go get -u ./...    # Update all dependencies
```

## Import Paths

```go
import (
    "fmt"                               // standard library
    "github.com/go-chi/chi/v5"         // external package
    "github.com/user/project/internal" // internal package
)
```

## Module Versioning

Semantic versioning: `vMAJOR.MINOR.PATCH`

```bash
go get github.com/pkg/errors@v0.9.1    # Specific version
go get github.com/pkg/errors@latest    # Latest
go get github.com/pkg/errors@v0.8.0    # Older version
```

## Replace Directive

For local development:
```go
replace github.com/user/library => ../library
```

## Exclude Directive

```go
exclude github.com/broken/pkg v1.2.3
```

## Internal Packages

```
project/
├── internal/      # Can't be imported by other projects
│   └── helpers/
└── pkg/           # Can be imported
    └── utils/
```

**Go enforces**: Other projects can't import from `internal/`

## Best Practices

1. **Commit go.mod and go.sum** - Both are source files
2. **Run go mod tidy regularly** - Keep dependencies clean
3. **Use semantic versioning** - v1.x.x for stable APIs
4. **Pin versions in production** - Don't use `latest`
5. **Vendor for reproducible builds** - `go mod vendor` if needed

```ad-tip
Run `go mod tidy` before committing to clean up unused dependencies.
```

### References

- [Go Modules Reference](https://go.dev/ref/mod)
- [Using Go Modules](https://go.dev/blog/using-go-modules)


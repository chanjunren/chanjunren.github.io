🗓️ 30102024 1445

# go_commands_cheatsheet

**Core Concept**: Essential Go CLI commands for development, testing, building, and dependency management.

## Module Management

### Initialize New Module
| Command                               | Description            |
|---------------------------------------|------------------------|
| `go mod init <module-name>`           | Create new go.mod file |
| `go mod init github.com/user/project` | With full import path  |

### Dependency Operations
| Command                   | Description                               |
|---------------------------|-------------------------------------------|
| `go get <package>`        | Add dependency to project                 |
| `go get <package>@latest` | Get latest version                        |
| `go get <package>@v1.2.3` | Get specific version                      |
| `go get -u`               | Update all dependencies                   |
| `go get -u <package>`     | Update specific package                   |
| `go mod download`         | Download dependencies to cache            |
| `go mod tidy`             | Add missing, remove unused dependencies   |
| `go mod verify`           | Verify dependencies haven't been modified |

### Module Information
| Command                          | Description                   |
|----------------------------------|-------------------------------|
| `go list -m all`                 | List all dependencies         |
| `go list -m -versions <package>` | List available versions       |
| `go mod graph`                   | Print module dependency graph |
| `go mod why <package>`           | Explain why package is needed |

## Running Code

### Execute
| Command                  | Description                      |
|--------------------------|----------------------------------|
| `go run main.go`         | Compile and run single file      |
| `go run .`               | Run package in current directory |
| `go run cmd/api/main.go` | Run specific file path           |

### Build
| Command                    | Description                          |
|----------------------------|--------------------------------------|
| `go build`                 | Compile package in current directory |
| `go build -o binary-name`  | Specify output binary name           |
| `go build cmd/api/main.go` | Build specific file                  |
| `go build ./...`           | Build all packages recursively       |

### Install
| Command                       | Description                        |
|-------------------------------|------------------------------------|
| `go install`                  | Compile and install to $GOPATH/bin |
| `go install <package>@latest` | Install tool globally              |

## Testing

### Run Tests
| Command                             | Description                  |
|-------------------------------------|------------------------------|
| `go test`                           | Run tests in current package |
| `go test ./...`                     | Run all tests recursively    |
| `go test -v`                        | Verbose output               |
| `go test -run TestName`             | Run specific test            |
| `go test -run TestName/SubtestName` | Run specific subtest         |

### Test Coverage
| Command                              | Description                    |
|--------------------------------------|--------------------------------|
| `go test -cover`                     | Show coverage percentage       |
| `go test -coverprofile=coverage.out` | Generate coverage file         |
| `go tool cover -html=coverage.out`   | View coverage in browser       |
| `go test -covermode=count`           | Track how many times lines run |

### Benchmarks
| Command                        | Description                     |
|--------------------------------|---------------------------------|
| `go test -bench .`             | Run all benchmarks              |
| `go test -bench BenchmarkName` | Run specific benchmark          |
| `go test -benchmem`            | Include memory allocation stats |
| `go test -benchtime=10s`       | Run for specific duration       |

### Test Options
| Command                | Description             |
|------------------------|-------------------------|
| `go test -short`       | Skip long-running tests |
| `go test -parallel 4`  | Set parallelism level   |
| `go test -timeout 30s` | Set timeout             |
| `go test -race`        | Enable race detector    |

## Code Quality

### Formatting
| Command            | Description                           |
|--------------------|---------------------------------------|
| `go fmt`           | Format code in current package        |
| `go fmt ./...`     | Format all packages recursively       |
| `gofmt -w file.go` | Format and write specific file        |
| `gofmt -d .`       | Show formatting diff without changing |

### Linting
| Command             | Description                          |
|---------------------|--------------------------------------|
| `go vet`            | Run static analysis                  |
| `go vet ./...`      | Vet all packages                     |
| `golint ./...`      | Run golint (install separately)      |
| `staticcheck ./...` | Run staticcheck (install separately) |

### Race Detection
| Command                | Description              |
|------------------------|--------------------------|
| `go run -race main.go` | Run with race detector   |
| `go test -race ./...`  | Test with race detector  |
| `go build -race`       | Build with race detector |

## Documentation

### View Docs
| Command                     | Description                |
|-----------------------------|----------------------------|
| `go doc <package>`          | Show package documentation |
| `go doc <package>.<Symbol>` | Show symbol documentation  |
| `go doc -all <package>`     | Show all documentation     |
| `godoc -http=:6060`         | Start local doc server     |

## Workspace Management

### Clean Cache
| Command               | Description         |
|-----------------------|---------------------|
| `go clean`            | Remove object files |
| `go clean -cache`     | Remove build cache  |
| `go clean -modcache`  | Remove module cache |
| `go clean -testcache` | Remove test cache   |

### Environment
| Command                  | Description                        |
|--------------------------|------------------------------------|
| `go env`                 | Print all Go environment variables |
| `go env GOPATH`          | Print specific variable            |
| `go env -w GOPATH=/path` | Set environment variable           |
| `go version`             | Show Go version                    |

## Module Cache Location

### Default Paths
| Type                | Path                         |
|---------------------|------------------------------|
| Modules             | `~/go/pkg/mod/`              |
| Binaries            | `~/go/bin/`                  |
| Build cache (macOS) | `~/Library/Caches/go-build/` |

## Common Workflows

### Starting New Project
| Step | Command                               |
|------|---------------------------------------|
| 1    | `mkdir project && cd project`         |
| 2    | `go mod init github.com/user/project` |
| 3    | Create main.go                        |
| 4    | `go mod tidy`                         |
| 5    | `go run .`                            |

### Adding Dependency
| Step | Command                          |
|------|----------------------------------|
| 1    | `go get github.com/package/name` |
| 2    | Import in code                   |
| 3    | `go mod tidy`                    |

### Before Committing
| Step | Command         |
|------|-----------------|
| 1    | `go fmt ./...`  |
| 2    | `go vet ./...`  |
| 3    | `go test ./...` |
| 4    | `go mod tidy`   |

### Building for Production
| Step | Command              |
|------|----------------------|
| 1    | `go test ./...`      |
| 2    | `go build -o app`    |
| 3    | Test binary: `./app` |

### Updating Dependencies
| Step | Command           |
|------|-------------------|
| 1    | `go get -u ./...` |
| 2    | `go mod tidy`     |
| 3    | `go test ./...`   |

## Build Flags

### Common Flags
| Flag                             | Description                 |
|----------------------------------|-----------------------------|
| `-o name`                        | Output binary name          |
| `-v`                             | Verbose output              |
| `-race`                          | Enable race detector        |
| `-ldflags "-X main.version=1.0"` | Set variables at build time |
| `-tags tag1,tag2`                | Build tags                  |

### Cross-Compilation
| Platform  | Command                              |
|-----------|--------------------------------------|
| Linux     | `GOOS=linux GOARCH=amd64 go build`   |
| Windows   | `GOOS=windows GOARCH=amd64 go build` |
| macOS ARM | `GOOS=darwin GOARCH=arm64 go build`  |

## Debugging

### Print Build Info
| Command                    | Description               |
|----------------------------|---------------------------|
| `go version -m binary`     | Show build info of binary |
| `go list -f '{{.Deps}}' .` | List dependencies         |
| `go list -json .`          | Package info as JSON      |

### Troubleshooting
| Command                    | Description                     |
|----------------------------|---------------------------------|
| `go clean -modcache`       | Clear module cache if corrupted |
| `go mod download`          | Re-download dependencies        |
| `go mod verify`            | Check dependency integrity      |
| `rm go.sum && go mod tidy` | Regenerate go.sum               |

## Performance

### Profiling
| Command                             | Description     |
|-------------------------------------|-----------------|
| `go test -cpuprofile=cpu.out`       | CPU profile     |
| `go test -memprofile=mem.out`       | Memory profile  |
| `go tool pprof cpu.out`             | Analyze profile |
| `go tool pprof -http=:8080 cpu.out` | View in browser |

### Compilation Speed
| Command       | Description                      |
|---------------|----------------------------------|
| `go build -a` | Force rebuild all packages       |
| `go build -n` | Print commands without executing |
| `go build -x` | Print commands while executing   |

## Tool Installation

### Popular Tools
| Tool            | Command                                                                 |
|-----------------|-------------------------------------------------------------------------|
| Documentation   | `go install golang.org/x/tools/cmd/godoc@latest`                        |
| Linter          | `go install golang.org/x/lint/golint@latest`                            |
| Static analysis | `go install honnef.co/go/tools/cmd/staticcheck@latest`                  |
| Meta-linter     | `go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest` |

## Git Integration

### Files to Commit
| File      | Action   | Description                       |
|-----------|----------|-----------------------------------|
| `go.mod`  | ✅ Commit | Always commit                     |
| `go.sum`  | ✅ Commit | Always commit                     |
| Binaries  | ❌ Ignore | Add to .gitignore                 |
| `vendor/` | ❌ Ignore | Usually ignore (unless vendoring) |

### .gitignore for Go
```
# Binaries
*.exe
*.exe~
*.dll
*.so
*.dylib
/bin/

# Test coverage
*.out
coverage.html

# Go workspace
go.work
go.work.sum

# Vendor (if not vendoring)
vendor/
```

## References

- [Go Command Documentation](https://pkg.go.dev/cmd/go)
- [Go Modules Reference](https://go.dev/ref/mod)
- [Go Testing Flags](https://pkg.go.dev/cmd/go#hdr-Testing_flags)


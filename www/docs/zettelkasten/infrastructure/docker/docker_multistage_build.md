🗓️ 11112024 1445

# docker_multistage_build

**What it is:**
- Multiple `FROM` statements in a Dockerfile
- Each `FROM` starts new build stage
- Copy artifacts from earlier stages to later stages
- Leave behind everything else

**Problem it solves:**
- Single-stage build for compiled languages includes compilers, build tools, source code in final [[docker_image]]
- Go binary might be 10MB but image is 800MB because it includes entire Go toolchain
- Multi-stage builds separate build and runtime environments

## How It Works

Process:
1. First stage: Use full build environment (e.g., `golang:1.23`), compile application, run tests
2. Second stage: Use minimal runtime environment (e.g., `alpine`), copy only compiled binary from first stage
3. Final image contains just binary and runtime dependencies - no build tools

The builder stage gets discarded. Only runtime stage becomes final image.

## When to Use

Essential for:
- Compiled languages (Go, Rust, Java, C++) where build tools aren't needed at runtime
- Size difference is dramatic - single-stage Go images often 50-100x larger than multi-stage

Also useful for interpreted languages when you have build steps:
- Installing and compiling native dependencies for Python/Node
- Transpiling TypeScript
- Bundling frontend assets
- Build in one stage with dev tools, copy only production artifacts to runtime stage

## Build vs Runtime Stages

### Build stage
- Contains compilers, build tools, test frameworks, development dependencies
- Can be based on heavyweight images like `golang:1.23` or `node:20`

### Runtime stage
- Contains only runtime dependencies and your application
- Based on minimal images like `alpine`, `distroless`, or `scratch`
- For statically-compiled Go binaries, `scratch` (completely empty) works

You can have multiple build stages and copy from any using `COPY --from=stage-name`.

## Size and Security Benefits

### Size
- Smaller images mean faster deployments, less bandwidth, less storage

### Security
- Fewer packages mean smaller attack surface
- If runtime image doesn't have bash, curl, or package managers, attackers have fewer tools if they compromise [[docker_container]]

Production pattern: distroless or alpine for runtime, only application binary and minimal runtime (like libc if needed).

## Common Pitfalls

```ad-warning
**Forgetting to copy dependencies**: If your binary needs shared libraries or config files, you must explicitly copy them from build stage or install them in runtime stage. Static compilation avoids this.
```

---

## References

- https://docs.docker.com/build/building/multi-stage/

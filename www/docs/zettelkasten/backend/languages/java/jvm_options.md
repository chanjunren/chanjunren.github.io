🗓️ 31082025 1203

# jvm_options

Cheatsheet for JVM flags that matter in production. For what each memory area is, see [[memory_areas]].

## Heap Memory

| Flag | Purpose | Rule of Thumb | Risk if Wrong |
|------|---------|---------------|---------------|
| `-Xmx` | Max heap size | RAM ≤16 GB → 50%; RAM >16 GB → 65% | Too small → frequent GC; too large → starves OS |
| `-Xmx` | Upper bound | Always ≤75% of RAM | OS and NIO buffers starved |
| `-Xms` | Initial heap | **Set equal to `-Xmx`** | Dynamic resizing → STW pauses |

## Direct Memory and Buffers

| Flag | Purpose | Rule of Thumb | Risk if Wrong |
|------|---------|---------------|---------------|
| `-XX:MaxDirectMemorySize` | Off-heap NIO/Netty cap | ~15% of `-Xmx`, min 256 MB, max 25% of `-Xmx` | Too high → heap starved; too low → NIO fails |
| `--add-opens=java.base/jdk.internal.misc=ALL-UNNAMED` | Opens APIs for monitoring tools | Required for accurate direct memory metrics | Some monitoring tools break |

## OOM Troubleshooting

| Flag | Purpose | Rule of Thumb |
|------|---------|---------------|
| `-XX:+HeapDumpOnOutOfMemoryError` | Dump heap on OOM | Always enable |
| `-XX:HeapDumpPath=` | Dump location | Persistent storage: `/hostdata/crash/{svc}.oom.hprof` |
| `-XX:ErrorFile=` | JVM fatal error log | Persistent storage: `/hostdata/crash/{svc}.hs_err_pid%p.log` |

```ad-danger
Wrong paths → dumps lost after container restart. Always use persistent volumes.
```

## GC Logging

| Flag | Purpose | Rule of Thumb |
|------|---------|---------------|
| `-Xlog:gc*` | GC log output | Logs synced: `filecount=1, filesize=200m`. Not synced: `filecount=5, filesize=200m` |

## Logging and Encoding

| Flag | Purpose | Rule of Thumb |
|------|---------|---------------|
| `-Dlog4j2.contextSelector` | Async logging | Set to `org.apache.logging.log4j.core.async.AsyncLoggerContextSelector` |
| `-Dfile.encoding` | Default encoding | `UTF-8` |

## Security and Stability

| Flag | Purpose |
|------|---------|
| `-Dfastjson.parser.safeMode=true` | Blocks Fastjson deserialization RCE |
| `-Djava.awt.headless=true` | Disables GUI rendering (saves CPU) |
| `-Dspring.devtools.restart.enabled=false` | Prevents hot-reload in production |

## Profiling

| Flag | Purpose |
|------|---------|
| `-XX:+UseZingMXBeans` | Exposes JVM metrics |
| `-XX:+ProfileLiveObjects` | Enables `jmap -histo` object histograms |
| `-XX:ProfileLogIn` / `-XX:ProfileLogOut` | JIT profile log paths for ReadyNow warmup |

## Quick Rules

### Heap
- Pin size: `-Xms = -Xmx`
- RAM ≤16 GB → 50%. RAM >16 GB → 65%.

### Direct memory
- Default ~15% of `-Xmx`, always ≥256 MB, ≤25% of `-Xmx`

### Logging
- Async logging always. GC logs rotated.

### Troubleshooting
- Heap dumps + error logs on persistent volumes.

---

## References

- [[memory_areas]]
- [[memory_diagnostics]]

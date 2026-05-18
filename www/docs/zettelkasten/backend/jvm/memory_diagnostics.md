🗓️ 18052026 2300

# memory_diagnostics

Cheatsheet: dashboard metric → JVM area → what's wrong → what to do. For background on each area, see [[memory_areas]].

## Dashboard Metric → JVM Area

| Dashboard Metric | Prometheus Metric | JVM Area | Bounded By |
|---|---|---|---|
| Heap memory | `jvm_memory_used_bytes{area="heap"}` | Heap (Young + Old) | `-Xmx` |
| Metaspace | `jvm_memory_used_bytes{id="Metaspace"}` | Class metadata (native) | `-XX:MaxMetaspaceSize` |
| Compressed class space | `jvm_memory_used_bytes{id="Compressed Class Space"}` | Sub-region of metaspace | `-XX:CompressedClassSpaceSize` |
| Code cache | `jvm_memory_used_bytes{id="CodeCache"}` | JIT compiled code (native) | `-XX:ReservedCodeCacheSize` |
| Direct buffers | `jvm_buffer_pool_used_bytes{id="direct"}` | Off-heap NIO / Netty | `-XX:MaxDirectMemorySize` |
| Mapped buffers | `jvm_buffer_pool_used_bytes{id="mapped"}` | Memory-mapped files (OS) | OS virtual memory |
| Netty memory | `netty_allocator_*` or custom | Off-heap (pooled direct) | `-XX:MaxDirectMemorySize` + Netty config |

---

## Triage

```
RSS higher than expected?
├─ Heap growing?           → heap dump, find retainers
├─ Metaspace growing?      → classloader leak, count loaded classes
├─ Direct buffers growing? → ByteBuffer / Netty leak
├─ Mapped buffers high?    → usually benign, check with pmap/lsof
└─ None of the above?      → NMT summary for full native breakdown
```

---

## Heap

**Symptoms**: frequent GC, `OutOfMemoryError: Java heap space`, old gen climbing toward max

### Diagnose

```bash
jmap -histo <pid> | head -30                          # top memory consumers
jmap -dump:format=b,file=heap.hprof <pid>             # full dump for MAT
jcmd <pid> GC.heap_info                               # heap region usage (G1)
```

### Fix

- **Leak**: find retaining references in heap dump (dominator tree in Eclipse MAT)
- **Undersized**: increase `-Xmx` — but if old gen keeps growing, that's a leak
- **Premature promotion**: survivors too small, objects spill to old early

## Metaspace

**Symptoms**: steady growth over days/weeks, `OutOfMemoryError: Metaspace`

### Diagnose

```bash
jcmd <pid> VM.classloader_stats                       # classes per classloader
jcmd <pid> VM.info | grep -i class                    # total loaded/unloaded
```

### Fix

- **Classloader leak**: common after JEE/Tomcat redeploy. Old classloaders pinned → classes stuck.
- **Unbounded proxies**: CGLIB/Javassist/JDK Proxy generating classes without caching.
- **Bound it**: `-XX:MaxMetaspaceSize=512m` to fail fast instead of eating native memory.

## Compressed Class Space

**Symptoms**: grows proportionally with metaspace. Rarely the bottleneck alone.

Same tools and root causes as metaspace. Increase `-XX:CompressedClassSpaceSize` if needed (default 1 GB).

## Code Cache

**Symptoms**: `CodeCache is full. Compiler has been disabled.` in logs, performance drops

### Diagnose

```bash
jcmd <pid> Compiler.codecache
```

### Fix

Increase `-XX:ReservedCodeCacheSize` (default ~240 MB). Large apps may need 512 MB+. Code cache doesn't leak — it fills when many methods get JIT-compiled.

## Direct Buffers

**Symptoms**: `OutOfMemoryError: Direct buffer memory`, RSS >> `-Xmx`, container OOM-kill

### Diagnose

```bash
jcmd <pid> VM.native_memory summary                   # needs -XX:NativeMemoryTracking=summary
```

Enable Netty leak detection (restart required):
```
-Dio.netty.leakDetection.level=paranoid
```

### Fix

- **NIO leak**: `ByteBuffer.allocateDirect()` not GC'd because references held. Find retainers.
- **Netty leak**: `ByteBuf` not released in handlers. See [[netty_memory_model]].
- **Bound it**: set `-XX:MaxDirectMemorySize` explicitly.

## Mapped Buffers

**Symptoms**: high virtual memory (VIRT). Usually **not a problem**.

### Diagnose

```bash
pmap -x <pid> | grep mapped
lsof -p <pid> | grep mem
```

### Fix

- Usually benign — OS manages paging. High VIRT is expected with Kafka, RocksDB, Lucene.
- Can't explicitly unmap `MappedByteBuffer`. Unmapping happens at GC.
- Only investigate if **RSS** (not VIRT) is the problem.

## Netty Memory

**Symptoms**: direct buffer usage climbing, `LEAK: ByteBuf.release() was not called`

### Leak detection levels

| Level | Flag | Use |
|---|---|---|
| `SIMPLE` | (default) | Production — samples ~1% |
| `ADVANCED` | `-Dio.netty.leakDetection.level=advanced` | Staging — all buffers, access trace |
| `PARANOID` | `-Dio.netty.leakDetection.level=paranoid` | Debugging — full creation + access trace |

### Fix

- **Release rule**: last handler to use a `ByteBuf` must call `release()` or forward via `ctx.fireChannelRead()`. See [[netty_memory_model]].
- **Exception paths**: if a handler throws before releasing, the buffer leaks. Use try-finally.

---

## Key Commands

| Command | Shows |
|---|---|
| `jcmd <pid> VM.native_memory summary` | Full native memory breakdown |
| `jcmd <pid> GC.heap_info` | Heap regions and usage |
| `jcmd <pid> VM.classloader_stats` | Classes per classloader |
| `jcmd <pid> Compiler.codecache` | Code cache usage |
| `jmap -histo <pid>` | Object histogram (top consumers) |
| `jmap -dump:format=b,file=heap.hprof <pid>` | Full heap dump |
| `pmap -x <pid>` | Process memory map |

---

## References

- [Eclipse MAT](https://eclipse.dev/mat/)
- [NMT — JEP 247](https://openjdk.org/jeps/247)

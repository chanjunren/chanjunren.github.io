🗓️ 18052026 2300

# jvm_memory_diagnostics

Cheatsheet for diagnosing JVM memory issues from Grafana dashboard metrics. Maps each dashboard panel to the JVM area it represents, what to look for, and how to fix it.

For background on each area, see [[jvm_memory_areas]]. For GC-specific issues, see [[jvm_garbage_collection_basics]].

## Dashboard Metric → JVM Area

| Dashboard Metric | Prometheus Metric | JVM Area | Bounded By |
|---|---|---|---|
| Heap memory | `jvm_memory_used_bytes{area="heap"}` | Heap (Young + Old) | `-Xmx` |
| Metaspace | `jvm_memory_used_bytes{id="Metaspace"}` | Class metadata (native) | `-XX:MaxMetaspaceSize` |
| Compressed class space | `jvm_memory_used_bytes{id="Compressed Class Space"}` | Sub-region of metaspace | `-XX:CompressedClassSpaceSize` |
| Code cache | `jvm_memory_used_bytes{id="CodeCache"}` | JIT compiled code (native) | `-XX:ReservedCodeCacheSize` |
| Direct buffers | `jvm_buffer_pool_used_bytes{id="direct"}` | Off-heap NIO / Netty | `-XX:MaxDirectMemorySize` |
| Mapped buffers | `jvm_buffer_pool_used_bytes{id="mapped"}` | Memory-mapped files (OS) | OS virtual memory |
| Netty memory | `netty_allocator_*` or custom | Off-heap (pooled direct) | `-XX:MaxDirectMemorySize` + Netty pool config |

---

## Triage Flowchart

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

**Symptoms**: frequent GC pauses, `OutOfMemoryError: Java heap space`, old gen usage climbing toward max

### Diagnose

```bash
# Object histogram — top memory consumers (no heap dump needed)
jmap -histo <pid> | head -30

# Full heap dump for analysis in Eclipse MAT / VisualVM
jmap -dump:format=b,file=heap.hprof <pid>

# Heap region info (G1)
jcmd <pid> GC.heap_info
```

### Fix

- **Leak**: find retaining references in heap dump (GC roots → dominator tree in MAT)
- **Undersized**: increase `-Xmx` — but if old gen keeps growing, that's a leak, not a sizing issue
- **Premature promotion**: survivors too small, objects spill to old early — increase survivor ratio or check allocation bursts

---

## Metaspace

**Symptoms**: steady growth over days/weeks, `OutOfMemoryError: Metaspace`

### Diagnose

```bash
# Classes per classloader
jcmd <pid> VM.classloader_stats

# Total loaded/unloaded classes
jcmd <pid> VM.info | grep -i class

# Class histogram
jmap -histo <pid> | grep "Class$"
```

### Fix

- **Classloader leak**: common in JEE/Tomcat redeploy without proper teardown. Old classloaders stay pinned → old classes stuck in metaspace.
- **Dynamic proxies**: frameworks generating proxies (CGLIB, Javassist, JDK Proxy) without caching. Each proxy = new class.
- **Bound it**: set `-XX:MaxMetaspaceSize=512m` to fail fast instead of eating native memory

---

## Compressed Class Space

**Symptoms**: grows proportionally with metaspace. Rarely the bottleneck on its own.

### Diagnose

Same tools as metaspace — compressed class space is a sub-region. Check loaded class count.

### Fix

- Increase `-XX:CompressedClassSpaceSize` (default 1 GB — rarely needs changing)
- If this fills, metaspace is also likely under pressure — investigate classloader leaks first

---

## Code Cache

**Symptoms**: `CodeCache is full. Compiler has been disabled.` in logs, performance degradation (hot methods stop getting JIT-compiled)

### Diagnose

```bash
jcmd <pid> Compiler.codecache
```

### Fix

- Increase `-XX:ReservedCodeCacheSize` (default ~240 MB on JDK 11+). Large apps with many hot methods may need 512 MB+.
- Code cache doesn't leak in the traditional sense — it fills when there are many compiled methods. Tiered compilation (default) uses more code cache than C2-only.

---

## Direct Buffers

**Symptoms**: `OutOfMemoryError: Direct buffer memory`, RSS much higher than `-Xmx`, process killed by container OOM

### Diagnose

```bash
# Native memory breakdown (must start JVM with -XX:NativeMemoryTracking=summary)
jcmd <pid> VM.native_memory summary

# Enable Netty leak detection (restart required)
# Add to JVM args: -Dio.netty.leakDetection.level=paranoid
```

### Fix

- **NIO buffer leak**: `ByteBuffer.allocateDirect()` not being GC'd because references are held. Find retaining references.
- **Netty buffer leak**: `ByteBuf` not released in handlers. See [[netty_memory_model]] for reference counting rules.
- **Bound it**: set `-XX:MaxDirectMemorySize` explicitly (default = `-Xmx`). See [[jvm_options]] for sizing rules.
- **Force cleanup**: `System.gc()` can trigger cleanup of phantom references that free direct buffers — but this is a workaround, not a fix.

---

## Mapped Buffers

**Symptoms**: high virtual memory (VIRT), but usually **not a real problem**

### Diagnose

```bash
# Show memory-mapped files
pmap -x <pid> | grep -i mapped

# Show open file descriptors (mapped files show up here)
lsof -p <pid> | grep mem
```

### Fix

- **Usually benign**: mapped buffers use virtual address space, but physical memory is managed by OS page cache. High VIRT is expected.
- **Common sources**: Kafka log segments, RocksDB SST files, Lucene indexes. These are intentional.
- **Can't explicitly unmap**: `MappedByteBuffer` has no `close()`. Unmapping happens when the buffer object is GC'd. Calling `System.gc()` may help in extreme cases.
- **Only investigate if**: RSS (not VIRT) is high and mapped buffers are the dominant contributor

---

## Netty Memory

**Symptoms**: direct buffer usage climbing, `OutOfMemoryError: Direct buffer memory`, `LEAK: ByteBuf.release() was not called` in logs

### Diagnose

Set leak detection level (JVM arg, restart required):

| Level | Flag | Overhead | Detail |
|---|---|---|---|
| `DISABLED` | `-Dio.netty.leakDetection.level=disabled` | None | Nothing reported |
| `SIMPLE` | (default) | Low | Reports leak, no trace |
| `ADVANCED` | `-Dio.netty.leakDetection.level=advanced` | Moderate | Leak + access locations |
| `PARANOID` | `-Dio.netty.leakDetection.level=paranoid` | High | All buffers, full trace |

Use `PARANOID` in staging to find leaks, `SIMPLE` in production.

### Fix

- **Release rule**: last handler to use a `ByteBuf` must call `release()` or pass it downstream via `ctx.fireChannelRead(msg)`. See [[netty_memory_model]].
- **Exception paths**: if a handler throws before releasing, the buffer leaks. Use try-finally.
- **Pool tuning**: `PooledByteBufAllocator` defaults are usually fine. If arenas are too large, set `-Dio.netty.allocator.numDirectArenas` and `-Dio.netty.allocator.numHeapArenas`.

---

## Key Diagnostic Commands

| Command | What It Shows |
|---|---|
| `jcmd <pid> VM.native_memory summary` | Full native memory breakdown (needs `-XX:NativeMemoryTracking=summary`) |
| `jcmd <pid> GC.heap_info` | Heap region sizes and usage |
| `jcmd <pid> VM.classloader_stats` | Classes loaded per classloader |
| `jcmd <pid> Compiler.codecache` | Code cache usage and limits |
| `jmap -histo <pid>` | Object count + size by class (top consumers) |
| `jmap -dump:format=b,file=heap.hprof <pid>` | Full heap dump for MAT analysis |
| `pmap -x <pid>` | Process memory map (shows mapped regions) |

---

## References

- [[jvm_memory_areas]]
- [[jvm_garbage_collection_basics]]
- [[jvm_options]]
- [[netty_memory_model]]
- [Eclipse MAT](https://eclipse.dev/mat/)
- [NMT Documentation (JEP 247)](https://openjdk.org/jeps/247)

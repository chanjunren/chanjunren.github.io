🗓️ 29042026 1500

# memory_areas

The JVM splits a running program's data across five regions. Where an object lives determines who sees it, when it gets collected, and which `OutOfMemoryError` fires when something leaks.

| Area | Location | Shared? | Bounded By |
|------|----------|---------|------------|
| **Heap** | JVM-managed | All threads | `-Xmx` |
| **Stack** | Per thread | No | `-Xss` |
| **Metaspace** | Native memory | All threads | `-XX:MaxMetaspaceSize` |
| **Code Cache** | Native memory | All threads | `-XX:ReservedCodeCacheSize` |
| **Direct Memory** | Native memory | All threads | `-XX:MaxDirectMemorySize` |

---

## Heap

Every `new MyObject()` allocates here. Subdivided by generational GC into young and old — see [[basics]] for how.

```
┌──────────────────────────────────────────────────┐
│                      Heap                        │
│  ┌──────────────────┐  ┌────────────────────┐    │
│  │   Young Gen       │  │     Old Gen        │    │
│  │  ┌────┬─────┬────┐│  │                    │    │
│  │  │Eden│  S0 │ S1 ││  │                    │    │
│  │  └────┴─────┴────┘│  │                    │    │
│  └──────────────────┘  └────────────────────┘    │
└──────────────────────────────────────────────────┘
```

### Tuning

- `-Xms` / `-Xmx` — initial / max heap
- `-Xmn` — young-gen size
- `-XX:NewRatio=2` — old/young ratio
- `-XX:SurvivorRatio=8` — eden/survivor ratio

Heap fills past max → `java.lang.OutOfMemoryError: Java heap space`.

## Stack

One per thread. Each method call pushes a **frame**:
- Local variables (primitives live here; references point into heap)
- Operand stack (intermediate expression values)
- Return address

Frames pop on method return — no GC needed, lifetime is method-scoped.

Size: `-Xss` (default ~512 KB–1 MB). Deep recursion → `StackOverflowError`.

`Thread.start()` allocates a fresh stack. 1000 threads × 1 MB = 1 GB in stacks alone. Use `-Xss256k` for high-thread-count servers.

## Metaspace

Holds **class metadata**: `Class` objects, method bytecode, runtime constant pool, interned strings (since JDK 7+).

**Pre-JDK 8**: lived in **PermGen** — a fixed-size heap region. Too many classes → `OutOfMemoryError: PermGen space`.

**JDK 8+**: PermGen removed. Metadata moved to native memory. Grows unbounded by default. Bound it: `-XX:MaxMetaspaceSize`.

Failure: dynamic class generation (CGLIB proxies, classloader leaks) without bound → `OutOfMemoryError: Metaspace`.

### Compressed Class Space

Sub-region of metaspace for **compressed class pointers** (`-XX:+UseCompressedClassPointers`, on by default when heap < 32 GB). Stores 32-bit pointers instead of 64-bit — saves ~4 bytes per object header.

- `-XX:CompressedClassSpaceSize` (default 1 GB)
- Grows with loaded class count — same root causes as metaspace
- Included within the `-XX:MaxMetaspaceSize` limit
- Failure: `OutOfMemoryError: Compressed class space`

## Code Cache

**JIT-compiled native code** from HotSpot's C1/C2 compilers lives here.

Default: ~240 MB (JDK 11+). When full, JIT stops compiling → performance drops as new hot methods stay interpreted.

Tuning: `-XX:ReservedCodeCacheSize=512m` for large apps.

Failure (rare): `CodeCache is full. Compiler has been disabled.`

## Direct (Off-heap) Memory

Allocated outside the JVM heap:
- `ByteBuffer.allocateDirect(int)` — NIO direct buffers
- `Unsafe.allocateMemory(long)` — manual native memory
- Netty's pooled allocator — see [[memory_model]]
- Memory-mapped files (`FileChannel.map`)

**Why**: avoids copying between JVM heap and OS buffers for I/O. NIO socket reads write directly into a direct buffer.

**Not bounded by `-Xmx`**. Bounded by `-XX:MaxDirectMemorySize` (defaults to ~`-Xmx`). Unset + abused → process eats all host memory → kernel OOM-kill.

Failure: `OutOfMemoryError: Direct buffer memory`.

### Mapped Buffers

`MappedByteBuffer` via `FileChannel.map()` — OS memory-maps a file region into the process's virtual address space. Reads/writes go through the page cache.

- **Not bounded by `-XX:MaxDirectMemorySize`** — OS manages this memory
- Common sources: Kafka log segments, RocksDB SST files, Lucene indexes
- High virtual memory (VIRT) from mapped buffers is usually benign — only RSS matters for pressure
- Can't be explicitly unmapped in Java. Persists until the buffer object is GC'd.

## Native Memory

Everything else the JVM allocates outside the heap:
- Thread stacks
- JNI allocations
- GC bookkeeping (card tables, remembered sets)
- JIT compiler workspace

**Native Memory Tracking** (NMT) shows the full breakdown:

```bash
java -XX:NativeMemoryTracking=summary ...
jcmd <pid> VM.native_memory summary
```

Use when RSS exceeds `-Xmx` + metaspace + direct memory and you need to find where.

## Where Data Lives

| Data | Area |
|------|------|
| Local primitive (`int x = 5`) | Stack frame |
| Local object reference | Stack frame (reference); heap (object) |
| `new` object | Heap |
| `String` literals | String pool (heap, since JDK 7) |
| `Class<?>` objects | Metaspace |
| JIT-compiled native code | Code Cache |
| `ByteBuffer.allocateDirect` | Direct memory |
| `FileChannel.map` | Mapped buffers (OS-managed) |

## Common Pitfalls

### OOM: heap vs metaspace confusion

Different leaks, different fixes. Heap = object retention. Metaspace = class loading.

### RSS exceeds `-Xmx`

Metaspace, code cache, direct memory, thread stacks all live outside the heap. Container limits should be `-Xmx` + ~1–2 GB. Use `-XX:MaxRAMPercentage=75` instead of hardcoding `-Xmx`.

### Unbounded thread pools

`Executors.newCachedThreadPool` → unbounded threads × stack size = surprise OOM-kill. See [[thread_pool_executor_internals]].

### Direct buffer leak

Netty / NIO buffers held by reference too long. Shows up as `OOM: Direct buffer memory` weeks into production.

### Classloader leak

JEE/Tomcat redeploy without proper teardown. Old classloaders pinned → old classes stuck in metaspace. Classic "metaspace OOM after the 50th deploy."

---

## References

- [JVM Specification ch. 2](https://docs.oracle.com/javase/specs/jvms/se17/html/jvms-2.html)
- "Java Performance" 2nd ed. (Oaks) ch. 5–6
- [NMT — JEP 247](https://openjdk.org/jeps/247)

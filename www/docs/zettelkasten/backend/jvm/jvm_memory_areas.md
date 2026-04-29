🗓️ 29042026 1500
📎 #java #jvm #memory

# jvm_memory_areas

> The five regions the JVM uses to hold a running program's data. Where an object lives determines who can see it, when it gets collected, and which `OutOfMemoryError` you'll see when something leaks.

## The Areas

```ad-abstract
**Heap** — shared across threads. All `new`-allocated objects live here. Subdivided by GC into generations.
**Stack** — one per thread. Holds method frames: local primitives, references, return address.
**Metaspace** — class metadata (since JDK 8). Replaces PermGen. Lives in **native memory**, not in the heap.
**Code Cache** — JIT-compiled native code. Native memory.
**Direct (Off-heap) Memory** — `ByteBuffer.allocateDirect`, NIO, Netty pooled buffers. Native memory.
```

## Heap

The big one. Every `new MyObject()` allocates here.

Subdivided by generational GC (see [[jvm_garbage_collection_basics]]):

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

Tuning knobs:
- `-Xms` initial heap
- `-Xmx` max heap
- `-Xmn` young-gen size
- `-XX:NewRatio=2` old/young ratio
- `-XX:SurvivorRatio=8` eden/survivor ratio

When the heap fills past max → `java.lang.OutOfMemoryError: Java heap space`.

## Stack

Per-thread. Each method call pushes a **frame** containing:
- Local variables (primitives, references — references point into heap)
- Operand stack (intermediate values during expression evaluation)
- Return address

Frame popped on method return. No GC needed here — lifetime is method-scoped.

Stack size set per thread via `-Xss` (default ~512 KB to 1 MB depending on platform). Deeply-recursive code blows it: `java.lang.StackOverflowError`.

A pathological case to memorise: `Thread.start()` allocates a fresh stack. 1000 threads × 1 MB = 1 GB just in stacks. Hence `-Xss256k` for high-thread-count servers.

## Metaspace

Holds class metadata: `Class` objects, method bytecode, runtime constant pool, intern'd strings (since JDK 7+).

**Pre-JDK 8**: this lived in PermGen — a fixed-size region inside the heap. Loading too many classes (esp. dynamic class generation in JEE servers) caused `OutOfMemoryError: PermGen space`.

**JDK 8+**: PermGen removed. Metadata moved to native memory (the OS allocates it, not the JVM heap). Default: unlimited (grows as needed). Tunable: `-XX:MaxMetaspaceSize`.

Failure mode: dynamic class generation (frameworks creating proxies, classloader leaks) without bound = native memory growth → `OutOfMemoryError: Metaspace`.

## Code Cache

JIT-compiled methods (HotSpot's C1 and C2 compilers produce native code; that native code lives here).

Default: ~240 MB (JDK 11+). When full, JIT stops compiling new methods and the existing compiled code stays — performance drops noticeably as new hot methods can't be optimised.

Tuning: `-XX:ReservedCodeCacheSize=512m` for large applications with lots of hot methods.

Failure mode (rare in practice): `CodeCache is full. Compiler has been disabled.` — observed but not OOM.

## Direct (Off-heap) Memory

Allocated outside the JVM heap, via:
- `ByteBuffer.allocateDirect(int)` — NIO direct buffers.
- `Unsafe.allocateMemory(long)` — manual native memory.
- Netty's pooled byte-buf allocator.
- Memory-mapped files (`FileChannel.map`).

**Why use it**: avoid copying between JVM heap and OS buffers for I/O. NIO socket reads can write directly into a direct buffer.

**Pitfall**: not bounded by `-Xmx`. Bounded separately by `-XX:MaxDirectMemorySize` (defaults to roughly `-Xmx`). When unset and abused, the JVM happily eats all of host memory until the kernel kills the process.

`OutOfMemoryError: Direct buffer memory` indicates exhaustion.

## Native Memory (the catch-all)

Whatever the JVM allocates outside the heap that isn't categorised above:
- Thread stacks (above)
- JNI allocations
- GC bookkeeping (card tables, remembered sets)
- JIT compiler workspace

Native Memory Tracking (NMT) reports detailed breakdown:

```
java -XX:NativeMemoryTracking=summary ...
jcmd <pid> VM.native_memory summary
```

Useful when total RSS exceeds `-Xmx + -XX:MaxMetaspaceSize` and you need to find where.

## Allocation Site Decision

| Data                          | Lives in                            |
|-------------------------------|-------------------------------------|
| Local primitive (`int x = 5`) | Stack frame                         |
| Local object reference        | Stack frame; the object lives in heap |
| `new` object                  | Heap                                |
| `String` literals             | String pool (in heap, since JDK 7)  |
| `Class<?>` objects            | Metaspace                           |
| JIT-compiled method native code | Code Cache                        |
| `ByteBuffer.allocateDirect`   | Direct memory (off-heap)            |

## Common Pitfalls

- **Confusing `OOM: heap space` with `OOM: Metaspace`** — different leaks, different fixes. Heap = object retention; Metaspace = class loading.
- **Setting `-Xmx` and assuming RSS stays below it** — Metaspace, code cache, direct memory, thread stacks all add to the process. Container limits should be `-Xmx + ~1-2GB` for these.
- **Container OOM-kill at higher RSS than `-Xmx`** — same root cause. Use `-XX:MaxRAMPercentage=75` (modern JVMs) instead of hardcoding `-Xmx`.
- **Using `Executors.newCachedThreadPool`** — unbounded threads × stack size = surprise OOM-kill. See [[thread_pool_executor_internals]].
- **String intern abuse** — every `.intern()` adds to the string pool (heap). Tight loops calling intern bloat heap silently.
- **Direct buffer leak via missed `release()`** — Netty / NIO buffers held by reference for too long. `OOM: Direct buffer memory` weeks into prod.
- **Many classloaders** — JEE/Tomcat redeploy without proper teardown. Old classes stuck in Metaspace. The classic "Metaspace OOM after the 50th deploy".
- **Defaulting to PermGen knowledge on JDK 8+** — PermGen is gone; tuning advice is now Metaspace-flavoured. Pre-JDK 8 docs mislead.

## Related

- [[jvm_garbage_collection_basics]] — what happens to heap allocations.
- [[gc_algorithms_g1_zgc_shenandoah]] — how each region is managed.
- [[thread_pool_executor_internals]] — thread = stack allocation.
- `class_loading_parent_delegation` *(planned)* — what fills Metaspace.

---

## References

- Oracle: [JVM Specification ch. 2 — The Structure of the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se17/html/jvms-2.html)
- "Java Performance" 2nd ed. (Oaks) ch. 5–6
- Native Memory Tracking docs: [JEP 247](https://openjdk.org/jeps/247)

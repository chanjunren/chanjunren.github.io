🗓️ 18052026 2300

# netty_memory_model

Netty manages its own memory instead of relying on Java's `ByteBuffer`. The result: pooled, reference-counted buffers that reduce GC pressure and avoid JVM-to-OS memory copies for I/O.

For diagnosing Netty memory issues on a dashboard, see [[jvm_memory_diagnostics]].

## ByteBuf vs Java NIO ByteBuffer

Netty's `ByteBuf` replaces `java.nio.ByteBuffer`:

| | `ByteBuffer` (NIO) | `ByteBuf` (Netty) |
|---|---|---|
| Read/write index | Single `position` — must `flip()` between read and write | Separate `readerIndex` and `writerIndex` |
| Pooling | None — each `allocateDirect()` is a fresh allocation | **Pooled** by default — reuses memory from arena |
| Lifecycle | GC-managed (direct buffers freed via phantom references) | **Reference counted** — explicit `release()` |
| Composite | Not supported | `CompositeByteBuf` — zero-copy merge of multiple buffers |
| Capacity | Fixed at allocation | Dynamically expandable |

## Direct vs Heap ByteBuf

| | Direct | Heap |
|---|---|---|
| Backed by | Native memory (off-heap) | JVM byte array (on-heap) |
| I/O performance | Fast — kernel reads/writes directly, no copy | Slower — JVM must copy to a temporary direct buffer for I/O |
| Allocation cost | Higher (OS syscall, unless pooled) | Lower (JVM heap allocation) |
| GC impact | None — not on the heap | Subject to GC |
| Default for | I/O operations (socket read/write) | Rarely the default; used for processing-only paths |

Netty defaults to **direct** for I/O buffers. The pooled allocator makes direct allocation cheap by reusing memory.

## PooledByteBufAllocator

Default allocator since Netty 4.1. Modeled after **jemalloc**.

```
PooledByteBufAllocator
├── Arena 0 (bound to thread group)
│   ├── Chunk (16 MB)
│   │   ├── Page (8 KB)
│   │   ├── Page (8 KB)
│   │   └── ...
│   └── Chunk
├── Arena 1
│   └── ...
└── Arena N (default: 2 × CPU cores for direct, 2 × CPU cores for heap)
```

### How it works

1. Each thread is assigned to an **arena** (round-robin at first allocation, then sticky).
2. Arenas own **chunks** (16 MB default). Chunks are allocated from the OS (direct) or JVM (heap).
3. Each chunk is divided into **pages** (8 KB). Small allocations use **sub-pages** (down to 16 bytes).
4. `allocate()` finds a free page/sub-page in the thread's arena — no locking in the hot path.
5. `release()` returns the buffer to the pool — no OS deallocation.

### Why it matters for dashboards

Pooled direct memory shows up in `jvm_buffer_pool_used_bytes{id="direct"}` and Netty's own metrics. The allocator pre-allocates chunks, so memory usage appears higher than the actual data in flight. This is normal — the pool holds spare capacity.

## UnpooledByteBufAllocator

Allocates a fresh buffer every time, frees on `release()`. Higher overhead, simpler model. Used for:
- Unit tests (easier to detect leaks)
- Low-volume paths where pooling overhead isn't justified

## Reference Counting

Every `ByteBuf` starts with `refCnt = 1`.

| Operation | Effect |
|---|---|
| `retain()` | refCnt++ |
| `release()` | refCnt-- ; if 0 → return to pool (pooled) or free (unpooled) |
| `release(n)` | refCnt -= n |

### The release rule

**The last handler (or component) to access a buffer must release it.**

In a `ChannelPipeline`:
- If a handler **consumes** the message (doesn't pass it downstream): call `release()`.
- If a handler **forwards** the message: call `ctx.fireChannelRead(msg)` — the next handler takes ownership.
- If a handler **transforms** the message (decode): release the input, the output gets a fresh refCnt.

```java
// Correct: consume and release
@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    ByteBuf buf = (ByteBuf) msg;
    try {
        // process buf
    } finally {
        buf.release();
    }
}

// Correct: forward downstream (don't release — next handler owns it)
@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    // inspect but don't consume
    ctx.fireChannelRead(msg);
}
```

## Leak Detection

Netty tracks unreleased buffers via `ResourceLeakDetector`. Set the level as a JVM argument:

| Level | Flag | Behavior |
|---|---|---|
| `DISABLED` | `-Dio.netty.leakDetection.level=disabled` | No tracking |
| `SIMPLE` | (default) | Samples ~1% of buffers, reports leak at GC time |
| `ADVANCED` | `-Dio.netty.leakDetection.level=advanced` | All buffers, reports access locations |
| `PARANOID` | `-Dio.netty.leakDetection.level=paranoid` | All buffers, full creation + access trace |

Log output when a leak is detected:
```
LEAK: ByteBuf.release() was not called before it's garbage-collected.
See https://netty.io/wiki/reference-counted-objects.html for more information.
```

Use `PARANOID` in staging/testing. Use `SIMPLE` in production — `PARANOID` has significant overhead.

## Common Leak Patterns

**Handler doesn't release on consume:**
```java
// BUG: reads buf but never releases
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    ByteBuf buf = (ByteBuf) msg;
    process(buf);
    // missing: buf.release()
}
```

**Exception skips release:**
```java
// BUG: if process() throws, release is skipped
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    ByteBuf buf = (ByteBuf) msg;
    process(buf);  // throws!
    buf.release(); // never reached
}
// FIX: use try-finally
```

**CompositeByteBuf components not released:**
```java
CompositeByteBuf composite = alloc.compositeBuffer();
composite.addComponent(true, buf1);
composite.addComponent(true, buf2);
// releasing composite releases all components — but if you remove a component
// without releasing it, it leaks
```

**Decoder doesn't release input after transformation:**
```java
// BUG: decodes input into a new message but forgets to release the original
protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) {
    MyMessage msg = parseFrom(in);
    out.add(msg);
    // in.release() is handled by the ByteToMessageDecoder base class — but
    // only if you properly consume bytes via in.readBytes() / in.readerIndex()
}
```

## Metrics

Access allocator stats programmatically:

```java
PooledByteBufAllocator allocator = PooledByteBufAllocator.DEFAULT;
PooledByteBufAllocatorMetric metric = allocator.metric();

metric.numDirectArenas();     // number of direct arenas
metric.numHeapArenas();       // number of heap arenas
metric.usedDirectMemory();    // bytes currently allocated (direct)
metric.usedHeapMemory();      // bytes currently allocated (heap)

// Per-arena details
for (PoolArenaMetric arena : metric.directArenas()) {
    arena.numActiveAllocations();
    arena.numActiveBytes();
    arena.numChunks();
}
```

Micrometer can bind these via a custom `MeterBinder`. Some frameworks (e.g., Spring Boot with Reactor Netty) expose `reactor.netty.bytebuf.allocator.*` metrics automatically.

---

## References

- [[jvm_memory_areas]] — where direct buffers fit in JVM memory
- [[jvm_memory_diagnostics]] — diagnosing Netty memory issues from dashboards
- [Netty Reference Counted Objects](https://netty.io/wiki/reference-counted-objects.html)
- [Netty Buffer API](https://netty.io/4.1/api/io/netty/buffer/package-summary.html)

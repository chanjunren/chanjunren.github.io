🗓️ 18052026 2300

# netty_memory_model

Netty manages its own memory instead of relying on `ByteBuffer`. The result: pooled, reference-counted buffers that reduce GC pressure and avoid JVM-to-OS copies for I/O.

For diagnosing Netty memory issues from a dashboard, see [[memory_diagnostics]].

## ByteBuf vs Java NIO ByteBuffer

| | `ByteBuffer` (NIO) | `ByteBuf` (Netty) |
|---|---|---|
| Read/write index | Single `position` — must `flip()` | Separate `readerIndex` / `writerIndex` |
| Pooling | None — each `allocateDirect()` is fresh | **Pooled** by default — reuses from arena |
| Lifecycle | GC-managed | **Reference counted** — explicit `release()` |
| Composite | Not supported | `CompositeByteBuf` — zero-copy merge |
| Capacity | Fixed at allocation | Dynamically expandable |

## Direct vs Heap ByteBuf

| | Direct | Heap |
|---|---|---|
| Backed by | Native memory (off-heap) | JVM byte array |
| I/O performance | Fast — no copy for socket read/write | Slower — JVM copies to temp direct buffer |
| Allocation cost | Higher (OS syscall, unless pooled) | Lower (JVM heap) |
| GC impact | None | Subject to GC |

Netty defaults to **direct** for I/O. The pooled allocator makes direct allocation cheap.

## PooledByteBufAllocator

Default since Netty 4.1. Modeled after **jemalloc**.

```
PooledByteBufAllocator
├── Arena 0 (bound to thread group)
│   ├── Chunk (16 MB)
│   │   ├── Page (8 KB)
│   │   └── ...
│   └── Chunk
├── Arena 1
└── Arena N  (default: 2 × CPU cores)
```

### How it works

1. Each thread assigned to an **arena** (round-robin, then sticky).
2. Arenas own **chunks** (16 MB). Chunks allocated from OS (direct) or JVM (heap).
3. Chunks divided into **pages** (8 KB). Small allocations use **sub-pages** (down to 16 bytes).
4. `allocate()` finds a free page in the thread's arena — no locking in the hot path.
5. `release()` returns the buffer to the pool — no OS deallocation.

On dashboards, pooled memory appears higher than data in flight. Normal — the pool holds spare capacity.

### UnpooledByteBufAllocator

Fresh buffer every time, freed on `release()`. Used for tests and low-volume paths.

## Reference Counting

Every `ByteBuf` starts at `refCnt = 1`.

| Operation | Effect |
|---|---|
| `retain()` | refCnt++ |
| `release()` | refCnt-- ; at 0 → return to pool or free |

### The release rule

**Last handler to access a buffer must release it.**

- **Consume** the message → call `release()`
- **Forward** the message → call `ctx.fireChannelRead(msg)` (next handler owns it)
- **Transform** the message → release input, output gets fresh refCnt

```java
// Consume and release
@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    ByteBuf buf = (ByteBuf) msg;
    try {
        // process
    } finally {
        buf.release();
    }
}
```

```java
// Forward — don't release
@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    ctx.fireChannelRead(msg);
}
```

## Leak Detection

Set via JVM argument (restart required):

| Level | Flag | Behavior |
|---|---|---|
| `DISABLED` | `-Dio.netty.leakDetection.level=disabled` | No tracking |
| `SIMPLE` | (default) | Samples ~1%, reports at GC |
| `ADVANCED` | `...level=advanced` | All buffers, access locations |
| `PARANOID` | `...level=paranoid` | All buffers, full creation + access trace |

Use `PARANOID` in staging. `SIMPLE` in production — `PARANOID` has significant overhead.

## Common Leak Patterns

### Handler doesn't release

```java
// BUG: reads but never releases
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    ByteBuf buf = (ByteBuf) msg;
    process(buf);
    // missing: buf.release()
}
```

### Exception skips release

```java
// BUG: if process() throws, release never runs
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    ByteBuf buf = (ByteBuf) msg;
    process(buf);   // throws!
    buf.release();  // unreachable
}
// FIX: wrap in try-finally
```

### CompositeByteBuf component leak

Releasing a `CompositeByteBuf` releases all components. But removing a component without releasing it separately → leak.

## Metrics

```java
PooledByteBufAllocator allocator = PooledByteBufAllocator.DEFAULT;
PooledByteBufAllocatorMetric metric = allocator.metric();

metric.numDirectArenas();
metric.usedDirectMemory();
metric.usedHeapMemory();

for (PoolArenaMetric arena : metric.directArenas()) {
    arena.numActiveAllocations();
    arena.numActiveBytes();
}
```

Spring Boot with Reactor Netty exposes `reactor.netty.bytebuf.allocator.*` metrics automatically.

---

## References

- [Netty Reference Counted Objects](https://netty.io/wiki/reference-counted-objects.html)
- [Netty Buffer API](https://netty.io/4.1/api/io/netty/buffer/package-summary.html)

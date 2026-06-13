🗓️ 13062026 2200

# system_calls

A **system call** (syscall) is the controlled gateway between [[cpu_privilege_modes]]. Every time application code needs something from the OS — read a file, allocate memory, send a network packet — it makes a syscall. The CPU switches from ring 3 to ring 0, the kernel handles the request, then switches back.

Without syscalls, user-mode code cannot do I/O. There is no other way to talk to hardware.

## How a Syscall Works

1. Application calls a library function (e.g. `read()` in C, `FileInputStream.read()` in Java)
2. Library sets up CPU registers with the syscall number and arguments
3. Executes the `syscall` instruction — CPU switches to ring 0
4. Kernel validates arguments, performs the operation
5. CPU switches back to ring 3, result returned to the application

Each crossing costs ~100ns — cheap individually, expensive at thousands per second.

## Common Syscalls

| Syscall | Triggered by | Ring 0 work |
|---------|-------------|-------------|
| `read` / `write` | Any file or socket I/O | Copy data between kernel buffers and user space |
| `mmap` | Large memory allocations (`malloc` internally) | Update [[virtual_memory]] page tables |
| `sendto` / `recvfrom` | Network send/receive | Network stack processing |
| `futex` | Thread synchronization (locks, wait/notify) | Manage kernel wait queues |
| `clone` | Creating threads or processes | Duplicate process structures |
| `epoll_wait` | Event-driven I/O (Netty, Nginx) | Monitor file descriptors for readiness |

## Why High System CPU Happens

Each syscall is a mode switch. Workloads that make many syscalls per second drive up the "system" portion of CPU (see [[interpreting_cpu_modes]]):

- **Excessive small I/O** — many tiny `read()`/`write()` calls instead of buffered batches
- **Heavy logging** — each log line can trigger a `write()` syscall
- **Short-lived connections** — each TCP connection involves `socket()`, `connect()`, `close()` — multiple syscalls per request
- **Lock contention** — threads competing for locks generate `futex` syscalls

## Java / JVM Context

JVM syscalls are hidden behind APIs. The developer does not see them, but they drive the "system" CPU mode:

- `FileInputStream.read()` calls native `read()`
- `Socket.getInputStream().read()` calls `recvfrom()`
- `synchronized` under contention uses `futex`
- `new Thread()` calls `clone`

```ad-example
A Java service writing 10,000 small log lines per second: each unbuffered `write()` is a syscall. Wrapping in `BufferedOutputStream` batches them, reducing syscalls by 100x and visibly dropping system CPU.
```

---

## References

- [Linux syscall table (x86-64)](https://blog.rchapman.org/posts/Linux_System_Call_Table_for_x86_64/)
- [man 2 syscalls](https://man7.org/linux/man-pages/man2/syscalls.2.html)

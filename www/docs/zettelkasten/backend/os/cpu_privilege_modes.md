🗓️ 13062026 2200

# cpu_privilege_modes

The CPU itself enforces two execution modes — **kernel mode** (ring 0) and **user mode** (ring 3). This is a hardware boundary, not a software convention. It prevents application code from corrupting the OS or other applications.

Every program runs in user mode. When it needs something privileged — read a file, allocate memory, send a network packet — it must ask the kernel via a [[system_calls]]. The CPU switches to kernel mode for that request, then switches back.

## Ring 0: Kernel Mode

- Full access to all CPU instructions, all memory addresses, all hardware devices
- Only the OS kernel runs here
- Can execute privileged instructions: configure page tables, access I/O ports, manage interrupts
- A bug in kernel-mode code can crash the entire machine

## Ring 3: User Mode

- Restricted instruction set — cannot access hardware directly or touch memory outside the process's own address space
- All application code runs here: web servers, databases, JVMs, containers
- Attempting a privileged instruction triggers a **hardware exception** (fault) — the kernel handles it, usually by killing the process with a segmentation fault

## How Code Crosses the Boundary

Application code cannot call a kernel function directly. The CPU enforces the boundary:

1. Application prepares arguments in CPU registers
2. Executes a special instruction (`syscall` on x86-64)
3. CPU switches to ring 0 and jumps to a fixed kernel entry point
4. Kernel validates the request and executes it
5. CPU switches back to ring 3, result returned to application

This is the only legal path from user mode to kernel mode. See [[system_calls]] for which operations trigger this and what it costs.

## Why This Matters for Container Metrics

When [[interpreting_cpu_modes]] shows the "system" mode breakdown, it measures time the CPU spent in ring 0 on behalf of applications. High system CPU means the kernel is working hard — servicing I/O, managing network connections, handling memory allocation.

Containers do **not** get their own kernel mode. All containers on a host share the same kernel running in ring 0. This is fundamentally different from VMs, where each VM runs its own kernel (see [[virtualization]]).

```ad-warning
A kernel vulnerability exploited from inside any container affects the entire host — all containers, all processes. The ring 0 / ring 3 boundary is the last line of defense, and containers share it.
```

---

## References

- [Intel Software Developer Manual — Protection Rings](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
- [Linux kernel syscall entry](https://www.kernel.org/doc/html/latest/x86/entry_64.html)

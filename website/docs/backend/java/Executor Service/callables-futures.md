---
sidebar_position: 2
sidebar_label: Callables & Futures
---

# Callables and Futures

## Runnable
- Void task that is submitted to ThreadPool
- No return value

## Callable
- Another type of task submitted to ThreadPool
- Can have return value

## Future
- Abstraction for return value of a `Callable`
- `Future.get()` is a blocking operation
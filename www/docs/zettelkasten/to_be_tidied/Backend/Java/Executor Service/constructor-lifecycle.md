---
sidebar_position: 2
sidebar_label: Constructor / lifecycle
---


# Constructor and Lifecycle Methods

## Pool Size Terms
| Size          | Description                                                                                       |
|---------------|----------------------------------------------------------------------------------------------------|
| Core Size     | Core number of threads that are initialized and can remain in the threadpool even when idle        |
| Current Size  | Current number of threads, starts as core size, more are added depending on the type of threadpool |
| Max Size Size | Absolute maximum can handle concurrently                                                           |

## Policies
| Policy              | Description                               |
|---------------------|-------------------------------------------|
| AbortPolicy         | throws exception                          |
| DiscardPolicy       | throws away task silently                 |
| DiscardOldestPolicy | submits new task and discards oldest task |
| CallerRunPolicy     | caller thread runs the task               |

:::info
Note: The behavior of these policies applies when the maximum pool size or work queue capacity has been reached.
:::

## Lifecycle Methods
```
/* 
* Initiates shutdown
* All tasks that are submitted thereafter are rejected
* Will complete tasks in BlockingQueue before shutting down
*/
service.shutdown()

/*
* Checks if ThreadPool has already shutdown
*/
service.isShutdown() 

/*
* Returns true if shutdown and all tasks completed
*/
service.isTerminated()


/*
* Blocks until all tasks are completed or if timeout occurs
*/
service.awaitTermination(10, TimeUnit.SECONDS);

/*
* Initiates shutdown and returns all queued tasks
*/
List<Runnable> runnables = service.shutdownNow()
```
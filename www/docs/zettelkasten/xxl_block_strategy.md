🗓️ 01032025 1251
📎

# xxl_block_strategy

> XXL-JOB provides different **block strategies** to handle cases where a job is already running and a new execution is triggered

| Block Strategy                                       | Behavior                                                            | When to Use                                                  | Pros                                   | Cons                                             |
| ---------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------- | ------------------------------------------------ |
| **Serial Execution** (`Serial`)                      | New job waits for the previous execution to finish before starting. | When job executions should not overlap.                      | Ensures orderly execution.             | Can lead to long delays if a job takes too long. |
| **Discard Later** (`DiscardLater`)                   | If a job is already running, new triggers are discarded.            | When only one execution matters and old jobs can be ignored. | Prevents queue buildup.                | Can result in lost executions.                   |
| **Cover Early** (`CoverEarly`)                       | New executions **overwrite** the running job.                       | When only the latest execution matters.                      | Prevents backlog and stale executions. | Previous execution gets interrupted.             |
| **Concurrency (Parallel Execution)** (`Concurrency`) | Allows multiple instances of the job to run simultaneously.         | When jobs can safely run in parallel.                        | Maximizes throughput.                  | Can lead to resource contention.                 |

---
# References
- ChatGPT
---
sidebar_position: 0
sidebar_label: Executor service
---

# ExecutorService

## Youtube
- Threadpool that has fixed number of threads
- Blocking queue to store the list of tasks
  - Considerations
    - Concurrency (multiple threads will add / remove tasks from this queue)
    - Size (number of threads in threadpool to core size)
    - Types of tasks
      - CPU intensive tasks
      - IO intensivity 
       
![i-love-chatgpt-1](resources/executor-service-1.jpg)
![i-love-chatgpt-2](resources/executor-service-2.jpg)

## Resources
- [Youtube](https://youtu.be/6Oo-9Can3H8)
- https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html
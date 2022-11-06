# Java Performance Toolbox

:::note
Performance analysis is all about visibility => Must have data
:::

## Operating Tools and Analysis
- Unix: iostat, vmstat, prstat ...
- Windows: typeperf
## CPU Usage
- Terms
- User Time: % of time spent executing application code 
- System Time: % of time spent executing kernel code
- Goal: Drive CPU usage as high as possible for as short a time as possible
    - Indication of how effective your application is at utilizing CPU
- Reasons for idle
    - Blocked on synchronization primitive => unable to execute until lock is released
    - Waiting for something (e.g. DB response)
    - No work to do

### Single CPU Usage
- e.g. Server-style application
- vmstat's measurements are in unit of seconds
    - might not be granular enough
    - e.g. Processing a request takes 450ms
    - CPU usage at 100% for 450ms, idle for 550ms => CPU usage = 45%
    - Thus makes sense to aim for lower CPU usages i.e. finish processing request in 400ms 

### Multiple CPU Usage
- Same concept as single CPU
- General Goal
    - drive CPU higher by making sure CPU threads not blocked
    - drive CPU lower by finishing tasks earlier => idle for longer

:::note
Application with fixed size threadpool running various tasks => Threads blocked (they can only execute one task at a time) => *CPU can be idle even if there is task to do* 

- Number of tasks > number of threads
:::

### CPU Run Queue
- _Run (Processor) Queue_: number of threads that can be run
    - Find using 
        - vmstat (unix): shows running threads and threads that can run
        - typeperf (windows): only shows threads that can run
    - Represents everything on the machine
- Number of threads > CPU => performance degrade
- Run queue length too high for significant period => Indication that machine is overloaded
    - Look into reducing machine's work (moving jobs to another machine / optimising code)
 

:::info
Quick summary
1. CPU utilization is the first thing to consider when looking at the performance of an application
2. Attempt to drive CPU high for as short time as possible
3. Understand why CPU usage is low before optimizing
:::

## Disk Usage
- Goals of monitoring disk usage
    1. If I/O intensive application => easy for I/O to become bottleneck 
    2. Lookout for
        - Low disk usage: not efficiently buffering data
        - High disk usage: buffering more than it can handle
```
% iostat -xm 5
avg-cpu:  %user   %nice %system %iowait  %steal   %idle
          23.45    0.00   37.89    0.10    0.00   38.56

          Device:         rrqm/s   wrqm/s     r/s     w/s    rMB/s
          sda               0.00    11.60    0.60   24.20     0.02

          wMB/s avgrq-sz avgqu-sz   await r_await w_await  svctm  %util
          0.14    13.35     0.15    6.06    5.33    6.08   0.42   1.04
```

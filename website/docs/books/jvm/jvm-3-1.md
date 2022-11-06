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
- Can be tricky 

### Example where I/O is bottleneck 

```
% iostat -xm 5
avg-cpu:  %user   %nice %system %iowait  %steal   %idle
          23.45    0.00   37.89    0.10    0.00   38.56

          Device:         rrqm/s   wrqm/s     r/s     w/s    rMB/s
          sda               0.00    11.60    0.60   24.20     0.02

          wMB/s avgrq-sz avgqu-sz   await r_await w_await  svctm  %util
          0.14    13.35     0.15    6.06    5.33    6.08   0.42   1.04
```
| value | description | explanation |
| ----- | ----------- | ----------- |
| w_await | time to service each I/O write | Fairly low |
| %util | Disk utilization | Also looks ok | 
| %system | Time spent in kernel | quite high, if system is doing other I/O in applications maybe it's ok |
| writes per second | as per name |  quite a lot of writes for 0.14MBps |

### Example where disk cannot keep up with I/O Requests
```
% iostat -xm 5
avg-cpu:  %user   %nice %system %iowait  %steal   %idle
          35.05    0.00    7.85   47.89    0.00    9.20

          Device:         rrqm/s   wrqm/s     r/s     w/s    rMB/s
          sda               0.00     0.20    1.00  163.40     0.00

          wMB/s avgrq-sz avgqu-sz   await r_await w_await  svctm  %util
          81.09  1010.19   142.74  866.47   97.60  871.17   6.08 100.00
```
| value | explanation |
| ----- | ----------- |
| %util | 100% is an indication |
| w_await | 871ms => queue quite large |
| wMB/s | 81.09 MB => quite large |

### Indication for swapping
- Applications might use large amounts of VIRTUAL memory => might lead to swapping => bad performance
- Can monitor disk usage to monitor for swapping
- Use _vmstat_
    - _si_ swap in
    - _so_ swap out

## Network Usage
- Bottlenecks can occur when too little (inefficient writing of data) or too high (too much data) throughput




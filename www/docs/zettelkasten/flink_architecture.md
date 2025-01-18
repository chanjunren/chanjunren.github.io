🗓️ 16012025 1129
📎

# flink_architecture

## Overview
Flink is a distributed system and requires effective allocation and management of compute resources in order to execute streaming applications

It integrates with all common cluster resource managers such as [Hadoop YARN](https://hadoop.apache.org/docs/stable/hadoop-yarn/hadoop-yarn-site/YARN.html) and [[kubernetes]], but can also be set up to run as a standalone cluster or even as a library

![The processes involved in executing a Flink dataflow](https://nightlies.apache.org/flink/flink-docs-release-1.17/fig/processes.svg)
## Client
- Not part of runtime / program execution
- Used to prepare and send a dataflow (??) to the `JobManager`
- Can disconnect after that


| Mode     | Description                                       |
| -------- | ------------------------------------------------- |
| Attached | Not disconnected > For receiving progress reports |
| Detached | Disconnected                                      |

```ad-info
The client runs either as part of the Java/Scala program that triggers the execution, or in the command line process `./bin/flink run ...`
```

## Flink Runtime

```ad-abstract
The Flink runtime consists of two types of processes: a _JobManager_ and one or more _TaskManagers_
```

- The JobManager and TaskManagers can be started in various ways
	- directly on the machines as a [standalone cluster](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/deployment/resource-providers/standalone/overview/)
	- in containers
	- managed by resource frameworks like [YARN](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/deployment/resource-providers/yarn/) 
- TaskManagers connect to JobManagers, announcing themselves as available, and are assigned work.

## Task Slot
Smallest unit of resource scheduling in a Flink cluster 

Represents a fixed subset of resources of the TaskManager
## JobManager
- Decides when to schedule next task / set of tasks
- Reacts to finished tasks / execution failures
- Coordinates 
	- Checkpoints
	- Coordinates recovery on failures

### ResourceManager
> Responsible for resource de-/allocation and provisioning in a Flink cluster - manages **task slots**

- Flink implements multiple ResourceManagers for different environments and resource providers such as YARN, Kubernetes and standalone deployments

```ad-note
In a standalone setup, the ResourceManager can only distribute the slots of available TaskManagers and cannot start new TaskManagers on its own.
```
    
### Dispatcher
    
- Provides a REST interface to submit Flink applications for execution 
- Starts a new JobMaster for each submitted job
- Runs the Flink WebUI to provide information about job executions
    
### JobMaster

- Responsible for managing the execution of a single [JobGraph](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/concepts/glossary/#logical-graph)
- Multiple jobs can run simultaneously in a Flink cluster, each having **its own JobMaster**
- There is always at least one JobManager
- A high-availability setup might have multiple JobManagers, one of which is always the _leader_, and the others are _standby_ (see [High Availability (HA)](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/deployment/ha/overview/)).


## TaskManagers (Workers)

- Execute the tasks of a dataflow, and buffer and exchange the data streams
- There must always be at least one TaskManager
- Number of task slots in a TaskManager indicates the number of concurrent processing tasks
- Note that multiple operators may execute in a task slot 

## Tasks and Operator Chains

- For distributed execution, Flink _chains_ operator subtasks together into _tasks_
- Each task is executed by one thread
- Chaining operators together into tasks is a useful optimization
	- it reduces the overhead of thread-to-thread handover and buffering
	- increases overall throughput while decreasing latency
- [configuring chaining behavior](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/datastream/operators/overview/#task-chaining-and-resource-groups) for details.

```ad-seealso
What does chaining operators together even mean
```

The sample dataflow in the figure below is executed with five subtasks, and hence with five parallel threads.

![Operator chaining into Tasks](https://nightlies.apache.org/flink/flink-docs-release-1.17/fig/tasks_chains.svg)

## Task Slots and Resources

- Each worker (TaskManager) is a _JVM process_
- May execute one or more subtasks in separate threads
- To control how many tasks a TaskManager accepts, it has so called **task slots** (at least one)

- A TaskManager with three slots, for example, will dedicate 1/3 of its managed memory to each slot
- Slotting the resources means:
	- A subtask will not compete with subtasks from other jobs for managed memory
	- Has a certain amount of reserved managed memory
	
```ad-note
Note that no CPU isolation happens here; currently slots only separate the managed memory of tasks
```


### Slot Sharing

- By adjusting the number of task slots, users can define how subtasks are isolated from each other
- Having one slot per TaskManager means that each task group runs in a separate JVM (which can be started in a separate container
- Having multiple slots means more subtasks share the same JVM

```ad-tip
Tasks in the same JVM share TCP connections (via multiplexing) and heartbeat messages

They may also share data sets and data structures, thus reducing the per-task overhead.
```

```ad-note
By default, Flink allows subtasks to share slots even if they are subtasks of different tasks, so long as they are from the same job

The result is that one slot may hold an entire pipeline of the job
```
### Slot Sharing Benefits
![A TaskManager with Task Slots and Tasks](https://nightlies.apache.org/flink/flink-docs-release-1.17/fig/tasks_slots.svg)


**A Flink cluster needs exactly as many task slots as the highest parallelism used in the job**
> No need to calculate how many tasks (with varying parallelism) a program contains in total
    
**It is easier to get better resource utilization**
- Without slot sharing, the non-intensive _source/map()_ subtasks would block as many resources as the resource intensive _window_ subtasks
- With slot sharing, increasing the base parallelism in our example from two to six yields full utilization of the slotted resources, while making sure that the heavy subtasks are fairly distributed among the TaskManagers.
    

![TaskManagers with shared Task Slots](https://nightlies.apache.org/flink/flink-docs-release-1.17/fig/slot_sharing.svg)

## Flink Application Execution

- A _Flink Application_ is any user program that **spawns one or multiple Flink jobs** from its `main()` method
- The execution of these jobs can happen in a local JVM (`LocalEnvironment`) or on a remote setup of clusters with multiple machines (`RemoteEnvironment`)
- For each program, the `ExecutionEnvironment` provides methods to control the job execution (e.g. setting the parallelism) and to interact with the outside world (see [Anatomy of a Flink Program](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/datastream/overview/#anatomy-of-a-flink-program)).

- The jobs of a Flink Application can either be submitted to:
	- Long-running [Flink Session Cluster](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/concepts/glossary/#flink-session-cluster)
	- Dedicated [Flink Job Cluster (deprecated)](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/concepts/glossary/#flink-job-cluster)
	- [Flink Application Cluster](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/concepts/glossary/#flink-application-cluster)


```ad-note
The difference between these options is mainly related to the cluster’s lifecycle and to resource isolation guarantees
```

### Flink Application Cluster

> A dedicated Flink cluster that only executes jobs from one Flink Application and where the `main()` method runs on the cluster rather than the client

- Can package your application logic and dependencies into a executable job JAR and the cluster entrypoint (`ApplicationClusterEntryPoint`) is responsible for calling the `main()` method to extract the JobGraph
- Allows you to deploy a Flink Application like any other application on Kubernetes, for example
- The lifetime of a Flink Application Cluster is therefore bound to the lifetime of the Flink Application
- **Resource Isolation**: in a Flink Application Cluster, the ResourceManager and Dispatcher are scoped to a single Flink Application, which provides a better separation of concerns than the Flink Session Cluster.
    

### Flink Session Cluster

- In a Flink Session Cluster, the client connects to a pre-existing, long-running cluster that can accept multiple job submissions
- Even after all jobs are finished, the cluster (and the JobManager) will keep running until the session is manually stopped
- The lifetime of a Flink Session Cluster is therefore not bound to the lifetime of any Flink Job
    
- **Resource Isolation**
	- TaskManager slots are allocated by the ResourceManager on job submission and released once the job is finished
	- Because all jobs are sharing the same cluster, there is some competition for cluster resources — like network bandwidth in the submit-job phase
	- One limitation of this shared setup is that if one TaskManager crashes, then all jobs that have tasks running on this TaskManager will fail
	- In a similar way, if some fatal error occurs on the JobManager, it will affect all jobs running in the cluster.
    
- **Other considerations**: 
	- Having a pre-existing cluster saves a considerable amount of time applying for resources and starting TaskManagers
	- This is important in scenarios where the execution time of jobs is very short and a high startup time would negatively impact the end-to-end user experience — as is the case with interactive analysis of short queries, where it is desirable that jobs can quickly perform computations using existing resources.
    

> Formerly, a Flink Session Cluster was also known as a Flink Cluster in `session mode`.

---

# References
- https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/concepts/flink-architecture/
🗓️ 18022025 1441
📎

# flink_savepoints
## What is a Savepoint? [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#what-is-a-savepoint)

A Savepoint is a consistent image of the execution state of a streaming job, created via Flink’s [checkpointing mechanism](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/fault_tolerance/). You can use Savepoints to stop-and-resume, fork, or update your Flink jobs. Savepoints consist of two parts: a directory with (typically large) binary files on stable storage (e.g. HDFS, S3, …) and a (relatively small) meta data file. The files on stable storage represent the net data of the job’s execution state image. The meta data file of a Savepoint contains (primarily) pointers to all files on stable storage that are part of the Savepoint, in form of relative paths.

> In order to allow upgrades between programs and Flink versions, it is important to check out the following section about [assigning IDs to your operators](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#assigning-operator-ids).

To make proper use of savepoints, it’s important to understand the differences between [checkpoints](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/checkpoints/) and savepoints which is described in [checkpoints vs. savepoints](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/checkpoints_vs_savepoints/).

## Assigning Operator IDs [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#assigning-operator-ids)

It is **highly recommended** that you specify operator IDs via the **`uid(String)`** method. These IDs are used to scope the state of each operator.

```java
DataStream<String> stream = env.
  // Stateful source (e.g. Kafka) with ID
  .addSource(new StatefulSource())
  .uid("source-id") // ID for the source operator
  .shuffle()
  // Stateful mapper with ID
  .map(new StatefulMapper())
  .uid("mapper-id") // ID for the mapper
  // Stateless printing sink
  .print(); // Auto-generated ID
```

If you do not specify the IDs manually they will be generated automatically. You can automatically restore from the savepoint as long as these IDs do not change. The generated IDs depend on the structure of your program and are sensitive to program changes. Therefore, it is highly recommended assigning these IDs manually.

### Savepoint State [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#savepoint-state)

You can think of a savepoint as holding a map of `Operator ID -> State` for each stateful operator:

```plain
Operator ID | State
------------+------------------------
source-id   | State of StatefulSource
mapper-id   | State of StatefulMapper
```

In the above example, the print sink is stateless and hence not part of the savepoint state. By default, we try to map each entry of the savepoint back to the new program.

## Operations [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#operations)

You can use the [command line client](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/deployment/cli/#savepoints) to _trigger savepoints_, _cancel a job with a savepoint_, _resume from savepoints_, and _dispose savepoints_.

It is also possible to _resume from savepoints_ using the webui.

### Triggering Savepoints [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#triggering-savepoints)

When triggering a savepoint, a new savepoint directory is created where the data as well as the meta data will be stored. The location of this directory can be controlled by [configuring a default target directory](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#configuration) or by specifying a custom target directory with the trigger commands (see the [`:targetDirectory` argument](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#trigger-a-savepoint)).

> **Attention:** The target directory has to be a location accessible by both the JobManager(s) and TaskManager(s) e.g. a location on a distributed file-system or Object Store.

For example with a `FsStateBackend` or `RocksDBStateBackend`:

```shell
# Savepoint target directory
/savepoints/

# Savepoint directory
/savepoints/savepoint-:shortjobid-:savepointid/

# Savepoint file contains the checkpoint meta data
/savepoints/savepoint-:shortjobid-:savepointid/_metadata

# Savepoint state
/savepoints/savepoint-:shortjobid-:savepointid/...
```

Savepoints can generally be moved by moving (or copying) the entire savepoint directory to a different location, and Flink will be able to restore from the moved savepoint.

> There are two exceptions:
> 
> 1. if [_entropy injection_](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/deployment/filesystems/s3/#entropy-injection-for-s3-file-systems) is activated: In that case the savepoint directory will not contain all savepoint data files, because the injected path entropy spreads the files over many directories. Lacking a common savepoint root directory, the savepoints will contain absolute path references, which prevent moving the directory.
>     
> 2. The job contains task-owned state, such as `GenericWriteAhreadLog` sink.
>     

Unlike savepoints, checkpoints cannot generally be moved to a different location, because checkpoints may include some absolute path references.

If you use `statebackend: jobmanager`, metadata _and_ savepoint state will be stored in the `_metadata` file, so don’t be confused by the absence of additional data files.

> Starting from Flink 1.15 intermediate savepoints (savepoints other than created with [stop-with-savepoint](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#stopping-a-job-with-savepoint)) are not used for recovery and do not commit any side effects.
> 
> This has to be taken into consideration, especially when running multiple jobs in the same checkpointing timeline. It is possible in that solution that if the original job (after taking a savepoint) fails, then it will fall back to a checkpoint prior to the savepoint. However, if we now resume a job from the savepoint, then we might commit transactions that might’ve never happened because of falling back to a checkpoint before the savepoint (assuming non-determinism).
> 
> If one wants to be safe in those scenarios, we advise dropping the state of transactional sinks, by changing sinks [uids](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#assigning-operator-ids).
> 
> It should not require any additional steps if there is just a single job running in the same checkpointing timeline, which means that you stop the original job before running a new job from the savepoint.

#### Savepoint format [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#savepoint-format)

You can choose between two binary formats of a savepoint:

- canonical format - a format that has been unified across all state backends, which lets you take a savepoint with one state backend and then restore it using another. This is the most stable format, that is targeted at maintaining the most compatibility with previous versions, schemas, modifications etc.
    
- native format - the downside of the canonical format is that often it is slow to take and restore from. Native format creates a snapshot in the format specific for the used state backend (e.g. SST files for RocksDB).
    

> The possibility to trigger a savepoint in the native format was introduced in Flink 1.15. Up until then savepoints were created in the canonical format.

#### Trigger a Savepoint [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#trigger-a-savepoint)

```shell
$ bin/flink savepoint :jobId [:targetDirectory]
```

This will trigger a savepoint for the job with ID `:jobId`, and returns the path of the created savepoint. You need this path to restore and dispose savepoints. You can also pass a type in which the savepoint should be taken. By default the savepoint will be taken in canonical format.

```shell
$ bin/flink savepoint --type [native/canonical] :jobId [:targetDirectory]
```

When using the above command to trigger a savepoint, the client needs to wait for the savepoint to be completed. Therefore, the client may time out when the state size of the task is large. In this case, you can trigger the savepoint in detached mode.

```shell
$ bin/flink savepoint :jobId [:targetDirectory] -detached
```

When using this command, the client returns immediately after getting the trigger id of the savepoint. You can monitor the status of the savepoint through the REST API [rest api](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/rest_api//#jobs-jobid-checkpoints-triggerid).

#### Trigger a Savepoint with YARN [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#trigger-a-savepoint-with-yarn)

```shell
$ bin/flink savepoint :jobId [:targetDirectory] -yid :yarnAppId
```

This will trigger a savepoint for the job with ID `:jobId` and YARN application ID `:yarnAppId`, and returns the path of the created savepoint.

#### Stopping a Job with Savepoint [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#stopping-a-job-with-savepoint)

```shell
$ bin/flink stop --type [native/canonical] --savepointPath [:targetDirectory] :jobId
```

This will atomically trigger a savepoint for the job with ID `:jobid` and stop the job. Furthermore, you can specify a target file system directory to store the savepoint in. The directory needs to be accessible by the JobManager(s) and TaskManager(s). You can also pass a type in which the savepoint should be taken. By default the savepoint will be taken in canonical format.

If you want to trigger the savepoint in detached mode, add option `-detached` to the command.

### Resuming from Savepoints [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#resuming-from-savepoints)

```shell
$ bin/flink run -s :savepointPath [:runArgs]
```

This submits a job and specifies a savepoint to resume from. You may give a path to either the savepoint’s directory or the `_metadata` file.

#### Allowing Non-Restored State [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#allowing-non-restored-state)

By default, the resume operation will try to map all state of the savepoint back to the program you are restoring with. If you dropped an operator, you can allow to skip state that cannot be mapped to the new program via `--allowNonRestoredState` (short: `-n`) option.

> Improper usage of this feature could result in significant issues with the correctness of the application. It is crucial to verify that any remaining states can be accurately mapped to the appropriate operators. It is worth noting that operator UIDs are reassigned based on topological order by default, which may lead to incorrect associations between states and operators, thus consequently states are not correctly restored as wished. To prevent such mismatches, it is advisable to explicitly [assign UIDs] (//nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/production_ready//#set-uuids-for-all-operators) to all operators in a DataStream job.

#### Claim mode [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#claim-mode)

The `Claim Mode` determines who takes ownership of the files that make up a Savepoint or [externalized checkpoints](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/checkpoints//#resuming-from-a-retained-checkpoint) after restoring it. Both savepoints and externalized checkpoints behave similarly in this context. Here, they are just called “snapshots” unless explicitly noted otherwise.

As mentioned, the claim mode determines who takes over ownership of the files of the snapshots that we are restoring from. Snapshots can be owned either by a user or Flink itself. If a snapshot is owned by a user, Flink will not delete its files, moreover, Flink can not depend on the existence of the files from such a snapshot, as it might be deleted outside of Flink’s control.

Each claim mode serves a specific purposes. Still, we believe the default _NO_CLAIM_ mode is a good tradeoff in most situations, as it provides clear ownership with a small price for the first checkpoint after the restore.

You can pass the claim mode as:

```shell
$ bin/flink run -s :savepointPath -claimMode :mode -n [:runArgs]
```

**NO_CLAIM (default)**

In the _NO_CLAIM_ mode Flink will not assume ownership of the snapshot. It will leave the files in user’s control and never delete any of the files. In this mode you can start multiple jobs from the same snapshot.

In order to make sure Flink does not depend on any of the files from that snapshot, it will force the first (successful) checkpoint to be a full checkpoint as opposed to an incremental one. This only makes a difference for `state.backend: rocksdb`, because all other state backends always take full checkpoints.

Once the first full checkpoint completes, all subsequent checkpoints will be taken as usual/configured. Consequently, once a checkpoint succeeds you can manually delete the original snapshot. You can not do this earlier, because without any completed checkpoints Flink will - upon failure - try to recover from the initial snapshot.

![NO_CLAIM claim mode](https://nightlies.apache.org/flink/flink-docs-release-1.20/fig/restore-mode-no_claim.svg)

**CLAIM**

The other available mode is the _CLAIM_ mode. In this mode Flink claims ownership of the snapshot and essentially treats it like a checkpoint: its controls the lifecycle and might delete it if it is not needed for recovery anymore. Hence, it is not safe to manually delete the snapshot or to start two jobs from the same snapshot. Flink keeps around a [configured number](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/fault-tolerance/checkpointing//#state-checkpoints-num-retained) of checkpoints.

![CLAIM mode](https://nightlies.apache.org/flink/flink-docs-release-1.20/fig/restore-mode-claim.svg)

> **Attention:**
> 
> 1. Retained checkpoints are stored in a path like `<checkpoint_dir>/<job_id>/chk-<x>`. Flink does not take ownership of the `<checkpoint_dir>/<job_id>` directory, but only the `chk-<x>`. The directory of the old job will not be deleted by Flink
>     
> 2. [Native](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#savepoint-format) format supports incremental RocksDB savepoints. For those savepoints Flink puts all SST files inside the savepoints directory. This means such savepoints are self-contained and relocatable. Please note that, when restored in CLAIM mode, subsequent checkpoints might reuse some SST files, which might delay the deletion the savepoints directory.
>     

**LEGACY (deprecated)**

The legacy mode is how Flink worked until 1.15. In this mode Flink will never delete the initial checkpoint. At the same time, it is not clear if a user can ever delete it as well. The problem here, is that Flink might immediately build an incremental checkpoint on top of the restored one. Therefore, subsequent checkpoints depend on the restored checkpoint. Overall, the ownership is not well-defined.

![LEGACY claim mode](https://nightlies.apache.org/flink/flink-docs-release-1.20/fig/restore-mode-legacy.svg)

> **Attention:** The LEGACY mode is deprecated and will be removed in Flink 2.0. Please use CLAIM or NO_CLAIM mode instead.

### Disposing Savepoints [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#disposing-savepoints)

```shell
$ bin/flink savepoint -d :savepointPath
```

This disposes the savepoint stored in `:savepointPath`.

Note that it is possible to also manually delete a savepoint via regular file system operations without affecting other savepoints or checkpoints (recall that each savepoint is self-contained).

### Configuration [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#configuration)

You can configure a default savepoint target directory via the `execution.checkpointing.savepoint-dir` key or `StreamExecutionEnvironment`. When triggering savepoints, this directory will be used to store the savepoint. You can overwrite the default by specifying a custom target directory with the trigger commands (see the [`:targetDirectory` argument](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#trigger-a-savepoint)).

config.yaml

```yaml
# Default savepoint target directory
execution.checkpointing.savepoint-dir: hdfs:///flink/savepoints
```

JavaScala

If you neither configure a default nor specify a custom target directory, triggering the savepoint will fail.

> The target directory has to be a location accessible by both the JobManager(s) and TaskManager(s) e.g. a location on a distributed file-system.

## F.A.Q [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#faq)

### Should I assign IDs to all operators in my job? [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#should-i-assign-ids-to-all-operators-in-my-job)

As a rule of thumb, yes. Strictly speaking, it is sufficient to only assign IDs via the `uid` method to the stateful operators in your job. The savepoint only contains state for these operators and stateless operator are not part of the savepoint.

In practice, it is recommended to assign it to all operators, because some of Flink’s built-in operators like the Window operator are also stateful and it is not obvious which built-in operators are actually stateful and which are not. If you are absolutely certain that an operator is stateless, you can skip the `uid` method.

### What happens if I add a new operator that requires state to my job? [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#what-happens-if-i-add-a-new-operator-that-requires-state-to-my-job)

When you add a new operator to your job, it will be initialized without any state. Savepoints contain the state of each stateful operator. Stateless operators are simply not part of the savepoint. The new operator behaves similar to a stateless operator.

### What happens if I delete an operator that has state from my job? [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#what-happens-if-i-delete-an-operator-that-has-state-from-my-job)

By default, a savepoint restore will try to match all state back to the restored job. If you restore from a savepoint that contains state for an operator that has been deleted, this will therefore fail.

You can allow non restored state by setting the `--allowNonRestoredState` (short: `-n`) with the run command:

```shell
$ bin/flink run -s :savepointPath -n [:runArgs]
```

### What happens if I reorder stateful operators in my job? [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#what-happens-if-i-reorder-stateful-operators-in-my-job)

If you assigned IDs to these operators, they will be restored as usual.

If you did not assign IDs, the auto generated IDs of the stateful operators will most likely change after the reordering. This would result in you not being able to restore from a previous savepoint.

### What happens if I add or delete or reorder operators that have no state in my job? [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#what-happens-if-i-add-or-delete-or-reorder-operators-that-have-no-state-in-my-job)

If you assigned IDs to your stateful operators, the stateless operators will not influence the savepoint restore.

If you did not assign IDs, the auto generated IDs of the stateful operators will most likely change after the reordering. This would result in you not being able to restore from a previous savepoint.

### What happens when I change the parallelism of my program when restoring? [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#what-happens-when-i-change-the-parallelism-of-my-program-when-restoring)

You can simply restore the program from a savepoint and specify a new parallelism.

### Can I move the Savepoint files on stable storage? [#](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/#can-i-move-the-savepoint-files-on-stable-storage)

The quick answer to this question is currently “yes”. Savepoints are self-contained and relocatable. You can move the file and restore from any location.

---
# References
- https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/ops/state/savepoints/
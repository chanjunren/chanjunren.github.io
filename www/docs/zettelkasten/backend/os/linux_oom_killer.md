🗓️ 13062026 2200

# linux_oom_killer

When the kernel cannot free enough memory through [[page_cache]] reclamation and swap, it must kill a process to prevent a total system hang. The **OOM killer** (Out-Of-Memory killer) is the kernel subsystem that picks which process to terminate.

Understanding this explains why containers get OOM-killed, how the kernel chooses victims, and why a container can be killed even when it is within its own memory limit.

## When It Triggers

### Cgroup-Level (Container OOM)

The most common case in Kubernetes:

1. Container's memory usage hits its cgroup hard limit
2. Kernel tries to reclaim [[page_cache]] within the cgroup
3. If **working set** (non-reclaimable portion) fills the limit, nothing more can be freed
4. Kernel OOM-kills a process inside the cgroup
5. Kubernetes detects the kill, restarts the pod with status `OOMKilled`

This is what [[interpreting_container_memory]] means by "OOM kill triggers only when working_set fills the limit."

### Host-Level (Node OOM)

Rarer but more dangerous:

1. `MemAvailable` approaches zero across the entire node
2. All reclaimable page cache already evicted, swap full or absent
3. Kernel OOM-kills a process — can be **any** process on the node
4. Can kill processes in containers that are within their own limits

See [[interpreting_host_memory]] — "the kernel's OOM killer picks a process to kill; it can choose a container process even if that container's working_set is below its own limit."

## How It Picks Victims: oom_score

Each process has an `oom_score` (0–1000). Higher score = killed first.

### Score Calculation

- Base score: proportional to the process's RSS as a fraction of total memory
- Adjustment: `oom_score_adj` (-1000 to +1000) shifts the score up or down
- Root processes get a small bonus (slightly lower score)

### Kubernetes Sets oom_score_adj

| QoS Class | oom_score_adj | Killed |
|-----------|--------------|--------|
| **BestEffort** | +1000 | First — no requests or limits set |
| **Burstable** | Proportional to request/limit ratio | Middle |
| **Guaranteed** | -997 | Last — requests equal limits |

The kubelet itself gets -999, ensuring it survives even when everything else is killed.

## Cgroup OOM vs Host OOM

| | Cgroup OOM | Host OOM |
|---|-----------|----------|
| **Trigger** | Container hits its memory limit | Node runs out of memory entirely |
| **Scope** | Kills within the container only | Kills any process on the node |
| **Recovery** | Pod restarts, node unaffected | Can kill kubelet, cascading failure |
| **Prevention** | Right-size container limits | Right-size node, set resource requests |

```ad-danger
A host-level OOM kill can terminate the kubelet itself, causing all pods on the node to become unmanageable. Kubernetes eviction (which is graceful) triggers before host OOM, but only if `evictionHard` thresholds are configured correctly.
```

## Detecting OOM Kills

- **dmesg**: `dmesg | grep -i "oom"` shows kernel OOM messages
- **Kubernetes events**: `kubectl describe pod` shows `OOMKilled` in container status
- **Metrics**: `kube_pod_container_status_last_terminated_reason` with value `OOMKilled`
- **cAdvisor**: `container_oom_events_total` counter

## Prevention

- Alert on `working_set / limit > 85%` with a growing trend — see [[interpreting_container_memory]]
- Use `deriv(container_memory_working_set_bytes[1h])` to detect leaks before they OOM
- Set memory requests to baseline usage, limits to peak + headroom
- Monitor node-level `MemAvailable` to catch host-level pressure early — see [[interpreting_host_memory]]

---

## References

- [Linux OOM killer documentation](https://www.kernel.org/doc/html/latest/admin-guide/mm/concepts.html)
- [Kubernetes Pod QoS and OOM](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/)
- [Kubernetes Node Pressure Eviction](https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/)

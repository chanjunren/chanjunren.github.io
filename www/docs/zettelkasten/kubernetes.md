🗓️ 10062024 1600
📎 #devops #kubernetes #wip 

# kubernetes

## What is k8s (Kubernetes)

- container orchestration system
- Used for container deployment and management
- Its design is greatly impacted by Google’s internal system Borg

![[k8s_overview.png]]

## Architecture

| Term            | Definition                                          |
| --------------- | --------------------------------------------------- |
| `cluster`       | set of nodes                                        |
| `node`          | worker machine that runs containerized applications |
| `control plane` | manages worker nodes / pods in the cluster          |

- each cluster has **at least one** worker node
- To achieve fault tolerance / HA
  - control plane usually runs across multiple computers
  - cluster usually runs multiple nodes

## Control Plane

| Component            | Description                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| `API server`         | talks to ALL components in k8s clusters (all operations on pods are executed through the API server) |
| `scheduler`          | watches workload / assign loads on newly created pods                                                |
| `controller manager` | runs controllers i.e. `Node` \| `Job` \| `EndpointSlice` \| `ServiceAccount`                         |
| `etcd`               | key-value store for cluster data                                                                     |

## Worker Node

| Component    | Description                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| `pod`        | group of containers                                                                                  |
| `container`  | smallest unit that k8s administers                                                                   |
| `kubelet`    | agent running on **each node** in a `cluster`, ensure that containers are running in a pod           |
| `kube-proxy` | network proxy running on each node<br/>routing requests (node -> service, requests for work -> node) |

## 2. Relationship Between Containers and Machine Instances

### Containers:

- **Containers**: Lightweight, portable units that package an application and its dependencies. They run on a shared operating system kernel but in isolated environments.
- Containers are often managed by container runtime environments like Docker.

### Machine Instances:

- **Machine Instances**: Physical or virtual machines that provide the computing resources for running containers.
- A single machine instance (node) can run multiple containers, depending on its resource capacity.

## 3. Why Pods and Containers?

### Containers:

- Containers are great for packaging applications because they ensure consistency across different environments (development, testing, production).
- They are isolated from each other, improving security and stability.

### Pods:

- **Pods**: The smallest deployable units in Kubernetes. A pod can contain one or more containers that share the same network namespace, storage, and lifecycle.
- **Purpose of Pods**:
  - **Resource Sharing**: Containers within a pod can share resources such as storage volumes.
  - **Networking**: Containers in a pod can communicate with each other using localhost, making it easier to manage inter-container communication.
  - **Lifecycle Management**: Pods manage the lifecycle of containers, ensuring that they start, stop, and get restarted together.

### Benefits of Using Pods:

- **Atomic Deployment**: Pods ensure that containers that need to work together are deployed together.
- **Scalability**: Kubernetes can easily scale pods up or down based on the load and resource availability.
- **Resilience**: If a node fails, Kubernetes can restart pods on another node, ensuring high availability.

## 4. How Kubernetes Manages Containers and Pods

### Kubernetes Components:

- **API Server**: The main entry point for the Kubernetes control plane. It handles requests from users, the CLI, and other components.
- **Scheduler**: Assigns tasks (pods) to nodes based on resource availability and other constraints.
- **Controller Manager**: Ensures the desired state of the cluster by managing various controllers that handle tasks like node operations, replication, and endpoints.
- **etcd**: A key-value store used for storing all cluster data.

### Workflow:

1. **Deployment**: Users define desired states in deployment files (YAML/JSON) and submit them to the API server.
2. **Scheduling**: The scheduler assigns pods to appropriate nodes based on resource requirements and constraints.
3. **Execution**: Worker nodes run the assigned pods, and the kubelet (node agent) ensures that containers are running as expected.
4. **Monitoring and Maintenance**: Kubernetes continuously monitors the cluster state and takes corrective actions to maintain the desired state (e.g., restarting failed containers, scaling applications).

## Conclusion

Kubernetes provides a robust framework for managing containerized applications by abstracting the underlying infrastructure and offering high-level constructs like pods to simplify deployment, scaling, and maintenance. By understanding the relationship between containers, pods, and machine instances, you can better leverage Kubernetes to build scalable, resilient, and efficient applications.

---

## References

- https://blog.bytebytego.com/p/ep35-what-is-kubernetes

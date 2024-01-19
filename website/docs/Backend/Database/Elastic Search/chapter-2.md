---
sidebar_position: 2
sidebar_label: Life inside a cluster
---
# Life inside a cluster

## Terminology
- Node: Running instance of elasticsearch
- Cluster: >= 1 node
- Master node: A single elected node in the cluster, responsible for cluster wide changes (creating / deleting index, adding / removing node)
- Index: Logical namespace that points to one or more physical shards 
-Shard: Containers of data (stores documents), shards are allocated to node
- Primary shard: Document store
- Replica shard: Replica of primary shard
- 
![Cluster diagram](assets/chapter2_cluster.png)

## Adding failover
- Avoid single point of failure by running multiple nodes

## Horizontal scaling
![Initial cluster](assets/chapter2_hscale.png)
- Adding one node

![Horizontal scaling replicas](assets/chapter2_hscale_replica.png)
- Increasing numebr of replicas

## Coping with failure
- Scenario: One node killed
![Node failure](assets/chapter2_failure.png)

- Actions:
	- One node promtoed to master (node 2)
	- Replica shards promoted to primary shard
	- Health check yellow (insufficient replicas)


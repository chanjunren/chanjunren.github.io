---
sidebar_position: 2
sidebar_label: Life inside a cluster
---
# Life inside a cluster

## Terminology

| Term          | Description                                                                                   |
|---------------|-----------------------------------------------------------------------------------------------|
| Node          | Running instance of EES                                                                       |
| Cluster       | >= 1 node                                                                                     |
| Master node   | Single elected node in the cluster responsible for cluster wide changes (+/- index, +/- node) |
| Shard         | <ul><li>Containers of data (stores documents)</li><li>Allocated to node</li></ul>             |
| Primary Shard | Document store                                                                                |
| Replica Shard | Replica of primary shard                                                                      |
 
![Cluster diagram](assets/chapter2_cluster.png)

## Adding failover
- Avoid single point of failure by running multiple nodes

## Horizontal scaling
![Initial cluster](assets/chapter2_hscale.png)
- Adding one node

![Horizontal scaling replicas](assets/chapter2_hscale_replica.png)
- Increasing numebr of replicas

## Coping with failure
:::warning Scenario: One node killed
![Node failure](assets/chapter2_failure.png)
:::

- Actions:
	- One node promtoed to master (node 2)
	- Replica shards promoted to primary shard
	- Health check yellow (insufficient replicas)


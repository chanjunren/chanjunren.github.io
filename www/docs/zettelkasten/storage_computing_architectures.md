🗓️ 31012025 1652
📎

```ad-abstract
Traditional storage-computing architectures
```

![Architectures](https://help-static-aliyun-doc.aliyuncs.com/assets/img/en-US/5261775461/p386152.png)
## Shared Disk or Shared Storage
- **How it works:** All worker nodes share access to the same distributed storage.
- **Pros:** Easy storage scalability.
- **Cons:** Limited number of worker nodes, data synchronization overhead.

## Shared Nothing

- **How it works:** Worker nodes own their respective storage and communicate for processing.
- **Pros:** High scalability.
- **Cons:** Storage and computing resources must scale together, making scaling inefficient during spikes. Failover is time-consuming due to data rebalancing.

## [[storage_disaggregation_architecture]]


---

# References
- https://www.alibabacloud.com/help/en/hologres/product-overview/architecture

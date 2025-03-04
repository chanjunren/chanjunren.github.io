🗓️ 04032025 2259
📎

- State that is **partitioned by key** when working with a keyed stream (e.g., using `keyBy`)
	- **Efficient local state updates** (avoiding transaction overhead).
    - **Transparent redistribution** when scaling.
- **Sharded across Flink nodes**, with each parallel instance managing state for its assigned keys
- organized as an **embedded key-value store**.

## Key Groups
- State is further partitioned into **Key Groups**, which determine how state is distributed across parallel instances.

### **Distributed State Management**
- The state for a key is **local** to the parallel instance handling that key and is not shared across nodes.

### Clearing State
```ad-warning
If keyed state is not cleared, it will keep growing for every distinct key encountered

Therefore, keyed state should be cleared when it's no longer needed

```

Can be done through
- Manual clearing
- Timers: Clear state after a period of inactivity (e.g., with ProcessFunction).
- [State Time-to-Live (TTL)](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/fault-tolerance/state/#state-time-to-live-ttl) 


---
# References

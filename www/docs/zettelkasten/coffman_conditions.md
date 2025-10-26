🗓️ 02032025 0116

# coffman_conditions

```ad-note
Deadlocks occur when all of these four conditions hold **simultaneously**
```

|Condition|Description|
|---|---|
|**Mutual Exclusion**|At least one resource (e.g., a row lock) is held in a non-sharable way.|
|**Hold and Wait**|A transaction holds a resource while waiting for another.|
|**No Preemption**|A resource cannot be forcibly taken away; it must be released voluntarily.|
|**Circular Wait**|A closed chain of transactions exists, where each transaction is waiting on a resource held by the next transaction in the cycle.|

```ad-tip
Breaking any one of these conditions prevents deadlock

For example:
- **Using lock timeouts** helps break "No Preemption."
- **Acquiring locks in a fixed order** prevents "Circular Wait."

```


---
## References
- ChatGPT
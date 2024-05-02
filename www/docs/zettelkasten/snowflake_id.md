🗓️ 20240321 1110
📎 #backend #id_generation

# snowflake_id

![[snowflake_id_format.png]]

| Bits          | Description                                                                               |
| ------------- | ----------------------------------------------------------------------------------------- |
| First 41 bits | Timestamp from a _chosen epoch_                                                           |
| Next 10 bits  | Machine ID                                                                                |
| Last 12 bits  | Per machine sequence number - Incremented for each ID generated- Resets every millisecond |

### Use case

- Generating **MANY** _unique_ IDs in a _distributed_ manner
  - Capable of generating 4096 (2^12) IDs per millisecond per machine

```ad-warning
 Machine clocks must be synchronised to prevent ID **collisions**
```

---

# References

- https://en.wikipedia.org/wiki/Snowflake_ID

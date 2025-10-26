🗓️ 15012025 0959

# exactly_once_semantics

```ad-abstract
In the context of stream-processing, it Means that 
```

## Definition 
- Each piece of data (event) in a stream is processed **exactly one time** even in the presence of failures like node crashes or network interruptions
- Ensures that the state of the application and the results are correct, consistent, and not duplicated or lost.


## Why Exactly-Once Semantics Matters

1. **Correctness**:
    
    - In applications like financial transactions, order processing, or user analytics, processing data multiple times or losing data can lead to incorrect results.
    - For example, counting a purchase twice or missing a user action could have significant consequences.
2. **Fault Tolerance**:
    
    - Stream processing systems like Flink operate in distributed environments, where failures (e.g., machine crashes, network issues) are common. Exactly-once semantics ensures consistency even in such scenarios.

---

## References
- https://developer.confluent.io/courses/architecture/transactions/?utm_medium=sem&utm_source=google&utm_campaign=ch.sem_br.nonbrand_tp.prs_tgt.dsa_mt.dsa_rgn.apac_lng.eng_dv.all_con.confluent-developer&utm_term=&creative=&device=c&placement=&gad_source=1&gclid=Cj0KCQiAs5i8BhDmARIsAGE4xHyBvVNNHeSoorHlncNwyGGDhfTq0qKRxE1nfDY8a3DOlGXft0fs7cIaAh9jEALw_wcB
- ChatGPT
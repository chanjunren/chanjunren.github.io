🗓️ 31102024 1637
📎 #prometheus

# prometheus_summary_streaming

Refers to the **continuous updating** of quantile estimates as new data arrives

- This approach maintains a **rolling buffer** of past observations
- Allowing **for real-time estimation of quantiles
- No need to recalculate everything from scratch every time new data becomes available

## Traits
### Rolling Buffer
- A portion of the history is kept in a buffer
- This ensures that older data **contributes to the quantile estimations gradually** , maintaining relevance even after newer data points arrive

### Continuous Updates
- As new observations come in, the existing buffer is updated incrementally
- This update mechanism adjusts the estimated quantiles accordingly, reflecting the changing distribution of the monitored data in near-real-time

### Efficiency
- Streaming algorithms optimize for speed and responsiveness by minimizing the amount of reprocessing required
- This is particularly beneficial in environments where rapid feedback on performance metrics is crucial, such as during peak loads or under dynamic conditions15

## Implementation Details
### CKMS Algorithm
In Prometheus, the **Continuous Kernel Memory Sampling (CKMS)** algorithm is commonly used for **summarizing data streams**

This algorithm
- manages the buffer effectively
- keeping a **tight control** on errors around the **targeted quantiles**
- relaxing constraints for other parts of the distribution

---

# References

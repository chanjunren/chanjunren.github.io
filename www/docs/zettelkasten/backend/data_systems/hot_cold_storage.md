🗓️ 07082025 1038

# hot_cold_storage

Hot and cold describe access patterns used to choose storage tiers. Hot data needs frequent, low-latency access; cold data is accessed less often and can tolerate retrieval delay.

| Dimension | Hot tier | Cold tier |
|---|---|---|
| Access pattern | Frequent reads or writes | Rare reads, often retention or recovery |
| Retrieval | Low latency | May require restore or longer retrieval |
| Cost | Usually higher per unit stored or accessed | Usually lower storage cost, with retrieval and operation charges |
| Examples | Current operational data, active indexes | Older logs, backups, archives |

Tier names, latency, availability, durability, and fees differ by provider. Check the product's current service terms before designing around a specific number. Storage tiering is a lifecycle policy; it does not replace backup or replication.

## References

- [Amazon S3 storage classes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html)

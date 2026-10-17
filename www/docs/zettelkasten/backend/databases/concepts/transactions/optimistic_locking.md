🗓️ 07082025 1051

# optimistic_locking

**Optimistic locking** lets transactions proceed without holding a long-lived exclusive lock, then checks whether the data changed before accepting an update.

```mermaid
sequenceDiagram
    participant T as Transaction
    participant DB
    T->>DB: Read row and version v
    T->>T: Compute update
    T->>DB: Update where version = v
    alt One row updated
        DB-->>T: Commit succeeds
    else Version changed
        DB-->>T: Conflict; reload and retry or fail
    end
```

## Version check

An application reads a row and its version, then updates only if that version is unchanged:

```sql
UPDATE account
SET balance = 90, version = version + 1
WHERE id = 7 AND version = 12;
```

If the update affects no rows, another transaction changed the record. The caller must reload, report a conflict, or retry using current data.

## Trade-offs

- Avoids holding a lock while application logic runs.
- Works well when conflicts are uncommon and retries are safe.
- Repeated conflicts waste work and can starve a caller under heavy contention.
- Retried operations must not repeat external side effects blindly.

ORMs may implement this with a version column. This is an application-level pattern; database isolation and constraint checks still matter. Compare [[pessimistic_locking]].

## References

- [Hibernate ORM: Versioning](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html#locking-optimistic)
- [[concurrency_control]]

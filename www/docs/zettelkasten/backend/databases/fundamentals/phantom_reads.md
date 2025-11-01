🗓️ 02032025 0120

# phantom_reads

> Phantom reads occur when a transaction **reads a set of rows**, another transaction **inserts or deletes** rows matching the same condition, and then the first transaction **re-reads** and finds a different result.

```ad-note
Unlike regular inconsistencies, phantom reads affect **sets of rows**, not just individual row modifications
```

---
## References

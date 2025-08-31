🗓️ 09092025 1153
📎

# video_storage_strategy

## Core Principle
```ad-note
Different storage layers serve different purposes - don't mix them
```
## Storage Hierarchy
### Transit Storage (Temporary)
> Hold chunks during upload
- Location: Local filesystem or Redis
- Lifespan: Minutes to hours
- Performance: Fast write, sequential read
## Persistent Storage (Source of Truth)
> Store assembled original videos
- Location: OSS/S3
- Lifespan: Long-term
- Performance: Reliable, backed up

## Delivery Storage (Performance Layer)
> For serving content to users
- Location: CDN edge locations
- Lifespan: Based on cache rules
- Performance: Optimized for read speed

## Storage Decisions
- Never store large files in database (use file paths instead)
```ad-warning
#### 🎯 Core Problem
Databases are optimized for small, structured queries. Video chunks are large, unstructured binary data.

#### 💥 The Big Issues
- Performance - 10MB chunk insert: 2-5 seconds vs 0.1 seconds on filesystem
- Memory usage: Each chunk loads entirely into MySQL buffer pool
- Query impact: Video operations slow down all other database queries

#### Cost
- Database storage: 10-15x more expensive than S3/OSS
- Backup explosion: 500MB video = 500MB+ in every database backup
- Replication cost: Video data replicates to every database replica

#### Scalability
- Size limits: MySQL practical limit much lower than theoretical 4GB
- Concurrent uploads: Multiple video uploads can crash the database
- Growth ceiling: Works for 10 users, fails at 1000 users
```
- Separate upload from delivery (different performance needs)
- Plan for cleanup (temporary files accumulate)
- File Organization

---
# References

🗓️ 09092025 1151
📎

# chunked_uploading
## Core Principle
- Break large files into small, manageable pieces for reliable transfer

## Key Concepts
- Chunk Size: 5-10MB optimal (balance between memory usage and network efficiency)
- Session Management: Track upload state across multiple requests
- Idempotency: Same chunk upload = same result (safe to retry)
- Parallel Processing: Multiple chunks can upload simultaneously
```
INITIATED > UPLOADING > ASSEMBLED > VALIDATED > COMPLETE
                v
            FAILED (with retry/resume capability)
```
## Critical Design Decisions
- Resume Strategy: Store chunk metadata for recovery
- Validation: Hash each chunk to detect corruption
- Cleanup: Remove orphaned chunks from failed uploads
- Progress Tracking: Real-time feedback to users

## When to Use
- Files > 100MB
- Unreliable networks
- Need upload progress
- Multiple concurrent uploads

---
# References

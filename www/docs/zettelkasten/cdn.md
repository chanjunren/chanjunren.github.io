🗓️ 09092025 1203
📎

# cdn

```ad-tldr
Bring content physically closer to users for faster delivery
```

## CDN Concepts
- Edge Locations: Servers distributed globally
- Cache Strategy: Store popular content closer to users
- Origin Pull: CDN fetches from your storage when needed
- Cache Headers: Control how long content stays cached
## Delivery Flow
```
User Request > CDN Edge > (if not cached) > OSS > CDN Edge > User
```
## Optimization Strategies
- Pre-warming: Push popular content to CDN before users request it
- Intelligent routing: Direct users to best edge location
- Compression: Gzip manifests and metadata
- HTTP/2: Multiplexed connections for faster loading
## Performance Metrics
- Time to First Byte (TTFB): How quickly video starts loading
- Cache Hit Ratio: Percentage of requests served from CDN
- Origin Load: How much traffic reaches your storage
- Geographic Performance: Speed by user location

---
# References

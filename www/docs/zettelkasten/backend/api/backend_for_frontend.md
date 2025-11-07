🗓️ 11092025 1355

# backend_for_frontend

**Core Concept**:
- Pattern where separate backend services are created for each frontend type (web, mobile, desktop)
- Each BFF tailored to specific UI needs and constraints
- Sits between frontend clients and general-purpose backend services
- Aggregates and transforms data specifically for each client type

## Why It Matters

- **Different clients have different needs** - mobile needs smaller payloads, web needs more data, IoT needs minimal data
- **Reduces frontend complexity** - BFF handles aggregation, transformation, and business logic
- **Optimizes for each platform** - mobile BFF can compress images, web BFF can send full datasets
- **Decouples frontend from backend changes** - backend APIs can evolve without breaking frontends

## When to Use

- **Multiple client types** with different requirements (web, iOS, Android, TV apps)
- Frontends need **different data formats** or aggregations from same backend services
- Want to **optimize API responses** per platform (payload size, fields, structure)
- Need **different authentication/authorization** per client type
- Backend microservices are **too granular** for frontend consumption (too many roundtrips)
- Want to **version APIs per client** without affecting other clients

## When Not to Use

- Single frontend type (use regular [[api_gateway]])
- Frontends share identical data requirements
- Small application where single API serves all clients well
- Team too small to maintain multiple BFFs
- Backends already provide optimized endpoints per client

## Trade-offs

**Benefits:**
- Frontend-optimized APIs (fewer roundtrips, right-sized payloads)
- Frontend teams control their BFF (autonomy)
- Backend services stay general-purpose
- Easier to evolve frontend without backend changes
- Can use different tech stacks per BFF
- Platform-specific optimizations (caching, compression)

**Drawbacks:**
- Code duplication across BFFs (similar logic repeated)
- More services to deploy and maintain
- Can become "mini-monoliths" with business logic
- Requires clear ownership (frontend or backend team?)
- Increased infrastructure costs
- Risk of inconsistent behavior across BFFs

## Key Distinctions

**BFF vs API Gateway:**
- **BFF**: Multiple specialized backends (one per client type), owned by frontend teams
- **API Gateway**: Single entry point for all clients, shared infrastructure
- BFF is client-specific; Gateway ([[api_gateway]]) is client-agnostic
- Often used together: Gateway in front of BFFs

**BFF vs GraphQL:**
- **BFF**: Separate backend per client, REST/gRPC APIs
- **GraphQL**: Single endpoint, clients query exactly what they need
- GraphQL can eliminate need for BFFs (clients compose queries)
- BFF gives more server-side control; GraphQL gives more client flexibility

This builds on [[api_gateway]] by adding client-specific specialization. Compare with [[reverse_proxy]] which is more generic.

## Common Patterns

### Mobile BFF
- Smaller payloads (limited bandwidth)
- Compressed images
- Simplified responses
- Offline-first considerations
- Push notification handling

### Web BFF
- Full-featured responses
- Richer metadata
- Server-side rendering support
- SEO optimizations

### Third-Party/Partner BFF
- Rate limiting per partner
- Different authentication (API keys)
- Versioned contracts
- Restricted data access

## Common Pitfalls

```ad-warning
**Business logic creep**: BFFs should orchestrate and transform, not contain business rules. Business logic belongs in backend services, not BFFs.
```

```ad-danger
**Tight coupling to UI**: If BFF exactly mirrors UI components, every UI change requires BFF change. Keep BFF somewhat generic to reduce coupling.
```

## Quick Reference

### Architecture Pattern

```
Mobile App    →  Mobile BFF    →
Web App       →  Web BFF       →  Backend Services (User, Order, Inventory)
Admin Portal  →  Admin BFF     →
```

### Responsibilities

**BFF Should:**
- Aggregate multiple backend calls
- Transform data for specific client
- Handle client-specific auth
- Cache responses for client
- Compress/optimize payloads
- Provide client-optimized endpoints

**BFF Should NOT:**
- Contain business logic
- Access database directly (go through backend services)
- Share code with other BFFs (leads to tight coupling)
- Become a monolith (keep focused on client needs)

### Example: Mobile vs Web BFF

**Mobile BFF Response (minimal):**
```json
{
  "user": {
    "id": "123",
    "name": "John Doe",
    "avatar": "https://cdn.example.com/avatars/123_small.jpg"
  },
  "orders": [
    {"id": "456", "total": 99.99, "status": "shipped"}
  ]
}
```

**Web BFF Response (detailed):**
```json
{
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://cdn.example.com/avatars/123_large.jpg",
    "preferences": {...},
    "stats": {...}
  },
  "orders": [
    {
      "id": "456",
      "items": [...],
      "total": 99.99,
      "tax": 8.99,
      "shipping": {...},
      "status": "shipped",
      "tracking": {...}
    }
  ],
  "recommendations": [...]
}
```

### Implementation Approaches

| Approach | Description | When to Use |
|----------|-------------|-------------|
| **Separate Services** | Each BFF is its own service | Large teams, different tech stacks |
| **Shared Codebase** | BFFs share code, deploy separately | Small teams, similar logic |
| **GraphQL** | Single GraphQL endpoint instead of BFFs | Flexible querying, avoid duplication |
| **Gateway + Transforms** | API Gateway with client-specific transforms | Simpler, less infrastructure |

### Node.js BFF Example (Express)

```javascript
// mobile-bff/routes/user.js
app.get('/user/:id', async (req, res) => {
  // Call multiple backend services
  const [user, orders] = await Promise.all([
    userService.getUser(req.params.id),
    orderService.getUserOrders(req.params.id)
  ]);
  
  // Transform for mobile - minimal payload
  res.json({
    user: {
      id: user.id,
      name: user.name,
      avatar: user.avatar.small // mobile-optimized
    },
    orders: orders.slice(0, 5).map(o => ({
      id: o.id,
      total: o.total,
      status: o.status
    }))
  });
});
```

---

## References

- https://samnewman.io/patterns/architectural/bff/
- https://philcalcado.com/2015/09/18/the_back_end_for_front_end_pattern_bff.html
- https://learn.microsoft.com/en-us/azure/architecture/patterns/backends-for-frontends

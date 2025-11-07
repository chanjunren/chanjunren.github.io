🗓️ 07112025 1441

# api_gateway

**Core Concept**: 
- Specialized [[reverse_proxy]] with API-specific features
- Authentication, rate limiting, request/response transformation
- API composition (aggregates multiple service calls)
- Single entry point for microservices architectures

## Why It Matters

- **Single entry point** for all API clients (web, mobile, third-party)
- **Reduces client complexity** by handling cross-cutting concerns centrally
- **Enables microservices** by abstracting service topology from clients
- **Enforces policies** consistently across all APIs

## When to Use

- **Microservices architecture** with multiple backend services
- Need **unified authentication/authorization** across services
- Want to **aggregate multiple service calls** into single client request
- Need **API versioning** and deprecation management
- Require **protocol translation** (REST to gRPC, HTTP to WebSocket)
- Want **centralized rate limiting and throttling**
- Need **API analytics and monitoring**

## When Not to Use

- Monolithic application with single backend (use simple [[reverse_proxy]])
- Internal-only APIs with no external access (simpler routing sufficient)
- Performance-critical paths where latency matters most (direct service calls)
- Very simple API with no cross-cutting concerns

## Trade-offs

**Benefits:**
- Decouples clients from microservices (service discovery abstracted)
- Reduces round trips (request aggregation)
- Centralized policy enforcement (auth, rate limiting)
- Protocol translation (REST ↔ gRPC ↔ SOAP)
- API versioning and backward compatibility
- Request/response transformation
- Simplified client code

**Drawbacks:**
- Additional latency (extra hop + processing)
- Potential single point of failure
- Can become bottleneck under high load
- Risk of becoming "god service" with too much logic
- Increased deployment complexity
- Requires careful capacity planning

## Key Distinctions

**API Gateway vs Reverse Proxy:**
- **API Gateway**: API-aware, transforms requests, aggregates responses, enforces API policies
- **Reverse Proxy**: Protocol-agnostic, simple forwarding, caching, load balancing
- Gateway built on top of reverse proxy with API-specific features

**API Gateway vs Service Mesh:**
- **API Gateway**: Edge proxy, single entry point, north-south traffic
- **Service Mesh**: Sidecar proxies, service-to-service, east-west traffic
- Gateway handles external traffic; mesh handles internal traffic
- Often used together in microservices

This builds on [[reverse_proxy]] by adding API management features. Compare with [[backend_for_frontend]] which creates specialized gateways per client type.

## Common Patterns

### Request Aggregation
Gateway calls multiple microservices, combines responses into single response for client.

```ad-example
**Client Request**: GET /api/user-profile/123

**Gateway Actions**:
1. Call UserService: GET /users/123
2. Call OrderService: GET /users/123/orders
3. Call PreferencesService: GET /users/123/preferences
4. Combine into single JSON response

**Client receives**: Aggregated user profile in one request
```

### Protocol Translation
Gateway translates between client protocol (REST) and internal protocol (gRPC).

### API Versioning
Gateway routes requests to different service versions based on URL or header.

## Common Pitfalls

```ad-warning
**Gateway becoming too smart**: Avoid business logic in gateway. Keep it focused on cross-cutting concerns. Business logic belongs in services.
```

```ad-danger
**Synchronous aggregation blocking**: If gateway aggregates 5 services sequentially, slowest service blocks entire response. Use parallel calls with timeouts.
```

## Quick Reference

### Popular API Gateway Solutions

| Solution | Type | Strengths | Use Case |
|----------|------|-----------|----------|
| **Kong** | Self-hosted | Plugin ecosystem, OSS | Flexible API management |
| **AWS API Gateway** | Managed | AWS integration, serverless | AWS-native apps |
| **Apigee** | Managed | Enterprise features, analytics | Large-scale APIs |
| **Tyk** | Self-hosted | GraphQL, OSS | Developer-focused |
| **KrakenD** | Self-hosted | High performance, stateless | High-throughput APIs |
| **Azure API Management** | Managed | Azure integration | Azure-native apps |
| **Zuul** | Self-hosted | Netflix stack integration | Spring Boot apps |

### Core Features

**Authentication & Authorization:**
- API key validation
- JWT token verification
- OAuth 2.0 / OpenID Connect
- mTLS

**Traffic Management:**
- Rate limiting per client/API
- Request throttling
- Circuit breaking
- Retry logic

**Request/Response Handling:**
- Header injection/removal
- Request/response transformation
- Protocol translation
- Request aggregation

**Observability:**
- Request logging
- Metrics collection
- Distributed tracing
- API analytics

### Configuration Example (Kong)

```yaml
services:
  - name: user-service
    url: http://user-service:8080
    routes:
      - name: user-route
        paths:
          - /api/users
    plugins:
      - name: rate-limiting
        config:
          minute: 100
          policy: local
      - name: jwt
      - name: cors
      - name: request-transformer
        config:
          add:
            headers:
              - X-Gateway-Version:1.0
```

### Request Flow

```
Client → API Gateway → [Auth] → [Rate Limit] → [Transform] → Microservice(s)
                     ↓
                  [Cache Check]
                     ↓
                  [Aggregate if needed]
                     ↓
Client ← [Response Transform] ← API Gateway ← Microservice(s)
```

---

## References

- https://microservices.io/patterns/apigateway.html
- https://docs.konghq.com/gateway/latest/
- https://www.nginx.com/learn/api-gateway/


🗓️ 07112025 1443

# service_mesh

**Core Concept**: 
- Infrastructure layer managing service-to-service communication
- Sidecar proxies deployed alongside each service instance
- Handles traffic management, security (mTLS), observability
- No application code changes required

## Why It Matters

- **Decouples networking logic** from application code
- **Consistent policies** across all services (retries, timeouts, circuit breaking)
- **Zero-trust security** with automatic mTLS between services
- **Observability** with distributed tracing and metrics built-in

## When to Use

- **Large microservices deployments** (50+ services)
- Need **mTLS between all services** for zero-trust security
- Want **unified traffic management** (retries, timeouts, circuit breaking)
- Require **fine-grained access control** between services
- Need **detailed observability** (tracing, metrics) without code changes
- Services in **multiple languages** (mesh provides consistent behavior)
- Need **canary deployments and A/B testing** at infrastructure level

## When Not to Use

- Small microservices deployments (< 10 services) - overhead not justified
- Monolithic applications (no service-to-service traffic)
- Performance-critical paths where sidecar latency unacceptable
- Team lacks expertise to operate complex infrastructure
- Simple architecture where [[api_gateway]] and [[reverse_proxy]] sufficient

## Trade-offs

**Benefits:**
- Automatic mTLS (encryption + authentication)
- Traffic management without code changes
- Unified observability (metrics, logs, traces)
- Fine-grained access policies
- Advanced deployment strategies (canary, blue-green)
- Resilience patterns (retries, circuit breaking, timeouts)
- Protocol-agnostic (HTTP, gRPC, TCP)

**Drawbacks:**
- Significant operational complexity
- Resource overhead (sidecar per pod)
- Additional latency (extra proxy hop)
- Steep learning curve
- Can be overkill for simple architectures
- Debugging becomes more complex
- Version management across many proxies

## Key Distinctions

**Service Mesh vs API Gateway:**
- **Service Mesh**: East-west traffic (service-to-service), sidecar pattern
- **API Gateway**: North-south traffic (client-to-service), single entry point
- Mesh for internal; gateway for external
- Often used together

**Service Mesh vs Reverse Proxy:**
- **Service Mesh**: Per-service sidecar proxies, distributed
- **Reverse Proxy**: Centralized proxy in front of services
- Mesh distributes proxies; reverse proxy centralizes

**Service Mesh vs Library (e.g., Netflix Hystrix):**
- **Service Mesh**: Language-agnostic, infrastructure-level
- **Library**: Language-specific, application-level
- Mesh doesn't require code changes; library does

This builds on [[reverse_proxy]] concepts but distributes proxies as sidecars. Compare with [[api_gateway]] which handles external traffic instead of internal service communication.

## Architecture Components

### Data Plane
- **Sidecar proxies** deployed alongside each service instance
- Handle actual traffic routing, load balancing, encryption
- Examples: Envoy, Linkerd2-proxy

### Control Plane
- Configures and manages data plane proxies
- Provides APIs for policy configuration
- Collects telemetry from proxies
- Examples: Istio Pilot, Linkerd controller

## Common Pitfalls

```ad-warning
**Over-engineering**: Service mesh adds significant complexity. Start with simpler solutions ([[api_gateway]], [[reverse_proxy]]) unless you genuinely need mesh features at scale.
```

```ad-danger
**Resource exhaustion**: Each sidecar proxy consumes CPU and memory. In large deployments, this adds up. Budget for 100-200MB RAM and 0.1-0.5 CPU cores per sidecar.
```

## Quick Reference

### Popular Service Mesh Solutions

| Solution | Proxy | Strengths | Use Case |
|----------|-------|-----------|----------|
| **Istio** | Envoy | Feature-rich, mature | Large-scale Kubernetes |
| **Linkerd** | Linkerd2-proxy | Lightweight, simple | Kubernetes, ease of use |
| **Consul Connect** | Envoy | Multi-platform, service discovery | VM + container hybrid |
| **AWS App Mesh** | Envoy | AWS integration | AWS ECS/EKS |
| **Open Service Mesh** | Envoy | Lightweight, SMI-compliant | Kubernetes, simplicity |

### Core Features

**Traffic Management:**
- Request routing (path, header-based)
- Load balancing (round-robin, least-request)
- Traffic splitting (canary, A/B testing)
- Retries and timeouts
- Circuit breaking
- Fault injection (testing)

**Security:**
- Automatic mTLS between services
- Certificate management and rotation
- Service-to-service authorization
- Identity-based access control

**Observability:**
- Distributed tracing (spans)
- Metrics (latency, error rate, throughput)
- Access logs
- Traffic visualization

### Istio Configuration Example

```yaml
# Virtual Service: traffic routing
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
    - match:
        - headers:
            user:
              exact: "tester"
      route:
        - destination:
            host: reviews
            subset: v2
    - route:
        - destination:
            host: reviews
            subset: v1
          weight: 90
        - destination:
            host: reviews
            subset: v2
          weight: 10
---
# Destination Rule: load balancing, circuit breaking
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: reviews
spec:
  host: reviews
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 1
        maxRequestsPerConnection: 2
    outlierDetection:
      consecutiveErrors: 7
      interval: 5m
      baseEjectionTime: 15m
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
---
# Peer Authentication: enforce mTLS
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
spec:
  mtls:
    mode: STRICT
```

### Request Flow

```
Service A → Sidecar Proxy A → [mTLS encrypt] → Sidecar Proxy B → Service B
              ↓                                        ↓
         [Retry logic]                           [Load balancing]
         [Circuit breaking]                      [Access control]
         [Telemetry]                             [Telemetry]
```

### Key Metrics to Monitor

- **Request rate**: requests/second per service
- **Error rate**: % of failed requests (5xx)
- **Latency**: p50, p95, p99 response times
- **Proxy resource usage**: CPU/memory per sidecar
- **mTLS certificate status**: expiry, rotation

---

## References

- https://istio.io/latest/docs/concepts/what-is-istio/
- https://linkerd.io/what-is-a-service-mesh/
- https://www.envoyproxy.io/docs/envoy/latest/intro/what_is_envoy


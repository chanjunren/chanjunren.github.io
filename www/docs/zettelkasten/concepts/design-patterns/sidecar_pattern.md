🗓️ 07112025 1446

# sidecar_pattern

**Core Concept**:
- Deployment pattern where auxiliary component runs alongside main application
- Sidecar shares same lifecycle as main application (deployed, scaled, terminated together)
- Provides supporting functionality (logging, monitoring, proxying, security)
- Isolated process but shares resources with main app

## Why It Matters

- **Separation of concerns** - cross-cutting concerns isolated from business logic
- **Language-agnostic** - sidecar can be different language than main app
- **Reusable** - same sidecar can augment different applications
- **Independent updates** - update sidecar without changing main app

## When to Use

- Need **cross-cutting concerns** without modifying application code (logging, metrics, security)
- Want **language-agnostic solutions** (e.g., Envoy proxy works with any app language)
- Building **service mesh** where each service needs proxy ([[service_mesh]])
- Need to **augment legacy apps** without code changes
- Want **consistent functionality** across polyglot services
- Need **runtime configuration** changes without redeploying app

## When Not to Use

- Simple applications where library suffices (no need for separate process)
- Resource-constrained environments (sidecar adds overhead)
- Tight coupling between app and sidecar logic (should be in app code)
- Debugging complexity unacceptable (adds another process to monitor)
- Performance-critical paths where extra process overhead matters

## Trade-offs

**Benefits:**
- Decouples cross-cutting concerns
- Language and framework agnostic
- Reusable across different applications
- Independent versioning and updates
- Consistent behavior across services
- Easier testing (test sidecar independently)

**Drawbacks:**
- Resource overhead (CPU, memory per sidecar)
- Increased deployment complexity
- More processes to monitor and debug
- Network latency (inter-process communication)
- Version management (app + sidecar compatibility)

## Key Distinctions

**Sidecar vs Library:**
- **Sidecar**: Separate process, language-agnostic, independent deployment
- **Library**: Same process, language-specific, coupled with app
- Sidecar has overhead but more flexible; library is lighter but language-locked

**Sidecar vs Ambassador:**
- **Sidecar**: Generic term, any auxiliary component
- **Ambassador**: Specific pattern for outbound proxy (client-side load balancing)
- Ambassador is a type of sidecar focused on outbound connections

**Sidecar vs Adapter:**
- **Sidecar**: Augments functionality (adds features)
- **Adapter**: Transforms interface (changes how app is seen)
- Both are deployment patterns; different purposes

This pattern is core to [[service_mesh]] architectures where each service gets a sidecar proxy (Envoy, Linkerd2-proxy).

## Common Use Cases

### Proxy Sidecar
- Service mesh data plane (Envoy, Linkerd2-proxy)
- mTLS termination
- Load balancing
- Circuit breaking
- Request routing

### Observability Sidecar
- Log aggregation (Fluentd, Filebeat)
- Metrics collection (Prometheus exporter)
- Distributed tracing (Jaeger agent)
- APM agents

### Security Sidecar
- Certificate management
- Secret injection
- Authentication/authorization enforcement
- Network policy enforcement

### Configuration Sidecar
- Dynamic config updates
- Feature flag management
- Service discovery

## Common Pitfalls

```ad-warning
**Resource multiplication**: In large deployments, sidecars multiply quickly. 1000 pods = 1000 sidecars. Budget accordingly (typically 100-200MB RAM + 0.1-0.5 CPU per sidecar).
```

```ad-danger
**Tight coupling**: If sidecar requires specific app behavior, they're too coupled. Sidecar should work independently. App shouldn't assume sidecar exists.
```

## Quick Reference

### Kubernetes Sidecar Example

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  containers:
    # Main application container
    - name: app
      image: myapp:1.0
      ports:
        - containerPort: 8080
      resources:
        requests:
          memory: "256Mi"
          cpu: "500m"
    
    # Sidecar container - Envoy proxy
    - name: envoy
      image: envoyproxy/envoy:v1.28
      ports:
        - containerPort: 9901  # Admin
        - containerPort: 15001 # Outbound
      resources:
        requests:
          memory: "128Mi"
          cpu: "100m"
      volumeMounts:
        - name: envoy-config
          mountPath: /etc/envoy
    
    # Sidecar container - Log collector
    - name: log-collector
      image: fluent/fluentd:v1.16
      volumeMounts:
        - name: log-volume
          mountPath: /var/log
      resources:
        requests:
          memory: "64Mi"
          cpu: "50m"
  
  volumes:
    - name: envoy-config
      configMap:
        name: envoy-config
    - name: log-volume
      emptyDir: {}
```

### Common Sidecar Technologies

| Sidecar | Purpose | Used In |
|---------|---------|---------|
| **Envoy** | Proxy, load balancing, mTLS | Istio, AWS App Mesh |
| **Linkerd2-proxy** | Lightweight proxy | Linkerd service mesh |
| **Fluentd/Fluent Bit** | Log aggregation | Kubernetes logging |
| **Jaeger Agent** | Tracing | Distributed tracing |
| **Consul Connect** | Service mesh proxy | Consul |
| **Dapr** | Microservices runtime | Event-driven apps |

### Sidecar Injection

**Manual Injection:**
- Explicitly define sidecars in pod spec
- Full control over configuration
- More verbose YAML

**Automatic Injection (Admission Controller):**
```yaml
# Label namespace for automatic sidecar injection
apiVersion: v1
kind: Namespace
metadata:
  name: myapp
  labels:
    istio-injection: enabled  # Istio auto-injects Envoy
```

### Communication Patterns

**Localhost Communication:**
```
App (localhost:8080) ← → Sidecar Proxy (localhost:15001)
                              ↓
                         External Services
```

**Shared Volume:**
```
App writes logs → Shared Volume ← Log Sidecar reads logs → Log Backend
```

**Environment Variables:**
```
Sidecar sets env vars → App reads env vars
```

### Lifecycle Management

```yaml
# Init container pattern - sidecar starts first
initContainers:
  - name: sidecar-init
    image: sidecar-init:1.0
    command: ['sh', '-c', 'setup-networking.sh']

# Main and sidecar start together
containers:
  - name: app
    image: myapp:1.0
  - name: sidecar
    image: sidecar:1.0

# Graceful shutdown
lifecycle:
  preStop:
    exec:
      command: ["/bin/sh", "-c", "sleep 5"]  # Wait for connections to drain
```

### Resource Planning

```
Per Pod:
├─ Main App:    500m CPU, 512Mi RAM
├─ Proxy Sidecar: 100m CPU, 128Mi RAM
└─ Log Sidecar:   50m CPU, 64Mi RAM
   Total:       650m CPU, 704Mi RAM

1000 Pods = 650 CPU cores, 704GB RAM
```

---

## References

- https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/
- https://learn.microsoft.com/en-us/azure/architecture/patterns/sidecar
- https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/intro/deployment_types


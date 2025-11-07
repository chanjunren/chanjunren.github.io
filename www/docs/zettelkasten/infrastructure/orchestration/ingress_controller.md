🗓️ 07112025 1445

# ingress_controller

**Core Concept**: 
- Kubernetes-native [[load_balancer]] and [[reverse_proxy]]
- Manages external access to services in cluster
- Provides HTTP routing, SSL termination, name-based virtual hosting
- Configured via Kubernetes YAML manifests

## Why It Matters

- **Single entry point** for all external traffic to Kubernetes cluster
- **Native Kubernetes resource** - configured via YAML manifests
- **Automatic service discovery** - integrates with Kubernetes service changes
- **SSL/TLS management** - centralized certificate handling

## When to Use

- Running **Kubernetes** and need external access to services
- Want **path-based routing** to different services (e.g., /api → api-service, /web → web-service)
- Need **host-based routing** (api.example.com → api-service, www.example.com → web-service)
- Require **SSL termination** managed via Kubernetes secrets
- Want **automatic updates** when services scale up/down
- Need **annotations-based configuration** (rate limiting, auth, CORS)

## When Not to Use

- Non-Kubernetes environments (use [[load_balancer]] or [[reverse_proxy]])
- Need layer 4 load balancing only (use Kubernetes Service type=LoadBalancer)
- Very simple single-service deployment
- Need features beyond HTTP/HTTPS (TCP/UDP routing - consider Gateway API)

## Trade-offs

**Benefits:**
- Kubernetes-native (declarative configuration)
- Automatic service discovery
- Single load balancer for entire cluster (cost-effective)
- SSL certificate automation (with cert-manager)
- Annotations for controller-specific features
- Path and host-based routing

**Drawbacks:**
- Kubernetes-specific (not portable)
- HTTP/HTTPS only by default (TCP/UDP needs workarounds)
- Controller-specific annotations (vendor lock-in)
- Learning curve for Kubernetes concepts
- Limited compared to full [[api_gateway]]

## Key Distinctions

**Ingress Controller vs Kubernetes Service:**
- **Ingress**: Layer 7 (HTTP), path/host routing, single entry point
- **Service (LoadBalancer)**: Layer 4 (TCP/UDP), per-service load balancer
- Ingress for HTTP routing; Service for direct TCP/UDP access

**Ingress Controller vs API Gateway:**
- **Ingress**: Basic routing, SSL, Kubernetes-native
- **API Gateway**: Advanced features (auth, rate limiting, transformation)
- Ingress is simpler; Gateway ([[api_gateway]]) is more feature-rich
- Many API Gateways can function as Ingress Controllers

**Ingress vs Gateway API:**
- **Ingress**: Older, HTTP-focused, simple
- **Gateway API**: Newer, protocol-agnostic, role-oriented, more expressive
- Gateway API is successor to Ingress (more powerful)

This is a Kubernetes-specific implementation of [[reverse_proxy]] and [[load_balancer]] concepts. Often extended with [[api_gateway]] features through annotations or custom controllers.

## Common Patterns

### Path-Based Routing
Route requests to different services based on URL path.

```yaml
/api/*     → api-service
/web/*     → web-service
/admin/*   → admin-service
```

### Host-Based Routing
Route requests to different services based on hostname.

```yaml
api.example.com   → api-service
www.example.com   → web-service
admin.example.com → admin-service
```

### SSL Termination
Terminate HTTPS at ingress, forward HTTP to backend services.

## Common Pitfalls

```ad-warning
**Ingress class confusion**: Multiple controllers in cluster need `ingressClassName` field to specify which controller handles which Ingress. Forgetting this leads to no routing.
```

```ad-danger
**Missing default backend**: If no routes match, ingress needs a default backend. Without it, users get connection refused errors instead of proper 404.
```

## Quick Reference

### Popular Ingress Controller Implementations

| Controller | Backed By | Strengths | Use Case |
|------------|-----------|-----------|----------|
| **NGINX Ingress** | NGINX | Most popular, feature-rich | General purpose |
| **Traefik** | Traefik | Auto-discovery, easy setup | Development, Docker |
| **HAProxy Ingress** | HAProxy | High performance | High-traffic production |
| **Kong Ingress** | Kong | API Gateway features | API management |
| **Istio Ingress** | Envoy | Service mesh integration | Advanced traffic mgmt |
| **AWS ALB Ingress** | AWS ALB | AWS-native, cost-effective | AWS EKS |
| **Contour** | Envoy | Modern, CNCF project | Cloud-native apps |

### Basic Ingress Resource

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
    - host: example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 8080
          - path: /web
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 3000
```

### Ingress with TLS

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tls-ingress
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - example.com
        - www.example.com
      secretName: example-tls-secret
  rules:
    - host: example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 80
---
# TLS Secret (create manually or via cert-manager)
apiVersion: v1
kind: Secret
metadata:
  name: example-tls-secret
type: kubernetes.io/tls
data:
  tls.crt: <base64-encoded-cert>
  tls.key: <base64-encoded-key>
```

### Multiple Hosts

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: multi-host-ingress
spec:
  ingressClassName: nginx
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 8080
    - host: www.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 3000
    - host: admin.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: admin-service
                port:
                  number: 4000
```

### Common Annotations (NGINX Ingress)

```yaml
metadata:
  annotations:
    # Rewrites
    nginx.ingress.kubernetes.io/rewrite-target: /$2
    
    # SSL/TLS
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    
    # Rate limiting
    nginx.ingress.kubernetes.io/limit-rps: "100"
    
    # CORS
    nginx.ingress.kubernetes.io/enable-cors: "true"
    nginx.ingress.kubernetes.io/cors-allow-origin: "*"
    
    # Timeouts
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "60"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "60"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "60"
    
    # Authentication
    nginx.ingress.kubernetes.io/auth-type: basic
    nginx.ingress.kubernetes.io/auth-secret: basic-auth
    
    # Custom headers
    nginx.ingress.kubernetes.io/configuration-snippet: |
      more_set_headers "X-Custom-Header: value";
```

### Path Types

| Path Type | Matching Behavior | Example |
|-----------|-------------------|---------|
| **Exact** | Exact match only | `/api` matches `/api` only |
| **Prefix** | Path prefix match | `/api` matches `/api`, `/api/users`, `/api/v1/posts` |
| **ImplementationSpecific** | Controller-defined | Depends on controller |

### Request Flow

```
Internet → DNS → Load Balancer → Ingress Controller
                                        ↓
                                [Parse Host/Path]
                                        ↓
                                [SSL Termination]
                                        ↓
                                [Route to Service]
                                        ↓
                              Service → Pod(s)
```

### Installation (NGINX Ingress via Helm)

```bash
# Add repo
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer

# Verify
kubectl get pods -n ingress-nginx
kubectl get services -n ingress-nginx
```

---

## References

- https://kubernetes.io/docs/concepts/services-networking/ingress/
- https://kubernetes.github.io/ingress-nginx/
- https://gateway-api.sigs.k8s.io/ (successor to Ingress)


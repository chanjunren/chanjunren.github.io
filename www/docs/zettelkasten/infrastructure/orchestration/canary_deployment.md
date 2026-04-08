🗓️ 08042026 1500

# canary_deployment

**What it is:**
- Deploy the new version to a small subset of instances, route a small % of real traffic to it, observe, then gradually increase
- Named after "canary in the coal mine" — the small group detects problems before full rollout
- Combines gradual rollout of [[rolling_deployment]] with traffic-awareness

**Why it exists:**
- Rolling deployment updates instances in batches but every batch gets equal traffic — no way to limit blast radius
- [[blue_green_deployment]] switches all traffic at once — no gradual exposure
- Canary gives you fine-grained control: expose 1% of users first, watch metrics, then scale to 100%

## How It Works

1. Deploy new version to a small number of instances (the "canary")
2. Route a small % of traffic to canary (e.g., 1-5%)
3. Monitor error rates, latency, business metrics
4. If healthy: increase traffic percentage gradually (5% → 25% → 50% → 100%)
5. If problems: route all traffic back to the old version, destroy canary instances
6. Once at 100%: old instances are replaced entirely

The key difference from rolling deployment: **traffic routing is intentional and controllable**, not just a side effect of which instances are up.

## Traffic Routing Methods

### Weighted load balancing
- Load balancer sends X% to canary, (100-X)% to stable
- Most straightforward, works at infrastructure level

### Header/cookie-based routing
- Route specific users to canary (e.g., internal employees, beta testers)
- More targeted — test with known users before exposing to everyone

### Service mesh (Istio, Linkerd)
- Fine-grained traffic splitting at the service level
- Automatic metric collection and shift policies
- Most sophisticated, most complex to set up

## What to Monitor During Canary

The whole point is observation — monitor these before increasing traffic:
- **Error rate**: should be equal to or lower than stable
- **Latency**: p50, p95, p99 — new version shouldn't be slower
- **Business metrics**: conversion rate, transaction success, etc.
- **Resource usage**: CPU/memory — new version shouldn't be hungrier

If any metric degrades: stop the rollout. Automated canary analysis tools (Kayenta, Flagger) can make this decision for you.

## Canary vs Other Strategies

### vs Rolling deployment
- Rolling: all batches get equal traffic, no observation window between batches
- Canary: intentional traffic control, explicit observation period
- Canary is safer but needs traffic-splitting infrastructure

### vs Blue-green
- Blue-green: all-or-nothing switch, instant rollback
- Canary: gradual exposure, slower but catches subtle issues (performance degradation, edge cases)
- Blue-green misses bugs that only appear under partial load or specific user segments

### vs A/B testing
- Often confused — different purpose
- **A/B testing**: measure which version performs better (product decision)
- **Canary**: verify the new version doesn't break things (engineering decision)
- A/B tests run for days/weeks; canary runs for minutes/hours

## When to Use

- High-traffic services where a bug affects thousands of users instantly
- Changes that are hard to test in staging (performance under real load, third-party integrations)
- Team has monitoring and observability in place to actually watch the canary
- Infrastructure supports traffic splitting (weighted LB, service mesh, or smart proxy)

## When to Skip

- Low traffic — not enough data to detect problems in a small percentage
- No monitoring/observability — canary without watching is just a slow rolling deployment
- Simple CRUD apps with good test coverage — [[rolling_deployment]] is sufficient
- Infrastructure doesn't support traffic splitting — you'd need to add complexity first

```ad-warning
**Canary without monitoring is pointless**: The entire value is in observing the canary group. If you don't have dashboards, alerts, and metrics comparing canary vs stable, you're just doing a slow rolling deployment with extra steps.
```

```ad-danger
**Stateful request sequences across versions**: If a user's workflow spans multiple requests (e.g., multi-step checkout), traffic splitting might route some requests to canary and others to stable. Ensure session affinity or make the versions backward-compatible for in-flight workflows.
```

---

## References

- https://martinfowler.com/bliki/CanaryRelease.html
- https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/#canary-deployments

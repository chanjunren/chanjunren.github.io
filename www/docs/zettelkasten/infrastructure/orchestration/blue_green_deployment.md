🗓️ 08042026 1500

# blue_green_deployment

**What it is:**
- Two identical production environments — **blue** (current) and **green** (new version)
- Deploy the new version to the idle environment, test it, then switch all traffic at once
- The old environment stays running as an instant rollback target

**Why it exists:**
- [[rolling_deployment]] has a mixed-version window where old and new coexist — some bugs only surface in that state
- Blue-green eliminates mixed versions entirely: all traffic hits one version at all times
- Rollback is instant — just switch the router back to the old environment

## How It Works

1. **Blue** is live, serving all traffic
2. Deploy new version to **green** (no user traffic yet)
3. Run smoke tests, integration tests against green
4. Switch the load balancer / DNS / router from blue → green
5. Green is now live; blue is idle
6. If problems arise: switch back to blue (seconds, not minutes)
7. Once confident: tear down blue or keep it as the next deployment target

The roles alternate — next deployment, green becomes the "old" and blue becomes the target.

## Traffic Switching Methods

### Load balancer swap
- Change upstream target from blue pool to green pool
- Instant, no DNS propagation delay
- Most common approach

### DNS switching
- Update DNS records to point to green's IP
- Simple but DNS TTL means some users hit blue for minutes/hours after switch
- Not recommended for fast rollback needs

### Router/reverse proxy rules
- Update [[reverse_proxy]] config to route to green
- Works well in Docker setups — point nginx/Traefik to the green service

## When to Use

- Zero tolerance for mixed-version bugs (financial transactions, payment processing)
- Need instant rollback capability
- Can afford double the infrastructure during deployment
- Database schema is compatible with both versions (or you use a shared database)

## When to Skip

- Budget-constrained — running two full environments is expensive
- Deployments are frequent (multiple times a day) — overhead of maintaining two environments adds up
- [[rolling_deployment]] or [[canary_deployment]] gives you enough confidence with less cost

## Trade-offs

### Instant rollback
- The killer feature — switch back in seconds, no re-deployment needed
- Compare to rolling deployment where rollback means rolling out the old version again

### Double infrastructure cost
- Two full environments running simultaneously during the switch window
- Can be mitigated by tearing down the idle environment after confidence period
- In cloud environments, you only pay for the overlap period

### Database challenge
- Both environments typically share the same database
- Schema migrations must be backward-compatible with both versions
- Alternatively, use separate databases — but then you need data synchronization, which is complex

### No gradual exposure
- All users switch at once — if the new version has a subtle bug, everyone is affected
- Compare to [[canary_deployment]] which exposes a small percentage first

```ad-warning
**Database migrations are the hard part**: If green requires a schema change that breaks blue, you can't safely switch back. Always use backward-compatible migrations (add columns, not rename/remove) and clean up in a later release.
```

```ad-example
**Docker blue-green pattern**: Run two compose stacks (`blue` and `green`) behind a shared reverse proxy. Deploy to the idle stack, test it, then update the proxy config to route to the new stack. The old stack stays running as rollback insurance.
```

---

## References

- https://martinfowler.com/bliki/BlueGreenDeployment.html
- https://docs.aws.amazon.com/whitepapers/latest/overview-deployment-options/bluegreen-deployments.html

🗓️ 08042026 1200

# rolling_deployment

**What it is:**
- Deployment strategy that replaces old instances with new ones incrementally, in batches
- At any point during the rollout, some instances run the old version and some run the new version
- The standard approach for zero-downtime deployments

**Why it exists:**
- **Big-bang deployment** (stop everything, deploy, start everything) causes downtime
- **Rolling deployment** keeps the service available throughout — old instances serve traffic until new ones are healthy
- Most orchestration platforms ([[docker_swarm]], [[kubernetes]]) use this as the default strategy

## How It Works

1. Take a batch of old instances out of the load balancer
2. Shut them down
3. Start new version instances
4. Wait for health checks to pass
5. Add new instances to the load balancer
6. Repeat until all instances are updated

The batch size and wait time between batches are configurable — this controls the rollout speed vs risk trade-off.

## Key Parameters

### Batch size (parallelism)
- How many instances update at once
- Smaller batches = slower but safer (less capacity reduction at any moment)
- Larger batches = faster but riskier (more capacity lost if new version is broken)

### Delay between batches
- Time to wait after one batch is healthy before starting the next
- Gives you time to observe metrics and catch problems early

### Rollout order
- **Stop-first**: kill old, then start new — temporarily reduces capacity, simpler
- **Start-first**: start new alongside old, then kill old — maintains full capacity, needs extra resources temporarily

### Failure action
- **Pause**: stop the rollout, leave mixed versions running, wait for human decision
- **Rollback**: automatically revert to previous version

## Rolling vs Other Strategies

### vs Blue-Green deployment
- **Blue-Green**: two full environments, switch traffic all at once
- Requires double the infrastructure; instant rollback (just switch back)
- Rolling: gradual, uses same infrastructure, rollback takes time
- Blue-Green is simpler conceptually but expensive

### vs Canary deployment
- **Canary**: route a small % of traffic to the new version first, observe, then roll out fully
- More control over blast radius — catch issues with minimal user impact
- Rolling: all batches get the same traffic weight, no gradual traffic shifting
- Canary is rolling + traffic awareness

### vs Recreate (big-bang)
- **Recreate**: stop all old, start all new — simplest, but has downtime
- Only acceptable when downtime is tolerable or the app can't run mixed versions

## Prerequisites for Rolling Deployments

### Backward compatibility
- Old and new versions run simultaneously during rollout
- Database schema changes must be compatible with both versions
- API contracts must not break between versions

### Health checks
- The orchestrator needs to know when a new instance is ready
- Without [[docker_healthcheck]], it may route traffic to instances that aren't ready yet

### Statelessness
- Instances should be interchangeable — no sticky sessions or local state
- If your app stores session data locally, a user hitting old then new instances will lose context

## Trade-offs

### Advantages
- Zero downtime
- No extra infrastructure (unlike blue-green)
- Gradual — problems affect a subset of users first
- Built into most orchestration platforms

### Disadvantages
- Mixed versions during rollout — must handle backward compatibility
- Rollback is slower than blue-green (must roll forward or reverse the process)
- Harder to test — the mixed-version state is itself a transient environment

```ad-warning
**Database migrations during rolling deployment**: If the new version requires a schema change that breaks the old version, the rollout will fail. Run backward-compatible migrations first (add columns, not rename/remove), deploy the new code, then clean up the schema in a separate migration.
```

---

## References

- https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment
- https://docs.docker.com/engine/swarm/swarm-tutorial/rolling-update/

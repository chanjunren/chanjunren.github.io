🗓️ 25042026 1442
📎 #reliability #debugging #observability

# error_timeline_shapes

> The shape of an error rate over time tells you what kind of failure you're dealing with. Cliff vs ramp vs spike → different causes, different fixes.

## Why Shape Matters

When the dashboard lights up, the first useful question isn't "what's the error?" — it's **"what does the error rate look like over time?"**. Shape narrows the hypothesis space before you read any logs.

## The Four Shapes

### 1. Cliff (state flip)

```
errors
  |          ┌──────────
  |          │
  |          │
  |__________│
            22:35
```

- Error rate goes from ~0 to "everything" in seconds.
- Implies a discrete state change: a connection wedged, a config flag flipped, a deploy went out, a node failed over.
- Restart / rollback typically fixes it.
- **Look for**: deploys, config changes, peer failovers, [[connection_wedge]] events.

### 2. Ramp (capacity / accumulation)

```
errors
  |              _____
  |          ___/
  |       __/
  |    __/
  |__/
```

- Error rate climbs gradually over minutes / hours / days.
- Implies something is accumulating: connections leaking, memory pressure, queue backing up, disk filling, replication lag growing.
- Restart "fixes" it temporarily, then it returns.
- **Look for**: [[connection_leak]], memory leak, disk full, queue depth, slow consumer.

### 3. Spike (transient)

```
errors
  |     ┌─┐
  |     │ │
  |_____│ │___________
```

- Brief burst, returns to baseline on its own.
- Implies a transient event: traffic surge, brief network blip, GC pause, downstream timeout that recovered.
- Often safe to ignore unless frequent or aligning with user impact.
- **Look for**: traffic spikes, GC logs, downstream incidents, retry storms.

### 4. Sawtooth (periodic)

```
errors
  |   ┌┐    ┌┐    ┌┐
  |   ││    ││    ││
  |___┘└____┘└____┘└___
```

- Repeats on a schedule.
- Implies a cron job, cache eviction wave, batch job, scheduled deploy, periodic GC.
- **Look for**: cron schedules, cache TTLs, batch jobs, alignment with off-by-N-minutes patterns.

## Combining With Scope

Shape × scope narrows the cause further:

| Shape | Scope | Likely cause |
|---|---|---|
| Cliff | One pod | [[connection_wedge]], pod-local state |
| Cliff | All pods | Deploy, config push, downstream outage, DB failover |
| Ramp | One pod | Local resource leak (memory, fd, threads) |
| Ramp | All pods | Pool leak ([[connection_leak]]), slow downstream, queue backing up |
| Spike | All pods | Traffic surge, downstream blip |
| Sawtooth | All pods | Cron / batch / scheduled event |

## How To Read The Timeline Fast

1. **Pull the error rate over the last 1h, 6h, 24h.** Different scales reveal different shapes.
2. **Identify the shape** before reading individual errors.
3. **Cross-reference scope** — one pod or all? One peer or all?
4. **Hypothesize cause class** from shape × scope.
5. *Then* dive into logs for the specific error.

## Key Takeaways

- **Shape narrows hypothesis class.** Cliff, ramp, spike, sawtooth → very different causes.
- **Cliff = state flip.** Something changed at a discrete moment.
- **Ramp = accumulation.** Something is filling up.
- **Look at the timeline before the logs.** Saves minutes of dead-end reading.

---

## References

- [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [[connection_leak]] — canonical ramp
- [[connection_wedge]] — canonical cliff

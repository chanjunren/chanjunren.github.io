🗓️ 29042026 1430
📎 #system_design #design #distributed_systems

# design_unique_id_generator_snowflake

> The "give me unique 64-bit IDs across a distributed system, fast, sortable by time" design problem. Snowflake (Twitter, 2010) is the canonical answer; the design teaches clock-skew handling, machine-ID assignment, and bit-budget engineering.

## 1. Requirements

### Functional
- Generate globally unique 64-bit IDs.
- Time-ordered (newer IDs > older IDs roughly).
- Compact (fits in a `BIGINT`).
- High throughput (millions of IDs/sec across the system).
- No central coordination on the hot path.

### Non-functional
- Latency: microseconds.
- Tolerate node failures (no single point of failure).
- Bounded clock skew (NTP-synchronised).

## 2. Why Not the Alternatives

### Auto-increment (DB sequence)
- Single point of contention; doesn't scale beyond one DB.
- Sharded DBs need separate per-shard counters → IDs not globally unique.
- Falls over under concurrent allocation pressure.

### UUID v4 (random)
- Globally unique without coordination.
- 128 bits (twice the size). Doubles index size, [[b_plus_tree_indexes]] depth.
- Random ordering — bad for clustered indexes (every insert hits a random page → write amplification).
- No time-ordering for chronological queries.

### UUID v7 (time-ordered)
- 128-bit, time-prefixed. Solves the ordering problem.
- Still 2× the storage of 64-bit IDs.
- Modern alternative if 128-bit cost is acceptable. ULIDs / KSUIDs occupy similar territory.

### Centralised counter service
- Works at moderate scale (1-10k IDs/s).
- Single point of failure / contention at higher rates.
- Network RTT per ID.

**Snowflake**: distributed, time-ordered, fits in 64 bits, high throughput per node, no coordination on the hot path.

## 3. The Snowflake Bit Layout

Twitter's original split (2010):

```
┌─┬───────────────────────────────────────────┬──────────┬───────────┐
│0│              41 bits timestamp            │ 10 bits  │  12 bits  │
│ │           (ms since custom epoch)         │ machine  │ sequence  │
└─┴───────────────────────────────────────────┴──────────┴───────────┘
 1                                            42         52         64
```

- **1 bit** sign (always 0 to keep IDs positive in signed 64-bit ints).
- **41 bits timestamp** in milliseconds since custom epoch → `2^41 / (1000 × 86400 × 365)` ≈ 69 years of usable range.
- **10 bits machine ID** → 1024 distinct nodes.
- **12 bits sequence** within a millisecond → 4096 IDs/ms/node = 4M IDs/sec/node.

System-wide throughput: 1024 × 4M = 4 billion IDs/sec. Plenty.

## 4. The Algorithm

```python
last_ms = 0
sequence = 0

def next_id():
  global last_ms, sequence
  now_ms = current_millis()

  if now_ms == last_ms:
    sequence = (sequence + 1) & 0xFFF       # 12-bit mask
    if sequence == 0:
      # Sequence overflow within the same ms — wait for next ms
      while now_ms <= last_ms:
        now_ms = current_millis()
  else:
    sequence = 0
    last_ms = now_ms

  return (now_ms - EPOCH) << 22 | (machine_id << 12) | sequence
```

The sequence resets every millisecond. If a single node tries to allocate >4096 IDs in one ms, it busy-waits to the next ms.

## 5. Architecture

```
[App instance N] ── (in-process call) ──> [Snowflake generator (lib in-proc or sidecar)]
                                              │
                                              ▼
                                       reads machine_id once at startup
                                              │
                                              ▼
                                  [ZooKeeper / etcd] for machine_id assignment
```

Two deployment models:

### Library mode (in-process)
The generator runs inside each app instance. Each instance reads its `machine_id` once at startup from ZooKeeper or etcd, then issues IDs without further coordination.

Pros: zero network hops on the hot path.
Cons: 10 bits of machine_id space (1024 IDs) becomes a real cap if you autoscale to thousands of pods.

### Service mode (sidecar or central)
A dedicated service issues IDs on request. Apps call it over HTTP/gRPC.

Pros: machine_id constraint applies to the service, not every app instance — more pods possible.
Cons: extra network RTT per ID.

Library mode is the default. Use service mode if your fleet exceeds 1024 instances.

## 6. Deep Dive

### 6.1 Machine ID Assignment

Each generator instance needs a unique 0–1023 machine_id. Three approaches:

| Strategy           | Mechanism                                        | Trade-off                                       |
|--------------------|--------------------------------------------------|------------------------------------------------|
| Static config      | Hardcoded per host (deployment-time variable)    | Brittle; collisions on misconfig               |
| ZooKeeper / etcd   | Acquire ephemeral sequential node at startup     | Requires consensus dependency; standard pattern |
| Hash-based         | `hash(hostname || pod_uid) mod 1024`             | Collisions possible at fleet > sqrt(1024) ≈ 32 hosts |

ZooKeeper / etcd is the production answer (the Twitter-original design assumes ZooKeeper). Both use consensus to allocate unique sequential IDs cleanly. See [[raft]] for the underlying primitive.

### 6.2 Clock Skew — The Killer Failure Mode

Snowflake's correctness depends on `now_ms` being monotonically non-decreasing. NTP can step the clock backward — directly violating this.

```
node A: t=1000, allocates id_X
node A: clock steps back, t=995
node A: allocates id_Y → may have lower id than id_X for same machine
```

Worse: if t=995 collides with a previously-issued (t=995, sequence=N), the new ID *duplicates* an old ID.

**Mitigations:**

- **Reject backward time**: if `now_ms < last_ms`, raise an error or busy-wait. Don't issue an ID.
- **Use monotonic clocks** (`CLOCK_MONOTONIC` on Linux) for the comparison; only use wall-clock for the timestamp value, sanity-checked.
- **Disable NTP slew steps** in favour of slow drift correction. Configure `chronyd` / `ntpd` accordingly.
- **Persist `last_ms`** so a process restart with a backwards-stepped clock detects the regression.

Snowflake-derived libraries that ignore this (and many do) are subtly broken. Production-quality implementations always check.

### 6.3 Epoch Choice

Use a custom epoch close to your service launch (e.g. `2020-01-01`). Don't use the Unix epoch (1970) — you'd waste 50 years of the 41-bit budget on past dates.

```
custom_epoch = 1577836800000   # 2020-01-01 00:00:00 UTC
timestamp = (now_ms - custom_epoch)
```

This gives you 69 years from your epoch. Document it; future migrations will need it.

### 6.4 Bit Allocation Variants

The 41/10/12 split is one choice. Others:

| Variant            | Layout                          | Suited for                                     |
|--------------------|---------------------------------|------------------------------------------------|
| **Twitter Snowflake** | 41 ts + 10 machine + 12 seq | Default; balanced.                            |
| **Sonyflake**      | 39 ts (10ms ticks) + 8 machine + 16 seq | Lower throughput (655k/sec/node), more nodes (256), longer epoch. |
| **Discord**        | 42 ts + 5 worker + 5 process + 12 seq | Worker/process split for their architecture.  |
| **Instagram**      | 41 ts + 13 shard + 10 seq      | Shard-aware IDs to keep records co-located on the right shard. |

The split is a budget — choose based on (throughput per node) × (number of nodes) × (years of operation).

### 6.5 Sequence Overflow

If a node issues >4096 IDs in one ms, the sequence overflows. Options:

- **Busy-wait** to the next ms (Twitter default). Throughput temporarily capped.
- **Borrow from sequence space of the next ms** (some implementations). Risk of cross-millisecond collisions if the borrowed range overlaps the next ms's allocations.

Busy-waiting is the safe default. If your throughput legitimately exceeds 4M IDs/sec/node, increase sequence bits at the cost of timestamp range or machine count.

### 6.6 Lessons for "I just need unique IDs"

Many apps reach for snowflake when they don't need it. Decision tree:

| Need                                      | Choice                              |
|-------------------------------------------|-------------------------------------|
| < 1k IDs/sec, single DB                   | Auto-increment                      |
| Distributed across N nodes, < 1k/sec each | Per-node range allocation from a sequence |
| Sortable, distributed, high throughput    | Snowflake                           |
| 128-bit OK, no clock skew worry           | UUID v7 / ULID                      |
| Need encrypted/random IDs (privacy)       | UUID v4 + separate sortable column  |

## Trade-Offs Summary

| Decision               | Choice                | Trade-off                                       |
|------------------------|-----------------------|-------------------------------------------------|
| ID size                | 64 bits               | Time-bounded (~69 years from custom epoch)      |
| Sortability            | Time-prefix           | Reveals creation time (mild privacy concern)    |
| Throughput per node    | 4M/sec                | Hard cap; busy-wait on overflow                 |
| Machine ID space       | 1024 nodes            | Larger fleets need service-mode or layout change |
| Coordination           | Once at startup       | NTP / clock drift becomes the main risk         |

## Common Pitfalls

- **Ignoring clock backwards step** — produces duplicate IDs silently. Always check.
- **Reusing machine_id** — two nodes with the same `machine_id` produce duplicate IDs. ZooKeeper/etcd assignment is non-negotiable.
- **Unix epoch** — burns most of the timestamp budget on the past.
- **Library + autoscaling** — 1024 machine IDs cap; thousands of pods exhaust it. Plan early.
- **64 bits when you needed 128** — once IDs are issued, growing the size is a migration. Pick wisely.
- **Time-prefix leaking in privacy-sensitive contexts** — guessable creation time exposes when accounts/orders were created. Either accept it or use a distinct opaque ID.
- **NTP slewing too fast** — large slew steps look like clock backsteps. Configure conservatively.
- **Forgetting persistent `last_ms`** — process restart loses state; if the system clock stepped back during downtime, the new process happily issues old timestamps.

## Related

- [[raft]] — what etcd / ZooKeeper rely on for `machine_id` allocation.
- [[design_url_shortener]] — uses snowflake as one of the ID-generation options.
- [[b_plus_tree_indexes]] — why time-ordered IDs matter for clustered-index inserts.
- [[consistent_hashing]] — alternative for sharding where the ID itself is the shard key.
- [[system_design_framework]] — the framework this design follows.

---

## References

- Twitter Engineering, ["Announcing Snowflake"](https://blog.x.com/engineering/en_us/a/2010/announcing-snowflake) (2010).
- Sonyflake: [github.com/sony/sonyflake](https://github.com/sony/sonyflake).
- Instagram Engineering, ["Sharding & IDs at Instagram"](https://instagram-engineering.com/sharding-ids-at-instagram-1cf5a71e5a5c).
- RFC 9562: [UUIDs version 7](https://www.rfc-editor.org/rfc/rfc9562) — modern alternative.

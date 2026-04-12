🗓️ 13042026 1530
📎 #data-engineering #orchestration

# prefect

Python-native workflow orchestration — define pipelines as decorated functions, let Prefect handle scheduling, retries, observability, and infrastructure provisioning.

## Hybrid Execution Model

- **Orchestration** (Prefect server/cloud) is separated from **execution** (your infrastructure)
- Server stores state, schedules runs, serves the UI and API
- Your code runs on your machines, in your network — Prefect never touches your data
- Contrast with [[kubernetes]]: K8s orchestrates containers, Prefect orchestrates Python functions

## Core Concepts

### Flows and Tasks

- **Flow**: Python function decorated with `@flow` — the top-level unit of work
- **Task**: Python function decorated with `@task` — a discrete step within a flow
- Flows can call other flows (**subflows**) — compose pipelines naturally
- No DAG object to construct — just call functions, branching and looping work normally

### Deployments and Execution

- **Deployment**: metadata that tells Prefect *how* and *when* to run a flow
  - Schedule, parameters, infrastructure config, work pool assignment
- **Work pool**: defines *where* work runs (local process, Docker, K8s, serverless)
  - **Pull pools**: workers actively poll for runs
  - **Push pools**: submit directly to serverless infra (no worker needed)
- **Worker**: long-running process that polls a work pool, provisions infra, executes flows

### Blocks and Artifacts

- **Blocks**: typed, reusable config objects — credentials, storage locations, notification channels
  - Encrypted at rest, shareable across flows and deployments
- **Artifacts**: structured outputs from flow runs (tables, markdown, links) — visible in UI with lineage tracking

## Flow Run Lifecycle

1. **Deployment** registered with server — defines schedule + infra config
2. Server creates a **Scheduled** flow run (by cron, event trigger, or API call)
3. **Worker** polls its work pool, picks up the run
4. Worker provisions infrastructure (container, process, cloud function)
5. Flow code executes — tasks report state transitions back to server
6. Run reaches terminal state: **Completed**, **Failed**, or **Cancelled**

## Why Code-First Matters

- Flows are regular Python — use if/else, loops, try/except, any library
- **Dynamic workflows**: generate tasks at runtime based on data (no static DAG limitation)
- Test flows with `pytest` — they are just functions
- No always-on scheduler needed — workers poll on demand, scale to zero when idle

## Resilience and Scheduling

- **Retries**: per-task or per-flow, with configurable delay and exponential backoff
- **Caching**: skip re-execution when inputs haven't changed (`cache_key_fn` + `cache_expiration`)
- **Concurrency limits**: cap parallel runs globally or per work pool/tag
- **Events and automations**: react to state changes — notify on failure, trigger downstream flows, pause deployments

## Prefect 3 Changes

- **Workers** replace agents (agents deprecated) — stronger infrastructure governance
- **Events system**: first-class event bus powering automations and audit trails (previously cloud-only, now open source)
- **Transactions**: group tasks into atomic units with rollback on failure

## Prefect vs Airflow

| Aspect             | Prefect                           | Airflow                             |
| ------------------ | --------------------------------- | ----------------------------------- |
| Workflow definition | Decorated Python functions        | DAG object with operator classes    |
| Dynamic workflows  | Native (just write Python)        | Limited (dynamic task mapping)      |
| Scheduling         | Server-side or event-driven       | Always-on scheduler required        |
| Execution model    | Hybrid (orchestrate ≠ execute)    | Coupled (scheduler manages workers) |
| Setup              | `pip install prefect`             | Scheduler + webserver + metadata DB |
| Data passing       | Native Python return values       | XComs (serialized, size-limited)    |

Prefect trades Airflow's mature ecosystem and battle-tested scale for more Pythonic ergonomics and a simpler operational model. See [[extract_transform_load]] for the pipelines Prefect typically orchestrates.

```ad-warning
**Prefect 2 → 3 migration**: Agents, `infrastructure` blocks, and `DeploymentSpec` are removed. Existing Prefect 2 deployments need rework around workers and `prefect.yaml`.
```

```ad-example
Decorate any function with `@flow`, call it. Prefect tracks the run, logs output, handles retries — zero config needed to start.
```

---

## References

- https://docs.prefect.io/latest/
- https://docs.prefect.io/latest/concepts/
- https://www.prefect.io/how-it-works

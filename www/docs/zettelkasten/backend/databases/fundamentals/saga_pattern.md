🗓️ 29042026 1800
📎 #distributed_systems #transactions #patterns

# saga_pattern

> The pragmatic alternative to [[two_phase_commit]] for cross-service business workflows. A long transaction broken into local transactions, each with a compensating action.

## The Idea

```ad-abstract
A saga is a sequence of local transactions T1, T2, …, Tn. If any Ti fails, run **compensating actions** Cn-1, …, C1 in reverse to undo the prior steps. Each Ti and Ci is locally atomic and committed independently.
```

No global atomic commit. No 2PC. Eventual consistency between services. Trade-off: simpler to operate, harder to reason about correctness.

## Worked Example: Order Placement

```
T1: reserve inventory          (inventory service)
T2: charge payment             (payment service)
T3: schedule shipping          (shipping service)
T4: send confirmation          (notification service)
```

If T3 fails (shipping unavailable):
```
C2: refund payment
C1: release inventory reservation
```

Each compensation is a **new transaction**, not a rollback of the original. You can't "un-charge" a card by erasing history; you issue a refund.

## Choreography vs Orchestration

### Choreography — event-driven

Each service listens for events, decides its own next step. No central coordinator.

```
inventory.reserved → payment service charges → payment.charged → shipping service schedules → ...
```

**Pros**: loose coupling, no SPOF, scales naturally.

**Cons**: hard to see the workflow as a whole. "Who fails what when?" is implicit in the event graph. Debugging is grep-the-logs across N services.

**Best for**: simple, stable workflows with few services.

### Orchestration — central state machine

A saga orchestrator (own service or library) drives the workflow. It calls each step explicitly and tracks state.

```
Orchestrator:
  ├─ call inventory.reserve() → ok
  ├─ call payment.charge()    → ok
  ├─ call shipping.schedule() → FAILED → trigger compensations
  ├─ call payment.refund()    → ok
  ├─ call inventory.release() → ok
  └─ saga: ABORTED
```

**Pros**: explicit workflow definition, easy to monitor, single place to add observability and retries.

**Cons**: orchestrator is a critical service; orchestrator's own state must be durable (often a saga state table in DB).

**Best for**: complex workflows with branching, retries, timeouts, human-in-the-loop steps.

**Tools**: Temporal, Camunda, AWS Step Functions, Spring's modest `@SagaOrchestrationStart` ecosystem.

## Compensations Are Tricky

- **Not always perfect inverses** — refund != un-charge (audit trail differs). A confirmation email can't be un-sent (you'd send a "your order was cancelled" instead).
- **Must be idempotent** — compensations may be retried. Double-refund is a real bug.
- **Can fail** — what if the refund service is down? Retry with exponential backoff, dead-letter to manual queue, or escalate.
- **Order matters** — compensate in reverse order so each Ci can undo against the post-Ti state.
- **Some operations are uncompensable** — sent emails, physical shipments. The saga must check these *before* committing them, or accept the side effect.

## Semantic vs Syntactic Compensation

- **Syntactic**: `delete X` undoes `insert X`. Pure.
- **Semantic**: `refund $100` undoes `charge $100` from the customer's perspective, even though both are recorded events. Real-world compensations are almost always semantic.

## Isolation Concerns

Sagas don't have ACID isolation across the whole workflow. Other transactions can read intermediate states.

A user might see "order placed, payment charged, shipping scheduled" briefly, then "order cancelled" if a later step fails. UI must accommodate (e.g. show "processing" until saga completes).

Mitigations:
- **Semantic locks** — mark records as "in saga" so other transactions skip them.
- **Pessimistic view** — don't expose intermediate state to other consumers.
- **Idempotent reads** — readers tolerate seeing transient states.

## Implementation Building Blocks

- [[outbox_pattern]] for reliably publishing each step's event.
- Idempotent consumer pattern *(planned)* for handling retried events.
- Persistent saga state for orchestration (DB table).
- Timeout + retry with backoff per step.
- Compensations defined per step at design time, not after the fact.

## Common Pitfalls

- **A saga is loosely a distributed transaction** — but eventually consistent, not atomic. There's always a window where the system is partially complete.
- **Compensations can fail too** — retry with backoff, then dead-letter to ops. No clean automatic answer; design for human escalation.
- **Choreography vs orchestration** — orchestration scales better for complex flows (state machine is explicit). Choreography starts simpler but rots into a tangled event graph as steps accumulate.
- **Inside a single step, use [[outbox_pattern]]** — write the event to the same DB transaction so the step's DB write and its outbound message are atomic.
- **Saga vs 2PC** — 2PC is atomic-or-bust during the transaction; saga is "complete or compensated", with each step independently durable. 2PC blocks; saga doesn't. 2PC has stronger guarantees; saga has higher availability.
- **Every step and every compensation must be idempotent** — use idempotency keys per saga step. Retried events are routine.

## Related

- [[two_phase_commit]] — what saga replaces.
- [[outbox_pattern]] — for the per-step "DB write + event publish" atomicity.
- [[cap_theorem]] — saga is the AP-leaning answer to cross-service consistency.
- [[consistency_models]] — sagas give eventual consistency at best.

---

## References

- Garcia-Molina & Salem, "Sagas" (1987) — the original paper
- Microservices.io: [Saga Pattern](https://microservices.io/patterns/data/saga.html)
- "Microservices Patterns" (Chris Richardson) ch. 4

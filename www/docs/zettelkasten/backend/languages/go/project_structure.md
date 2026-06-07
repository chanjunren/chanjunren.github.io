🗓️ 07062026 1130
📎

# project_structure

**Core Concept**: Organize a Go service by **domain, not by layer**. Group everything for one feature together; keep cross-cutting infrastructure in a shared place; hide internals behind `internal/`.

## Domain, not layer

The Spring instinct is to split top-level folders by technical layer — `controllers/`, `services/`, `repositories/`. In Go, prefer splitting by **business domain**, with the layers living *inside* each domain.

```
By layer (avoid)          By domain (prefer)
controllers/              internal/
services/                   user/
repositories/                 handler.go
                              service.go
                              repository.go
                            order/
                              handler.go
                              ...
```

Why: a change to "users" touches one folder, not three. Packages map to concepts you talk about, and dependencies between domains become visible instead of hidden inside a shared `services/` bucket.

## The standard top-level shape

```
cmd/<app>/main.go     # entrypoint + composition root
internal/             # private packages (can't be imported externally)
  <domain>/           # one folder per business domain
  shared/             # cross-cutting infrastructure
go.mod
```

- **`cmd/<app>`** — a thin `main` that wires everything ([[dependency_injection]]) and starts the server. Little logic of its own.
- **`internal/<domain>`** — handlers, services, repositories, models for one domain.
- **`internal/shared`** — config, logging, db, http helpers, metrics: things every domain uses.

## internal/ is enforced privacy

A package path containing `internal/` can only be imported by code rooted at the parent of `internal/`. The compiler enforces it. This lets you expose a clean public API (if the repo is a library) while keeping implementation packages truly private — no accidental external coupling.

## Package boundaries and naming

- One package per directory; the package name is usually the folder name.
- Name packages after what they *provide* (`config`, `health`, `alerting`), not generic buckets (`utils`, `helpers`, `common`).
- Keep packages small and cohesive; if a file passes ~300 lines or a package mixes concerns, split it.
- Define interfaces in the **consumer** package, not the implementer's — that's what keeps domains decoupled (see [[interfaces]] and [[dependency_injection]]).

```ad-warning
Don't name a package after a standard-library package — e.g. a package literally named `http` forces every importer to alias it to avoid colliding with `net/http`. Name it `httpx` (or `transport`, `web`) so it imports cleanly with no alias.
```

## Avoid premature shared/

Resist dumping everything into `shared/`. Code belongs there only when **more than one domain** genuinely uses it. A type used by a single domain lives in that domain. Promote to `shared/` when a second consumer appears, not before.

## Example layout

```ad-example
A small multi-domain service:
```
cmd/
  api/
    main.go              # wire deps, start server
internal/
  user/
    handler.go
    service.go
    repository.go
    routes.go
  billing/
    handler.go
    service.go
    routes.go
  shared/
    config/
    database/
    httpx/               # not "http"
    logger/
    errors/
go.mod
```
```

## References

- [Organizing a Go module](https://go.dev/doc/modules/layout)
- [[learning_plan]]

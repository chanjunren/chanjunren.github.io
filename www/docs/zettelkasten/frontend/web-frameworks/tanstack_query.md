🗓️ 07042026 1400

# tanstack_query

**What it is:**
- Async state management library for React (formerly React Query)
- Handles fetching, caching, synchronizing, and updating server state
- You describe *what data you need* and *how to fetch it* — the library manages the rest (loading, errors, refetching, cache invalidation)

**Why it exists:**
- **Server state is fundamentally different from client state** — it's remote, asynchronous, shared, and can become stale without you knowing
- Manually managing fetch + loading + error + cache + refetch + deduplication in `useEffect` is painful and bug-prone
- TanStack Query replaces all of that with a declarative API

## Core Mental Model

### Query = read operation
- `useQuery({ queryKey, queryFn })` — fetch data, cache it, keep it fresh
- **queryKey** identifies the data — same key = same cache entry, deduplicated across components
- **queryFn** is how to fetch — any async function returning data

### Mutation = write operation
- `useMutation({ mutationFn })` — create, update, delete
- Does NOT auto-cache the result (unlike queries)
- After mutating, you invalidate related queries to trigger refetch

### Cache is the central piece
- Every query result is cached by its queryKey
- Multiple components using the same key share the cache — one fetch, many consumers
- Cache has configurable freshness: `staleTime` (how long data is "fresh") and `gcTime` (how long unused data stays in memory)

## Stale-While-Revalidate Strategy

The default behavior:
1. Return cached data immediately (even if stale) — UI is never blank
2. Refetch in background
3. Swap in fresh data when it arrives

This is why TanStack Query apps feel fast — users see data instantly while freshness is maintained behind the scenes.

## When Data Refetches

Automatic refetch triggers (all configurable):
- Component mounts with stale data
- Window regains focus (`refetchOnWindowFocus`)
- Network reconnects (`refetchOnReconnect`)
- Query is invalidated after a mutation

You control aggressiveness via `staleTime`:
- `staleTime: 0` (default) — always refetch in background
- `staleTime: 60_000` — treat data as fresh for 1 minute
- `staleTime: Infinity` — never auto-refetch, only on explicit invalidation

## Query Keys

Keys are the cache identity — get them right and everything works:
- Arrays: `['todos']`, `['todos', { status: 'done' }]`, `['todo', 5]`
- Hierarchical: invalidating `['todos']` invalidates `['todos', { status: 'done' }]` too
- Deterministic: same key = same cache, regardless of which component requests it

## Invalidation = the cache refresh mechanism

After a mutation changes server state:
- `queryClient.invalidateQueries({ queryKey: ['todos'] })` marks matching queries as stale
- Stale queries with active subscribers refetch automatically
- This is how mutations and queries stay in sync

## TanStack Query vs Alternatives

### vs manual useEffect + useState
- TanStack Query: declarative, handles caching/dedup/retry/refetch/pagination automatically
- useEffect: you rebuild all of that per-endpoint, miss edge cases, create loading state spaghetti

### vs SWR
- Both implement stale-while-revalidate
- TanStack Query: richer API (mutations, query invalidation, infinite queries, prefetching, devtools)
- SWR: simpler API surface, lighter — good for straightforward read-heavy apps

### vs [[zustand]] / Redux for server state
- State managers hold state; they don't know when server data becomes stale
- TanStack Query treats staleness as a first-class concept
- Pattern: TanStack Query for server state, Zustand for client-only state (UI, form drafts, local preferences)

## When to Use

- Any app that fetches data from APIs
- Data that multiple components share (user profile, lists, dashboards)
- Optimistic updates (show result before server confirms)
- Paginated or infinite-scroll data

## When to Skip

- No server state — purely client-side app (calculator, drawing tool)
- GraphQL with a full client (Apollo/urql already handle caching)
- Trivial one-off fetch that doesn't need caching or freshness management

```ad-warning
**Don't put server state in Zustand/Redux alongside TanStack Query**: You end up with two sources of truth that drift apart. Let TanStack Query own server state; use client state managers only for UI state.
```

---

## References

- https://tanstack.com/query/latest/docs/framework/react/overview
- https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults

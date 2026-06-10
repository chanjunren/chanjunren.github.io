🗓️ 08062026 1400

# staletime_and_gctime

Two knobs control how [[tanstack_query]] manages cached data. Getting them right is the difference between "why does it keep refetching?" and "why is my data gone?"

## What Each Controls

- **staleTime** — how long data is considered **fresh** after fetching. While fresh, no background refetch happens, even if a new component mounts requesting the same data
- **gcTime** (garbage collection time) — how long **unused** cache entries stay in memory after their last subscriber unmounts. After this window, the entry is deleted entirely

They answer different questions:
- staleTime: "Should I refetch this?"
- gcTime: "Should I keep this in memory?"

## Cache Entry Lifecycle

```
fetch completes
    │
    ▼
┌─────────┐  staleTime expires  ┌─────────┐  last subscriber   ┌──────────┐  gcTime expires  ┌───────────┐
│  FRESH   │ ─────────────────► │  STALE   │  unmounts          │ INACTIVE │ ───────────────► │ DELETED   │
│          │                    │          │ ──────────────────► │          │                  │           │
│ no       │                    │ refetch  │                    │ no       │                  │ gone from │
│ refetch  │                    │ on next  │                    │ observers│                  │ memory    │
│          │                    │ trigger  │                    │          │                  │           │
└─────────┘                    └─────────┘                    └──────────┘                  └───────────┘
```

- **Fresh** — served from cache, no refetch triggered
- **Stale** — still served from cache instantly, but a background refetch fires on the next trigger (mount, window focus, reconnect)
- **Inactive** — no component is reading this data; cache entry lives on borrowed time (gcTime countdown starts)
- **Deleted** — gone; next request starts from scratch with a loading state

## Defaults and Why They Exist

| Option | Default | Rationale |
|--------|---------|-----------|
| `staleTime` | `0` | Data is stale immediately — guarantees freshness at the cost of more network requests |
| `gcTime` | `5 minutes` | Keeps recently viewed data around for quick back-navigation without being a memory leak |

The `staleTime: 0` default surprises people. It means every component mount triggers a background refetch — the UI still shows cached data instantly, but there's always a network request behind it. This is the **stale-while-revalidate** strategy in [[tanstack_query]].

## Common Configurations

### "Refetch freely" (default)
```typescript
staleTime: 0        // always refetch in background
gcTime: 5 * 60_000  // keep unused data 5 min
```
Good for: real-time dashboards, frequently changing data.

### "Cache for a bit"
```typescript
staleTime: 60_000   // fresh for 1 minute
gcTime: 5 * 60_000  // keep unused data 5 min
```
Good for: most CRUD apps. Reduces network chatter without showing stale data for long.

### "Rarely changes"
```typescript
staleTime: Infinity  // never auto-refetch
gcTime: Infinity     // never garbage collect
```
Good for: reference data (country lists, enum mappings, feature flags). Only refreshes on explicit invalidation.

## How They Interact

- `staleTime > gcTime` is pointless — data gets deleted before it would have been refetched
- `gcTime: 0` means data is deleted the instant a component unmounts — navigating back always shows a loading spinner
- `staleTime: Infinity` still respects manual `invalidateQueries()` — the data becomes stale on demand

```ad-warning
**SSR gotcha**: don't set `gcTime` below `2000` (2 seconds) in SSR apps. The server-rendered data needs to survive long enough for the client to hydrate and reference it. See [[tanstack_query_ssr_hydration]] for the full pattern.
```

## Setting Defaults

Configure once in QueryClient, override per-query when needed:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
    },
  },
})
```

Per-query override (see [[tanstack_query_cheatsheet]] for full API):

```typescript
useQuery({
  queryKey: ['countries'],
  queryFn: fetchCountries,
  staleTime: Infinity,  // overrides default
})
```

---

## References

- https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
- https://tanstack.com/query/latest/docs/framework/react/guides/caching

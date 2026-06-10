🗓️ 08062026 1400

# tanstack_query_with_zustand

The standard pattern for React apps with both server and client state: [[tanstack_query]] owns server data (fetching, caching, sync), [[zustand]] owns client-only state (UI toggles, filters, form drafts). They meet at the **query key** — Zustand state feeds into query keys, and TanStack Query fetches accordingly.

## The Boundary

| Belongs in TanStack Query | Belongs in Zustand |
|-----|------|
| API responses (user profile, todo list) | Selected tab, sidebar open/closed |
| Paginated data from server | Current page number, active filters |
| Cached server state | Form draft before submission |
| Loading/error states for fetches | UI preferences (dark mode, layout) |
| Background refetch coordination | Local-only state (drag position, timers) |

Rule of thumb: if it came from the server, TanStack Query owns it. If it only exists in the browser, Zustand owns it.

## How They Connect

Zustand holds filter/pagination state. That state flows into query keys. TanStack Query fetches based on those keys.

```typescript
// Zustand store — owns filter state
import { create } from 'zustand'

interface TodoFilterStore {
  status: string | null
  page: number
  setStatus: (status: string | null) => void
  setPage: (page: number) => void
}

const useTodoFilters = create<TodoFilterStore>((set) => ({
  status: null,
  page: 1,
  setStatus: (status) => set({ status, page: 1 }),
  setPage: (page) => set({ page }),
}))
```

```typescript
// Component — Zustand state feeds TanStack Query keys
function TodoList() {
  const { status, page } = useTodoFilters()

  const { data, isLoading } = useQuery({
    queryKey: ['todos', 'list', { status, page }],
    queryFn: () => fetchTodos({ status, page }),
  })

  // Changing filters in Zustand → new query key → automatic fetch
}
```

### What happens when the user clicks a filter:
1. Click handler calls `setStatus('done')` on Zustand store
2. Component re-renders with new `status` value
3. `queryKey` changes from `['todos', 'list', { status: null, page: 1 }]` to `['todos', 'list', { status: 'done', page: 1 }]`
4. TanStack Query checks cache for the new key — cache hit = instant, cache miss = fetch
5. Previous filter's data stays cached for quick back-navigation

## Anti-Patterns

### Duplicating server data into Zustand

```typescript
// Bad — two sources of truth
const useStore = create((set) => ({
  todos: [],
  fetchTodos: async () => {
    const data = await fetchTodos()
    set({ todos: data })  // now Zustand has a stale copy
  },
}))
```

Problem: Zustand's copy doesn't know when server data changes. No background refetch, no cache invalidation, no stale-while-revalidate. You've rebuilt a worse version of what TanStack Query does automatically.

### Using Zustand for loading/error state of API calls

```typescript
// Bad — TanStack Query already tracks this
const useStore = create((set) => ({
  isLoading: false,
  error: null,
  fetchTodos: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await fetchTodos()
      set({ todos: data, isLoading: false })
    } catch (e) {
      set({ error: e, isLoading: false })
    }
  },
}))
```

`useQuery` already returns `isLoading`, `isError`, `error`. Don't rebuild it.

### Syncing TanStack Query cache back to Zustand

```typescript
// Bad — creates sync loop
const { data } = useQuery({ queryKey: ['user'] })
useEffect(() => {
  if (data) setUser(data)  // why?
}, [data])
```

If you need the data, just call `useQuery` with the same key — you get the same cached data. No need to copy it into Zustand.

```ad-warning
If you catch yourself writing `useEffect` to sync TanStack Query data into Zustand, stop. Multiple components can call `useQuery` with the same key — they all share one cache entry. That IS your global state.
```

## When Zustand Needs Server Data

Sometimes client logic depends on server data (e.g., "show banner if user.plan === 'free'"). Don't copy the data — derive from it:

```typescript
function PlanBanner() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  })
  const showBanner = useBannerStore((s) => s.showBanner)

  if (!showBanner || user?.plan !== 'free') return null
  return <Banner />
}
```

Zustand owns `showBanner` (UI state). TanStack Query owns `user.plan` (server state). Component combines both.

---

## References

- https://tanstack.com/query/latest/docs/framework/react/overview
- https://zustand.docs.pmnd.rs/

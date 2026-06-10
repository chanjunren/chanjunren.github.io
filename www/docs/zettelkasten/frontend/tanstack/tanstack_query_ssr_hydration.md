🗓️ 08062026 1400

# tanstack_query_ssr_hydration

How [[tanstack_query]] bridges server and client rendering. The server fetches data and pre-populates the cache; the client picks up that cache without refetching — no loading spinner on first paint.

## The Problem

Without hydration:
1. Server renders HTML (but has no TanStack Query cache)
2. Client mounts, TanStack Query fires all queries from scratch
3. User sees a flash of loading spinners even though the server already had the data

With hydration:
1. Server fetches data into a QueryClient
2. Server serializes (dehydrates) the cache into the HTML
3. Client receives the dehydrated cache and rehydrates it into its own QueryClient
4. Components mount with data already in cache — no loading state

## Core API

- **`dehydrate(queryClient)`** — serializes all cached queries into a plain object
- **`HydrationBoundary`** — client component that receives dehydrated state and hydrates the local QueryClient

## Next.js App Router Pattern

### Server component — prefetch and dehydrate

```typescript
// app/todos/page.tsx (Server Component)
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

export default async function TodosPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodoList />
    </HydrationBoundary>
  )
}
```

### Client component — uses cache as normal

```typescript
// components/TodoList.tsx
'use client'

function TodoList() {
  const { data } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })
  // data is available immediately — no loading state on first render
}
```

The client `useQuery` finds the data already in cache (put there by `HydrationBoundary`) and renders immediately. After `staleTime` expires, it refetches in the background to stay fresh.

## initialData vs Hydration

Two ways to pre-populate cache. They solve different problems:

| | `initialData` | Hydration (`dehydrate` / `HydrationBoundary`) |
|---|---|---|
| Cache metadata | No timestamps — treated as if fetched "now" | Preserves `dataUpdatedAt` — knows when data was actually fetched |
| Staleness | Respects `staleTime` from the moment component mounts | Respects `staleTime` from when server actually fetched |
| Scope | Per-query, set inline | Per-page or per-layout, covers all prefetched queries |
| Use case | Quick default from another cache entry or props | Full SSR hydration |

### initialData example
```typescript
useQuery({
  queryKey: ['todo', 5],
  queryFn: () => fetchTodo(5),
  initialData: () => {
    // Seed from the list cache if available
    return queryClient
      .getQueryData(['todos'])
      ?.find((t) => t.id === 5)
  },
})
```

For SSR, prefer hydration over `initialData` — it preserves timing metadata so TanStack Query knows how stale the server data actually is.

## gcTime Caveat for SSR

The server QueryClient should keep data alive long enough for the client to hydrate:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 60_000,  // don't set below 2000 for SSR
    },
  },
})
```

See [[staletime_and_gctime]] for how these timers work in detail.

```ad-warning
**Don't share a single QueryClient across requests** on the server. Each request needs its own instance — otherwise one user's data leaks into another user's response.
```

---

## References

- https://tanstack.com/query/latest/docs/framework/react/guides/ssr
- https://tanstack.com/query/latest/docs/framework/react/reference/hydration

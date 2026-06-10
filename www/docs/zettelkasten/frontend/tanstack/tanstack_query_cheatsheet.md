🗓️ 07042026 1400

# tanstack_query_cheatsheet

Quick reference for [[tanstack_query]] API and common patterns.

## Setup

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,      // 1 min before data is considered stale
      gcTime: 5 * 60_000,     // 5 min before unused cache is garbage collected
      retry: 3,               // retry failed queries 3 times
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyApp />
    </QueryClientProvider>
  )
}
```

## useQuery — Fetch Data

```typescript
import { useQuery } from '@tanstack/react-query'

const { data, isLoading, isError, error, refetch } = useQuery({
  queryKey: ['todos', { status }],
  queryFn: () => fetchTodos(status),
  staleTime: 30_000,
  enabled: !!status,          // don't fetch until status is defined
})
```

### Return values

| Field | Description |
|-------|-------------|
| `data` | Resolved data (undefined until first fetch) |
| `isLoading` | First fetch in progress, no cached data |
| `isFetching` | Any fetch in progress (including background refetch) |
| `isError` | Query failed |
| `error` | Error object |
| `isSuccess` | Data available |
| `isPending` | No data yet (replaces `isLoading` in v5) |

## useMutation — Create / Update / Delete

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: (newTodo: Todo) => createTodo(newTodo),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})

// Trigger it
mutation.mutate({ title: 'New todo' })
```

## Cache Invalidation

```typescript
const queryClient = useQueryClient()

// Invalidate all todo queries
queryClient.invalidateQueries({ queryKey: ['todos'] })

// Invalidate exact match only
queryClient.invalidateQueries({ queryKey: ['todos', 1], exact: true })

// Remove from cache entirely
queryClient.removeQueries({ queryKey: ['todos'] })

// Manually set cache data
queryClient.setQueryData(['todo', 1], updatedTodo)
```

## Optimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    const previous = queryClient.getQueryData(['todos'])
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo])
    return { previous }
  },
  onError: (_err, _newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previous)  // rollback
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })  // sync with server
  },
})
```

## Dependent Queries

```typescript
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
})

const { data: projects } = useQuery({
  queryKey: ['projects', user?.id],
  queryFn: () => fetchProjects(user.id),
  enabled: !!user?.id,   // only runs after user is loaded
})
```

## Infinite Queries (Pagination / Infinite Scroll)

```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['todos'],
  queryFn: ({ pageParam }) => fetchTodos(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
})

// All pages flattened
const allTodos = data?.pages.flatMap((page) => page.items)
```

## Prefetching

```typescript
// Prefetch before navigation
const queryClient = useQueryClient()

const onHover = () => {
  queryClient.prefetchQuery({
    queryKey: ['todo', id],
    queryFn: () => fetchTodo(id),
  })
}
```

## Query Options Factory (v5 pattern)

```typescript
// Centralize query definitions
const todoQueries = {
  all: () => ({ queryKey: ['todos'] }),
  lists: () => ({
    ...todoQueries.all(),
    queryKey: [...todoQueries.all().queryKey, 'list'],
  }),
  detail: (id: number) => ({
    queryKey: [...todoQueries.all().queryKey, id],
    queryFn: () => fetchTodo(id),
  }),
}

// Usage
useQuery(todoQueries.detail(5))
queryClient.invalidateQueries(todoQueries.all())
```

## Common Gotchas

| Problem | Fix |
|---------|-----|
| Query refetches on every window focus | Set `staleTime` > 0 or disable `refetchOnWindowFocus` |
| Query doesn't fire | Check `enabled` option — probably `false` |
| Stale data after mutation | Invalidate the related queryKey in `onSuccess` |
| TypeScript: data is possibly undefined | Use `isSuccess` guard or non-null assertion after check |
| Old v3/v4 API doesn't work | v5 removed positional args — use object syntax only |

---

## References

- https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
- https://tanstack.com/query/latest/docs/framework/react/reference/useMutation
- https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates

🗓️ 08062026 1400

# tanstack_query_error_handling

How [[tanstack_query]] handles failures — from automatic retries to error boundaries. The defaults are opinionated: queries retry aggressively, mutations don't retry at all.

## Error States Per Hook

### useQuery
- Failed queries surface via `isError` and `error` in the return value
- The component stays mounted — you render error UI inline
- Default: retries 3 times before surfacing the error

### useMutation
- Failed mutations surface via `isError`, `error`, and the `onError` callback
- Default: no retries (mutations are not idempotent by default)
- `onError` callback still exists on mutations (removed from queries in v5)

```typescript
const mutation = useMutation({
  mutationFn: createTodo,
  onError: (error) => {
    toast.error(error.message)
  },
})
```

## Retry Behavior

### Queries: retry 3 times with exponential backoff

```typescript
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  retry: 3,                    // default — retry 3 times
  retryDelay: (attempt) =>     // default — exponential backoff
    Math.min(1000 * 2 ** attempt, 30_000),
})
```

- First retry: ~1s, second: ~2s, third: ~4s
- User sees loading state during retries — the error only surfaces after all retries fail
- Set `retry: false` to fail immediately (useful in tests — see [[tanstack_query_testing]])

### Mutations: no retry by default

```typescript
useMutation({
  mutationFn: createTodo,
  retry: 0,  // default — fail immediately
})
```

Enable retries on idempotent mutations explicitly:

```typescript
useMutation({
  mutationFn: updateTodoStatus,
  retry: 2,
})
```

## Error Boundaries with throwOnError

By default, errors stay in component state (`isError`). To propagate errors to React **Error Boundaries** instead:

```typescript
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  throwOnError: true,  // throws to nearest ErrorBoundary
})
```

### Conditional throwing

Only throw when there's no cached data to show (avoid blanking out a working UI):

```typescript
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  throwOnError: (error, query) => typeof query.state.data === 'undefined',
})
```

### With Suspense

`useSuspenseQuery` always throws errors to the nearest Error Boundary — there's no `isError` state to check. See [[tanstack_query_suspense]] for the full pattern.

## Error Recovery

### Refetch on user action
```typescript
const { error, refetch } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})

if (error) {
  return <button onClick={() => refetch()}>Retry</button>
}
```

### Reset error state
```typescript
const queryClient = useQueryClient()

// Reset a specific query's error state
queryClient.resetQueries({ queryKey: ['todos'] })
```

## Global Error Handler

Set a default handler in QueryClient for logging or toast notifications:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: false,
      retry: 3,
    },
    mutations: {
      onError: (error) => {
        toast.error(error.message)
      },
    },
  },
})
```

```ad-warning
**v5 breaking change**: `onError` and `onSuccess` callbacks were removed from `useQuery`. Handle query-level side effects with `useEffect` watching `error`/`data` state instead. Mutation callbacks (`onError`, `onSuccess`, `onSettled`) still work.
```

## Network Errors vs API Errors

TanStack Query treats any rejected promise as an error. Your `queryFn` decides what counts as an error:

```typescript
const fetchTodos = async () => {
  const res = await fetch('/api/todos')
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}
```

If `queryFn` doesn't throw on non-2xx responses (e.g., bare `fetch` without the ok check), TanStack Query treats it as success — even for 404s or 500s.

---

## References

- https://tanstack.com/query/latest/docs/framework/react/guides/query-retries
- https://tanstack.com/query/latest/docs/framework/react/reference/useQuery

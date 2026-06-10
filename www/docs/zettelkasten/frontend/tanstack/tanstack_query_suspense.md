🗓️ 08062026 1400

# tanstack_query_suspense

An alternative way to use [[tanstack_query]] that leans on React's **Suspense** and **Error Boundary** patterns. Instead of checking `isLoading` and `isError` in every component, you move loading and error states up to wrapper boundaries — and your data-fetching component always has data.

## The Standard Way vs Suspense

### Standard useQuery
```typescript
function Todos() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  if (isLoading) return <Spinner />
  if (isError) return <ErrorMessage error={error} />
  return <TodoList todos={data} />   // data: Todo[] | undefined
}
```

Every component handles its own loading + error states. `data` is possibly `undefined`.

### Suspense useQuery
```typescript
function Todos() {
  const { data } = useSuspenseQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  return <TodoList todos={data} />   // data: Todo[] — always defined
}
```

No loading/error checks. `data` is guaranteed to be defined at the type level. Loading and error states are handled by **boundaries** higher up.

## How It Works

1. `useSuspenseQuery` **throws a Promise** while loading — React's `<Suspense>` catches it and shows the fallback
2. If the fetch fails, it **throws the error** — React's `<ErrorBoundary>` catches it and shows error UI
3. When data arrives, the component renders with `data` always populated

```typescript
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={<Spinner />}>
        <Todos />
      </Suspense>
    </ErrorBoundary>
  )
}
```

## Available Suspense Hooks

- `useSuspenseQuery` — single query
- `useSuspenseInfiniteQuery` — paginated/infinite scroll
- `useSuspenseQueries` — multiple parallel queries

All follow the same pattern: data is always defined, errors throw to boundary.

## Key Differences from useQuery

| | `useQuery` | `useSuspenseQuery` |
|---|---|---|
| `data` type | `T \| undefined` | `T` (always defined) |
| Loading state | `isLoading` in component | `<Suspense>` boundary |
| Error state | `isError` / `error` in component | `<ErrorBoundary>` |
| `enabled` option | Supported | Not available |
| `placeholderData` | Supported | Not available |

### No enabled option

`useSuspenseQuery` can't be conditionally disabled. If you need dependent queries (wait for one before fetching another), structure your component tree so the dependent component only mounts when data is ready:

```typescript
function UserPosts() {
  const { data: user } = useSuspenseQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  })
  // user is always defined here
  const { data: posts } = useSuspenseQuery({
    queryKey: ['posts', user.id],
    queryFn: () => fetchPosts(user.id),
  })
  return <PostList posts={posts} />
}
```

Both queries suspend. React shows the `<Suspense>` fallback until both resolve.

## When to Use Suspense Queries

**Good fit:**
- New projects using React 18+ with Suspense architecture
- Components where loading/error handling is repetitive boilerplate
- Nested data dependencies (parent fetches → child fetches) — Suspense boundaries simplify the tree

**Less ideal:**
- Need fine-grained control over loading states per query
- Need `enabled` for conditional fetching
- Legacy codebase without ErrorBoundary setup

```ad-warning
**v5 breaking change**: the old `suspense: true` option on `useQuery` was removed. Use the dedicated `useSuspenseQuery` hook instead.
```

---

## References

- https://tanstack.com/query/latest/docs/framework/react/guides/suspense
- https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQuery

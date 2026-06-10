🗓️ 08062026 1400

# query_key_design

**Query keys** are the identity system behind [[tanstack_query]]'s cache. Every cached entry is addressed by its key. Good key design makes invalidation precise; bad key design leads to stale data bugs or over-invalidation that defeats caching.

## Keys Are Arrays

Always arrays, never strings. This is enforced in v5:

```typescript
// Correct
queryKey: ['todos']
queryKey: ['todos', { status: 'done' }]
queryKey: ['todo', 5]

// Wrong — won't compile in v5
queryKey: 'todos'
```

## Key Identity

Two keys are the "same" if they are **deeply equal** (by value, not reference):

- `['todos', { status: 'done', page: 1 }]` equals `['todos', { page: 1, status: 'done' }]` — object key order doesn't matter
- `['todos', 1]` does NOT equal `['todos', '1']` — types matter
- Same key from different components = same cache entry, one shared fetch

## Hierarchical Design

Structure keys from general to specific, like a file path:

```
['todos']                           // all todos
['todos', 'list']                   // todo list
['todos', 'list', { status }]      // filtered todo list
['todos', 'detail', 5]             // single todo
```

This hierarchy matters because **invalidation uses prefix matching**.

## Prefix Matching for Invalidation

`invalidateQueries` matches keys by prefix — any key that starts with the provided array is invalidated:

```typescript
// Invalidates ALL of these:
// ['todos']
// ['todos', 'list']
// ['todos', 'list', { status: 'done' }]
// ['todos', 'detail', 5]
queryClient.invalidateQueries({ queryKey: ['todos'] })

// Invalidates only:
// ['todos', 'detail', 5]
queryClient.invalidateQueries({ queryKey: ['todos', 'detail', 5] })

// Invalidates ONLY the exact key, no prefix matching:
queryClient.invalidateQueries({ queryKey: ['todos'], exact: true })
```

This is why flat keys like `['todoList']` and `['todoDetail']` are problematic — you can't invalidate all todo-related queries in one call.

## The queryOptions Helper

v5 introduced `queryOptions()` to colocate key + fetch function in one reusable object:

```typescript
import { queryOptions } from '@tanstack/react-query'

const todoQueries = {
  all: () => queryOptions({ queryKey: ['todos'] }),

  lists: () => queryOptions({
    queryKey: [...todoQueries.all().queryKey, 'list'],
  }),

  list: (filters: TodoFilters) => queryOptions({
    queryKey: [...todoQueries.lists().queryKey, filters],
    queryFn: () => fetchTodos(filters),
  }),

  detail: (id: number) => queryOptions({
    queryKey: [...todoQueries.all().queryKey, 'detail', id],
    queryFn: () => fetchTodo(id),
  }),
}
```

### Why This Pattern Matters

- **Type-safe**: TypeScript infers data types from queryFn
- **Single source of truth**: key and fetcher live together; change one place, not twenty
- **Composable invalidation**: `todoQueries.all().queryKey` gives you the prefix for invalidating everything

### Usage Everywhere

```typescript
// Fetch
useQuery(todoQueries.detail(5))

// Prefetch
queryClient.prefetchQuery(todoQueries.detail(5))

// Invalidate all todo queries after mutation
queryClient.invalidateQueries(todoQueries.all())

// Invalidate only lists (not details)
queryClient.invalidateQueries(todoQueries.lists())

// Set cache directly
queryClient.setQueryData(todoQueries.detail(5).queryKey, updatedTodo)
```

## Common Key Design Mistakes

### Flat keys that can't be grouped

```typescript
// Bad — no shared prefix
queryKey: ['todoList']
queryKey: ['todoDetail', id]

// Good — shared 'todos' prefix
queryKey: ['todos', 'list']
queryKey: ['todos', 'detail', id]
```

### Missing dynamic values

```typescript
// Bad — cache doesn't distinguish between filters
queryKey: ['todos']  // same cache for status=done and status=pending

// Good — filter values are part of the key
queryKey: ['todos', 'list', { status, page }]
```

### Unstable references in keys

```typescript
// Bad — new object every render = new cache entry every render
queryKey: ['todos', { ...filters }]

// Good — stable reference (from state, useMemo, or primitives)
queryKey: ['todos', { status, page }]
```

```ad-warning
**Keys are serialized deterministically** — object property order doesn't affect identity. But array order does: `['a', 'b']` is NOT the same as `['b', 'a']`.
```

---

## References

- https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
- https://tanstack.com/query/latest/docs/framework/react/guides/query-functions

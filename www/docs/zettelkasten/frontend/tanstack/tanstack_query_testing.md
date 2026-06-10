🗓️ 08062026 1400

# tanstack_query_testing

Quick reference for testing components and hooks that use [[tanstack_query]]. The main gotcha: shared cache between tests causes flaky results.

## Test QueryClient

Create a fresh client per test with retries disabled and cache kept alive:

```typescript
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  })
}
```

### Why these settings
| Setting | Reason |
|---------|--------|
| `retry: false` | Tests fail fast instead of waiting through 3 retries with backoff |
| `gcTime: Infinity` | Cache sticks around for assertions; no surprise cleanup mid-test |

## Test Wrapper

Every test needs a `QueryClientProvider`. Create a reusable wrapper:

```typescript
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

function renderWithQuery(ui: ReactNode, options?: Omit<RenderOptions, 'wrapper'>) {
  const client = createTestQueryClient()

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  )

  return { ...render(ui, { wrapper: Wrapper, ...options }), client }
}
```

## Testing Components

```typescript
import { screen, waitFor } from '@testing-library/react'

test('renders todo list', async () => {
  // MSW or similar intercepts the API call
  renderWithQuery(<TodoList />)

  await waitFor(() => {
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })
})
```

## Testing Custom Hooks

Use `renderHook` from `@testing-library/react`:

```typescript
import { renderHook, waitFor } from '@testing-library/react'

test('useTodos returns data', async () => {
  const client = createTestQueryClient()

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  )

  const { result } = renderHook(() => useTodos(), { wrapper })

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true)
  })

  expect(result.current.data).toHaveLength(3)
})
```

## Mocking API Calls

### MSW (Mock Service Worker) — recommended

Intercepts at the network level; your `queryFn` runs unchanged:

```typescript
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  http.get('/api/todos', () => {
    return HttpResponse.json([
      { id: 1, title: 'Buy milk' },
    ])
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Direct queryFn mock

Simpler but couples tests to implementation:

```typescript
const { result } = renderHook(
  () => useQuery({
    queryKey: ['todos'],
    queryFn: vi.fn().mockResolvedValue([{ id: 1, title: 'Buy milk' }]),
  }),
  { wrapper }
)
```

## Common Test Failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| Test passes alone, fails in suite | Shared QueryClient leaking cache | Fresh `QueryClient` per test |
| Test times out | Retry delays (1s, 2s, 4s backoff) | Set `retry: false` |
| Data is `undefined` after render | Didn't `await waitFor` for async fetch | Wrap assertion in `waitFor` |
| Stale data from previous test | Cache not cleared | New `QueryClient` per test (not `.clear()`) |

---

## References

- https://tanstack.com/query/latest/docs/framework/react/guides/testing
- https://mswjs.io/docs/getting-started

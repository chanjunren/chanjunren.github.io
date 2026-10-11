🗓️ 07042026 1200

# zustand

**What it is:**
- Lightweight state management library for React
- A single `create` call defines a store — plain JavaScript object with state and actions
- Components subscribe to specific slices of state; only re-render when that slice changes

**Why it exists:**
- **Redux** is powerful but heavy — boilerplate (actions, reducers, dispatch) for simple state
- **React Context** re-renders every consumer when any value changes — performance problem at scale
- Zustand gives you global state with minimal API, selective re-renders, and no providers

## How It Works

### Store = state + actions in one object
- No separation between "state" and "reducers" — define both together
- Actions mutate state directly (uses Immer-like shallow merge under the hood)
- Store lives outside React's component tree — accessible anywhere, even outside components

### Subscriptions are selector-based
- `useStore(state => state.count)` — component only re-renders when `count` changes
- Compare to Context where changing `count` re-renders everything consuming the context, even components that only read `name`
- Selectors are the key to Zustand's performance advantage

## Zustand vs Alternatives

### vs Redux
- Zustand: minimal API, no action types, no reducers, no dispatch ceremony
- Redux: ecosystem maturity (DevTools, middleware, RTK Query), time-travel debugging
- Choose Redux when you need middleware-heavy architecture or your team already knows it

### vs React Context
- Context: built-in, no dependency, fine for low-frequency updates (theme, locale, auth)
- Context re-renders all consumers on any state change — unusable for frequently changing state
- Zustand: external store, selective subscriptions, no provider wrapper needed

### vs MobX
- MobX: observable-based, automatic dependency tracking, class-oriented
- Zustand: simpler mental model, functional style, explicit selectors
- MobX has more "magic" (auto-tracking); Zustand is more predictable

### vs Jotai / Valtio
- All three from the same author (Daishi Kato)
- **Jotai**: atom-based (bottom-up), similar to Recoil — good for fine-grained independent state
- **Valtio**: proxy-based, mutable-style API — feels like plain JS objects
- **Zustand**: single store (top-down) — good for colocating related state and actions

## When to Use

- App-wide state shared across many components (cart, user session, UI state)
- Need selective re-renders without memoization gymnastics
- Want minimal boilerplate and fast setup
- State that needs to be accessed outside React (utilities, interceptors)

## When to Skip

- Local component state — `useState` / `useReducer` is simpler
- Server state (fetching, caching, sync) — use React Query / SWR instead
- Trivial global state (theme, locale) — Context is fine and dependency-free

## Key Patterns

### Middleware
- `persist` — sync store to localStorage/sessionStorage automatically
- `devtools` — connect to Redux DevTools for inspection
- `immer` — use mutable syntax for deeply nested state updates
- Middleware composes via function wrapping — no plugin system to learn

### Store slices
- Split large stores into slice functions, combine into one `create` call
- Each slice defines its own state and actions
- Avoids god-store problem as app grows

```ad-warning
**Selector identity matters**: `useStore(state => ({ a: state.a, b: state.b }))` creates a new object every render, causing infinite re-renders. Use `shallow` equality or separate selectors: `useStore(state => state.a)`.
```

---

## References

- https://zustand.docs.pmnd.rs/
- https://github.com/pmndrs/zustand

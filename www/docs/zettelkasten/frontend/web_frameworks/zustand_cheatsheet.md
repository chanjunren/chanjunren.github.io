🗓️ 07042026 1200

# zustand_cheatsheet

Quick reference for [[zustand]] API and common patterns.

## Create a Store

```typescript
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: () => void
  reset: () => void
}

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
  reset: () => set({ bears: 0 }),
}))
```

## Use in Components

```typescript
// Subscribe to a slice (selective re-render)
const bears = useBearStore((state) => state.bears)

// Get an action (actions are stable, no re-render)
const increase = useBearStore((state) => state.increase)

// Multiple values — use shallow to avoid re-render on new object
import { useShallow } from 'zustand/react/shallow'

const { bears, increase } = useBearStore(
  useShallow((state) => ({ bears: state.bears, increase: state.increase }))
)
```

## Use Outside React

```typescript
// Get current state
const bears = useBearStore.getState().bears

// Subscribe to changes
const unsub = useBearStore.subscribe((state) => console.log(state.bears))

// Cleanup
unsub()
```

## Async Actions

```typescript
const useStore = create<StoreState>((set) => ({
  data: null,
  loading: false,
  fetch: async () => {
    set({ loading: true })
    const data = await fetchData()
    set({ data, loading: false })
  },
}))
```

## Middleware

### persist — sync to storage

```typescript
import { persist } from 'zustand/middleware'

const useStore = create<StoreState>()(
  persist(
    (set) => ({ bears: 0 }),
    { name: 'bear-storage' } // localStorage key
  )
)
```

### devtools — Redux DevTools

```typescript
import { devtools } from 'zustand/middleware'

const useStore = create<StoreState>()(
  devtools(
    (set) => ({ bears: 0 }),
    { name: 'BearStore' }
  )
)
```

### immer — mutable-style updates

```typescript
import { immer } from 'zustand/middleware/immer'

const useStore = create<StoreState>()(
  immer((set) => ({
    nested: { deep: { value: 0 } },
    update: () => set((state) => { state.nested.deep.value += 1 }),
  }))
)
```

### Combining middleware

```typescript
const useStore = create<StoreState>()(
  devtools(
    persist(
      immer((set) => ({ /* ... */ })),
      { name: 'storage-key' }
    ),
    { name: 'StoreName' }
  )
)
```

## Store Slices

```typescript
interface BearSlice { bears: number; addBear: () => void }
interface FishSlice { fishes: number; addFish: () => void }

const createBearSlice: StateCreator<BearSlice & FishSlice, [], [], BearSlice> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
})

const createFishSlice: StateCreator<BearSlice & FishSlice, [], [], FishSlice> = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})

const useStore = create<BearSlice & FishSlice>()((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}))
```

## Common Gotchas

| Problem | Fix |
|---------|-----|
| Re-renders on every state change | Use a selector: `useStore(s => s.field)` |
| Object selector causes infinite re-render | Use `useShallow` or separate selectors |
| Stale state in async callback | Use `get()`: `create((set, get) => ...)` |
| Middleware TypeScript errors | Add `()` after `create<Type>()` before middleware |

---

## References

- https://zustand.docs.pmnd.rs/
- https://github.com/pmndrs/zustand

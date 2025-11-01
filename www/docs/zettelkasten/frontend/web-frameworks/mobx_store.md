🗓️ 30032024 1823

# mobx_store

### layout

```typescript
import { computed, observable } from 'mobx';

type StoreMgtStateType = {
	storeField: string;
	filters: unknown;
	loading: boolean;
};

export const storeMgtState = observable<StoreMgtStateType>({
	storeField: "wassup"
	filters: {
		pageIndex: 0;
		pageSize: 20;
	},
	loading: false;
});

function buildStore(storeState: StoreMgtStateType) {
	const storeField = computed(() => storeState.storeField)

  // Something that updates the store's state
  const onSomeAction = action((fieldInput: string) => {
    storeState.storeField = fieldInput;
  });

  // Flows are asynchronous actions
  const flowie = flow(function* () {
    try {
      storeState.loading = true;
      const { data }: Yield<typeof something> = yield fetchEventFlows(
        storeState.filters
      );
      storeState.fetchedFlows = data.items;
    } catch (e) {
      console.error(e);
    } finally {
      storeState.loading = false;
    }
  });
	

	return {
		...
	}
}

const initialisedStore = buildStore(storeMgtState);

export default function useStore() {
  return initialisedStore;
}


```

---

## References
- https://mobx.js.org/README.html
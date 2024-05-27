🗓️ 20240330 1823
📎 #mobx

# mobx_store
### layout
```typescript
import { computed, observable } from 'mobx';

type StoreMgtStateType = {
	storeField: string;
};

export const storeMgtState = observable<StoreMgtStateType>({
	storeField: "wassup"
});

function buildStore(storeState: StoreMgtStateType) {
	const storeField = computed(() => storeState.storeField)

	// Define actions and flows

	return {
		...
	}
}

const initialisedStore = buildStore(userAlertMgtState);

export default function useStore() {
  return initialisedStore;
}


```

--- 
# References

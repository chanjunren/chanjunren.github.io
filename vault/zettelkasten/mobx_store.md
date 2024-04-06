20240330 1823

Tags: #mobx

# mobx_store
### layout
```typescript
import { observable } from 'mobx';

type StoreMgtStateType = {
	storeField: string;
};

export const storeMgtState = observable({
	storeField: "wassup"
});

function buildStore(storeState: StoreMgtStateType) {
	const storeField = computed((storeState) => storeState.storeField)

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

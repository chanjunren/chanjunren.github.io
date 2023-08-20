# Flexbox

CSS Flexbox is a one-dimensional layout model that allows you to design complex layout structures with a more efficient and predictable way than traditional models, especially when it comes to distributing space and aligning items in complex layouts and when the sizes of your items are unknown or dynamic.

## Flex Container Properties
### ```display```
- This defines a flex container; inline or block depending on the given value.
```
display: flex; or display: inline-flex;
```

### ```flex-direction```
- This establishes the main-axis, determining the direction of flex items.
```
flex-direction: row; (default) 
flex-direction: column;
```
### ```flex-wrap```
- By default, flex items will try to fit onto one line 
- This property allows them to wrap onto multiple lines.
 
```
flex-wrap: nowrap; (default)
flex-wrap: wrap;
```

### ```flex-flow```
- A shorthand for flex-direction and flex-wrap.
```
flex-flow: row wrap;
``` 

### ```justify-content```
- This defines the alignment along the main axis.
```
justify-content: center;
justify-content: space-between;
```

### ```align-items```
- Defines the default behavior for how items are laid out along the cross axis.
```
align-items: stretch; (default)
align-items: center;
```

### ```align-content```
- Similar to align-items, but for multiple lines of items.
```
align-content: space-between;
``` 

## Flex Item Properties
### ```order```
- By default, items have an order of 0.
- You can use this to control the order in which they appear in the flex container.
```
order: 1;
``` 

### ```flex-grow```
- Defines the ability for a flex item to grow if necessary.
```
flex-grow: 1;
``` 

### ```flex-shrink```
- Defines the ability for a flex item to shrink if necessary.
```
flex-shrink: 2;
``` 

### ```flex-basis```
- Defines the default size of an element before the remaining space is distributed.
```
flex-basis: 20%;
```

### ```flex```
- A shorthand for flex-grow, flex-shrink, and flex-basis.
```
flex: 1 2 10%;
```

### ```align-self```
- Allows the default alignment (from the flex container's align-items property) to be overridden for individual flex items.
```
align-self: center;
```

## Quick Example:
`.container {
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
}

.item {
flex: 1;
order: 1;
}

.special-item {
flex: 2;
align-self: flex-start;
}
```

This creates a flex container where items are laid out in a row, spaced out evenly, and vertically centered. The items will evenly split the container's space, but the special item will take up twice as much space as the regular items and will align itself to the start of the container.




User
are there any other useful tips in CSS that I should know? I feel like I'm using too many divs even though i alternate between grid and flex, but perhaps I'm not utilising the properties enough

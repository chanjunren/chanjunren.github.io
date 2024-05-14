---
sidebar_position: 1
sidebar_label: Grid
---
# Grid

## Container Properties
### ```display```
- Determines if the container is a grid container.
- Example: display: grid; or display: inline-grid;

### ```grid-template-columns / grid-template-rows``` 
- Defines the columns and rows of the grid with track sizes.
- Example: grid-template-columns: 1fr 2fr 1fr;
 
### ```grid-template-areas```
- Defines a grid template by referencing the names of the grid areas.
- Example:
```
grid-template-areas:
"header header header"
"sidebar main main"
"footer footer footer";
```


### ```grid-gap (or gap)```
- Defines the size of the gap between the rows/columns.
- Example: grid-gap: 10px 15px; or gap: 10px;
 
### ```grid-auto-columns / grid-auto-rows```
- Specifies the size of implicitly created columns/rows.
- Example: grid-auto-columns: 100px;
 
### ```grid-auto-flow```
- Controls how auto-placed items are inserted in the grid.
- Example: grid-auto-flow: row;
 
### Grid Item Properties
- ```grid-column-start / grid-column-end / grid-row-start / grid-row-end```
- Determine where a grid item starts and ends.
- Example: grid-column-start: 1; grid-column-end: 3;
 
### ```grid-column / grid-row```
- Shorthand for grid column/row start and end.
- Example: grid-column: 1 / 3;
 
### ```grid-area```
- Gives an item a name so it can be referenced by grid-template-areas.
- Can also be used as a shorthand for grid-row-start / grid-column-start / grid-row-end / grid-column-end.
- Example:
```
grid-area: header; 
grid-area: 1 / 1 / 2 / 3;
```

### ```justify-self```
- Aligns an item inside a cell along the row axis.
```
justify-self: center;
```
Example: 

### ```align-self```
- Aligns an item inside a cell along the column axis.
```
align-self: end;
```

## Quick Example
```
.container {
display: grid;
grid-template-columns: 2fr 1fr;
grid-template-rows: auto;
grid-gap: 20px;
grid-template-areas:
"header header"
"main sidebar"
"footer footer";
}

.header {
grid-area: header;
}

.main {
grid-area: main;
}

.sidebar {
grid-area: sidebar;
}

.footer {
grid-area: footer;
}
```

This will create a simple layout with a header, main content area, a sidebar, and a footer. The main area is twice as wide as the sidebar, and there's a 20px gap between all grid items.

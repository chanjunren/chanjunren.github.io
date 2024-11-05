🗓️ 05112024 2350
📎

# b_tree 

```ad-abstract
Data structure used to manage **large** amounts of data efficiently

Maintain sorted data and allow for **logarithmic** time complexity for search / insert / delete operations

```

## Structure / Properties
- Each node in a B-Tree can contain 
	- number of keys (`m`)
	- up to `m-1` children 
- For **balance**
	- All nodes maintain a **minimum number** of keys 
	- All **leaf nodes** are at the **same level**
```ad-note
The height of a B-Tree is logarithmic relative to the number of keys, ensuring efficient access
```
## Operations

### Search
1. Start at root
2. Recursively traverses down tree
3. At each node
	- Check if key present OR
	- Determine which child node to explore based on comparisons with the keys in the node
### Insert
1. Find appropriate **leaf node**
2. If node full (max number of keys) 
	1. split into two nodes
	2. Promote a key to parent node
3. Continue up the key if necessary
### Delete
1. Locate key
2. if internal node
	1. Replace with in-order predecessor / successor
> Ensure that nodes maintain minimum key requirement

---

# References
- https://builtin.com/data-science/b-tree-index
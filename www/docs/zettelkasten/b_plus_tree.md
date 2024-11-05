🗓️ 06112024 0011
📎 #database 

# b_plus_tree

> Data structure related to [[b_tree]]

## Structure and Properties
- Leaf nodes 
	- store actual data
	- linked together, facilitating **efficient sequential access and range queries**
- Internal nodes 
	- Contain only keys 
	- Pointers to other nodes
	- Serve as **guides** to navigate through the tree but do not store data themselves

```ad-note
Allows for more keys to be stored in internal nodes, reducing the tree's height
```
## Operations
### Search
1. Search starts from root
2. Always end at root where actual data resides
### Insert
1. Similar approach to [[b_tree]]
2. If a leaf node is full, it splits, promoting a key to the parent node

### Deletion
1. Primarily involves leaf nodes
2. If underpopulated > can borrow / merge with neighboring leaves while maintaining linked access



---

# References

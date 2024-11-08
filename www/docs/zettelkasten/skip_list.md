🗓️ 07112024 1105
📎

# skip_list
**Probabilistic data structure** that facilitates efficient search, insertion, and deletion operations within a sorted sequence of elements

```ad-info
can be thought of as an enhancement of a linked list, where **multiple layers of linked lists** are used to allow for **faster traversal**
```

## Structure of a Skip List

### Bottom Layer
- Standard sorted linked list
- Contains all elements

### Upper Layers
- Each subsequent layer acts as an "express lane," where fewer elements are present
- The probability of an element being included in a higher layer is typically set at p=1/2​ or p=1/4 

```ad-info
on average, each element appears in (1 / (1-p))​ layers > **logarithmic height** relative to the number of elements nn in the list
```


## Operations

### Search
1. Start at the **top-left** node
2. Move right until reaching a node with a value >= target
3. If such a node is found, drop down one level and repeat until reaching the bottom layer
4. If the target value is found, return it; otherwise, indicate that it is not present

> Time complexity: `O(LogN)`

### Insertion
1. Searching for the appropriate position (as per `Search`)
2. Determining level for the new node using coin flip method (random)
3. Updating pointers in all relevant layers to include the new node

> Time complexity: `O(LogN)`

### Deletion
1. Locate the node to be deleted
2. Update pointers from its predecessors to bypass the node being removed across all levels
3. Adjust levels if necessary

> Time complexity: `O(LogN)`

## Advantages and Applications
- Allow concurrent access during insertions / deletions without global rebalancing
- Suitable for parallel computing environments

---

# References
- Perplexity AI
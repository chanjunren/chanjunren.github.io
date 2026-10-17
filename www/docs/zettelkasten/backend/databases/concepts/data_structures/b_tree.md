🗓️ 05112024 2350

# b_tree

A **B-tree** is a height-balanced multiway search tree. Each node holds multiple ordered keys and child pointers, reducing tree height when nodes map to storage pages.

## Structure

- Keys within a node are ordered and divide the key space into child ranges.
- Leaves occur at the same depth, keeping root-to-leaf search paths balanced.
- A node's maximum and minimum occupancy depend on the B-tree variant and its branching factor.

## Operations

- **Search:** compare the key with separators and follow the matching child until finding it or reaching a leaf.
- **Insert:** add the key in order; split overflowing nodes and propagate separators upward.
- **Delete:** remove the key, then redistribute or merge nodes when occupancy rules require it.

Search, insertion, and deletion take logarithmic time in the number of keys when the tree stays balanced. A [[b_plus_tree]] stores records or row references in leaves and links leaves for efficient range scans.

## References

- [Database System Concepts, 7th edition](https://www.db-book.com/)
- [[b_plus_tree]]

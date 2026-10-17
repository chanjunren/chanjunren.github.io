🗓️ 07112024 1105

# skip_list

A **skip list** is a probabilistic ordered structure built from linked-list levels. Higher levels let a search skip across multiple elements before descending to a finer level.

## Structure

- The bottom level contains every key in sorted order.
- Each higher level contains a subset of keys from the level below.
- Randomized level assignment keeps the expected height logarithmic when promotion probabilities are chosen appropriately.

## Operations

Search, insertion, and deletion take expected `O(log n)` time under the randomized model. Worst-case time can be `O(n)` if levels are unusually unbalanced.

Skip lists are used in in-memory ordered maps and some storage engines. The basic structure is not automatically thread-safe; concurrent variants need synchronization or a lock-free algorithm.

## References

- William Pugh, [Skip Lists: A Probabilistic Alternative to Balanced Trees](https://dl.acm.org/doi/10.1145/78973.78977)
- [[b_tree]]

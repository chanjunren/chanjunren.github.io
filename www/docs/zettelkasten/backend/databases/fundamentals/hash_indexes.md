🗓️ 27012025 0105

# hash_indexes

> Hash table stored on disk (or in memory) where a hash function maps a key to a file location

## Strengths
- Fast key-value lookups (O(1))
- Easy to implement.
## Weaknesses
- Not good for **range queries** (e.g., finding all keys between 1 and 100 requires scanning the whole table)
- Can waste space due to hash collisions (though techniques like chaining or open addressing help).
## Example Usage

Used in simple key-value stores where range queries aren't important.


---

## References
- DDIA Chapter 3
- ChatGPT
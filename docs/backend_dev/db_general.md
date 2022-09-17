# General Database Knowledge
## Database Indexing
### Why is it needed?
- Records can only be sorted on one field
	- For records that are not sorted
		- Linear search => (N + 1) / 2 block accesses on average
	- Sorted Records
		- Binary search => log2N block accesses

### What is Indexing?
- Way of sorting number of records on multiple fields
- Creating an index on a field => Creating a *data structure* that holds 
	- Field value 
	- Pointer to the record it relates to
- Index is then sorted => Binary search
- **Downside**
	- Requires additional space

## Other Stuff
- Blocking Factor: Number of records that can be stored on one block
- Used to calculate number of blocks required to store table / index table
- 

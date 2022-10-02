# Index

- Table of field and pointer to corresponding record

## Where is this table stored?
- On the disk

## How much space does indexing take?
1. Calculate the amount of space each entry takes
2. Number of entries per block = block_size / entry_size 
3. Number of blocks needed = number of entries / num_entry_per_block

## Multi-level Indexing
- Building an index for all indexes **IN ONE BLOCK**
- For when there are too many indexes (inefficient to go through all indexes)

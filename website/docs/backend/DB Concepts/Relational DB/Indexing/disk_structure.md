---
sidebar_position: 1
sidebar_label: Disk structure
---

# Disk Structure
` TODO: Add image
- Logical structure: concentric tracks
- Divided into tracks and sectors

> TO_ADD: Image of disk

- Block: Intersection of track & sector
    - (track_num, section_num) used to identify a specific block
    - typically 512 bytes
- read and write always done in terms of blocks
- Offset: number of bytes from the start of block
    - Used to identify certain byte

:::note
- Data has to be brought into main memory to be processed
- Data structure: How data is structured in the main memory
- DBMS: Study of the systems to efficiently store data on the disk
:::

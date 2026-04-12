# inodes

**What it is:**
- An **inode** (index node) is a data structure that stores metadata about a file or directory on a Unix/Linux filesystem
- Every file has exactly one inode, identified by an **inode number** unique within that filesystem
- The inode is where the OS actually tracks a file — filenames are just human-friendly labels that point to inodes

**Why it matters:**
- Understanding inodes is the key to understanding [[file_links]] (hardlinks, symlinks, reflinks)
- Many "file" operations are actually inode operations — renaming a file doesn't move data, it updates a directory entry to point at the same inode

## What an Inode Stores

| Stored in inode              | NOT stored in inode |
|------------------------------|---------------------|
| File size                    | Filename            |
| Owner (UID) and group (GID) | File contents       |
| Permissions (rwx)            | Directory path      |
| Timestamps (created, modified, accessed) |          |
| Number of hardlinks (link count)         |          |
| Pointers to data blocks on disk          |          |

The filename is stored in the **directory entry**, which is just a mapping of `name -> inode number`.

## How File Access Works

When you open `/home/user/notes.txt`:
1. OS looks up inode of `/` (always inode 2)
2. Reads `/` directory data, finds `home` -> inode 1234
3. Reads inode 1234 directory data, finds `user` -> inode 5678
4. Reads inode 5678 directory data, finds `notes.txt` -> inode 9012
5. Reads inode 9012 to get file metadata and data block pointers
6. Reads the actual data blocks

This is why filenames are cheap to change — you only update the directory entry, not the inode or data.

## Link Count

The inode tracks how many directory entries point to it (the **link count**):
- A newly created file has link count 1
- Each hardlink to that file increments the count
- Deleting a filename decrements the count
- The file's data is only freed when link count reaches 0 (and no processes have it open)

This is why "deleting" a file is actually called **unlinking** in Unix — you're removing a directory entry, not necessarily destroying data. See [[file_links]] for how hardlinks exploit this.

## Inode Limits

- Each filesystem has a fixed number of inodes, set at format time
- You can run out of inodes before running out of disk space (many tiny files)
- Check with `df -i`

```ad-warning
**Inodes are per-filesystem**: Inode numbers are only unique within a single filesystem. Two files on different filesystems can have the same inode number — they are completely unrelated. This is the fundamental reason hardlinks cannot cross filesystem boundaries (see [[file_links]]).
```

```ad-example
**Inspect a file's inode**: `ls -i notes.txt` shows the inode number. `stat notes.txt` shows the full inode metadata including link count, permissions, and timestamps.
```

---

## References

- https://man7.org/linux/man-pages/man7/inode.7.html
- https://www.kernel.org/doc/html/latest/filesystems/ext4/inodes.html

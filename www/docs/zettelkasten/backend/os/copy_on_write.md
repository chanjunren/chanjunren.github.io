# copy_on_write

**What it is:**
- An optimization strategy where a copy operation doesn't actually duplicate data immediately
- Instead, the original and "copy" share the same underlying data blocks
- A real copy of a block is only made when one side **writes** (modifies) that block

**Why it matters:**
- Makes [[file_links|reflinks]] instant and free — `cp --reflink` shares data blocks until files diverge
- Underpins how Docker's OverlayFS and Btrfs handle container filesystems
- Explains why `fork()` in Unix is fast — child process shares parent's memory pages until one writes

## How It Works

### Without CoW (traditional copy)
```
cp big_file.dat copy.dat
```
- Reads all data blocks of `big_file.dat`
- Writes them to new blocks for `copy.dat`
- Time: proportional to file size
- Space: doubles immediately

### With CoW (reflink copy)
```
cp --reflink=always big_file.dat copy.dat
```
1. **Create**: new [[inodes|inode]] for `copy.dat`, but data block pointers reference the same blocks as `big_file.dat`
2. **Read**: both files read from the same physical blocks — no difference in behavior
3. **Write**: when either file modifies block N, the filesystem copies **only block N** to a new location, then updates the pointer
4. Result: files share unmodified data, only divergent blocks use extra space

## Where CoW Appears

### Filesystems
- **Btrfs**: CoW is the core design — all writes create new blocks, enabling snapshots and reflinks
- **ZFS**: same CoW architecture, used heavily in storage servers
- **XFS**: supports reflinks (CoW for data sharing) since Linux 4.9
- **APFS** (macOS): supports file-level clones using CoW
- **ext4**: does **not** support CoW — no reflinks

### Container storage
- Docker's **OverlayFS** uses a CoW-like approach: image [[docker_layers|layers]] are read-only, writes go to the writable layer on top
- This is why modifying a file in a running container doesn't alter the image — the modified file is "copied up" to the writable layer
- Not true block-level CoW like Btrfs, but the same principle: defer copying until writes happen

### Process memory
- `fork()` system call uses CoW for memory pages
- Child process gets the same page table as parent
- Pages are shared read-only until either process writes, triggering a copy of just that page
- This is why forking is fast even for processes with large memory footprints

## CoW Trade-offs

**Benefits:**
- Instant copies (constant time, regardless of data size)
- Space-efficient (only divergent data uses extra space)
- Enables cheap snapshots and clones

**Costs:**
- **Write amplification**: modifying a single byte may require copying an entire block (typically 4KB)
- **Fragmentation**: over time, files become scattered across disk as CoW blocks land in new locations
- **Metadata overhead**: filesystem must track shared block references

```ad-warning
**CoW doesn't mean free forever**: The space savings only last as long as files remain similar. If two reflinked files diverge completely (every block modified), you end up using the same space as two independent copies — plus the overhead of CoW metadata.
```

```ad-example
**Btrfs snapshot**: `btrfs subvolume snapshot /data /data-backup` is instant regardless of whether `/data` contains 1MB or 1TB. It simply shares all existing blocks with CoW semantics. Only subsequent changes to either side consume additional space.
```

---

## References

- https://btrfs.readthedocs.io/en/latest/Introduction.html
- https://www.kernel.org/doc/html/latest/filesystems/overlayfs.html
- https://man7.org/linux/man-pages/man2/fork.2.html

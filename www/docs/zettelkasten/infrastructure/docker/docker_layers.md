🗓️ 09042026 1200

# docker_layers

**What it is:**
- Every Dockerfile instruction (RUN, COPY, ADD) snapshots the filesystem changes into a **read-only layer**
- A [[docker_image]] is a stack of these layers, bottom to top
- When you run a [[docker_container]], Docker adds one **writable layer** on top

**Why it matters:**
- Layers are the reason Docker builds can be fast (caching) or slow (cache invalidation)
- Layers are the reason images can be small (shared base layers) or bloated (unnecessary files baked in)
- Understanding layers is the key to writing efficient Dockerfiles

## How Layers Work

### Each instruction = one filesystem diff
- Docker runs the instruction (e.g., `RUN apt-get install nginx`)
- Compares the filesystem before and after
- Stores only the **difference** as a new layer — not a full copy
- That layer is immutable once created

### Union filesystem
- Docker overlays all layers into a single coherent filesystem using a **union mount** (OverlayFS on Linux)
- When reading a file: search from top layer down, first match wins
- When writing (in a running container): changes go to the writable layer on top — image layers are untouched

### Layer reuse
- If two images share the same base (`FROM node:20-alpine`), they share those base layers on disk
- 10 Node.js apps don't store 10 copies of the Node runtime — just one set of shared layers
- This applies to pulls too — Docker only downloads layers you don't already have

## Cache Behavior

When rebuilding an image, Docker checks each instruction:
- **Cache hit**: instruction and all layers below it are unchanged → reuse the cached layer, skip execution
- **Cache miss**: something changed → rebuild this layer **and every layer after it**

This is why layer order matters:

### Change at the bottom → everything above rebuilds
```
COPY . /app           ← changes every time you edit code
RUN npm install       ← rebuilds every time (cache invalidated by COPY above)
```

### Change at the top → only that layer rebuilds
```
COPY package.json /app/
RUN npm install       ← cached until package.json changes
COPY . /app           ← only this rebuilds on code changes
```

Same result, dramatically different build times.

## Layer Size

### Files added in one layer persist even if deleted in a later layer
- Layer 1: `RUN apt-get install build-essential` → adds 200MB
- Layer 2: `RUN apt-get remove build-essential` → marks files as deleted, but Layer 1 still contains them
- The image is still 200MB+ because layers are immutable

### Fix: combine in one layer
```
RUN apt-get install build-essential \
    && make build \
    && apt-get remove build-essential \
    && rm -rf /var/lib/apt/lists/*
```
One layer, only the final state is stored.

This is also why [[docker_multistage_build]] exists — build in one stage (large), copy only the output to a clean stage (small).

## The Writable Container Layer

- When a container starts, Docker adds one writable layer on top of the image's read-only layers
- All file modifications (creates, edits, deletes) go to this layer
- When the container is removed, this layer is deleted — that's why containers are ephemeral
- This is why [[docker_volumes]] exist: to store data outside the container layer

## Inspecting Layers

- `docker history <image>` shows each layer, its instruction, and size
- Useful for finding unexpectedly large layers
- Layers with 0B size are metadata-only instructions (ENV, EXPOSE, CMD)

```ad-warning
**Deleting files in a later layer doesn't reduce image size**: Each layer is immutable. If you install 500MB of build tools in one layer and remove them in the next, the image still carries that 500MB. Always install and clean up in the same RUN instruction.
```

```ad-example
**Shared layers save disk and bandwidth**: If you pull 5 images that all use `node:20-alpine` as base, that base is stored once. Only the unique layers of each image are downloaded separately. This is why standardizing on a common base image across services matters.
```

---

## References

- https://docs.docker.com/build/guide/layers/
- https://docs.docker.com/storage/storagedriver/

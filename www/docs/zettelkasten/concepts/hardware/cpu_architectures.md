🗓️ 01062026 1727

# cpu_architectures

**CPU architecture** defines the instruction set a processor understands. When downloading software, you pick the build that matches your machine's architecture — running the wrong one either fails to run or runs through a slow emulation layer.

## The Two You'll See

| Name | Also called | Used in |
|------|-------------|---------|
| **x86_64** | x64, AMD64 | Intel/AMD desktops and laptops — the vast majority of PCs |
| **ARM64** | aarch64 | Apple Silicon (M1/M2/M3), Raspberry Pi 4+, Snapdragon laptops, phones |

They are not interchangeable. A native ARM64 binary won't run on x86_64 and vice versa without an emulation layer (e.g. Rosetta on macOS, QEMU on Linux).

## How to Check Yours

```bash
uname -m
```

- `x86_64` → pick x64 / AMD64
- `aarch64` → pick ARM64

If you're running **EndeavourOS**, you're on x86_64 — it only ships an x86_64 ISO.

## References

- [EndeavourOS download page](https://endeavouros.com/latest-release/)

🗓️ 31032025 1143

# hyprland_dump

This note traces the NVIDIA graphics path needed to start Hyprland on Wayland.

## Terms

| Term | Definition | Source |
|---|---|---|
| **Direct Rendering Manager (DRM)** | The Linux kernel subsystem that manages graphics devices and display resources. | [Linux kernel DRM](https://docs.kernel.org/gpu/drm-kms.html) |
| **Kernel Mode Setting (KMS)** | A DRM facility that configures display modes in the kernel. | [Linux kernel DRM](https://docs.kernel.org/gpu/drm-kms.html) |
| **initramfs** | A temporary root filesystem loaded into memory during early boot. | [Arch Wiki](https://wiki.archlinux.org/title/Arch_boot_process#initramfs) |



## 🧠 High-Level Goal
You're preparing your system to:

✅ Boot cleanly and initialize the NVIDIA GPU early,
✅ Enable DRM kernel mode setting,
✅ Support Wayland-based compositors like Hyprland,
✅ Avoid flickering, broken rendering, or fallback to X11.

## 🧩 Components Involved
### Linux Kernel
Loads GPU drivers at boot (nvidia, nvidia_drm, etc.)

Provides device interfaces for rendering (/dev/dri/card0)

Needs initramfs to preload modules before userspace starts

### NVIDIA Kernel Modules
nvidia: core driver

nvidia_modeset: for managing display modes

nvidia_uvm: for CUDA and memory stuff

nvidia_drm: integrates with the Direct Rendering Manager (DRM) subsystem

### DRM KMS (Kernel Mode Setting)
Allows the kernel to initialize the display hardware (resolution, refresh, etc.)

Required for modern Wayland compositors

When modeset=1 is enabled, nvidia_drm exposes /dev/dri/card0

🟡 If this is not enabled, Wayland compositors fail to start with NVIDIA!

### initramfs
A pre-boot environment that loads essential kernel modules before the full system starts

You need to regenerate this (update-initramfs) when you:

Add modules

Change KMS options

### modprobe.d
Holds .conf files that pass options to kernel modules (e.g., modeset=1)

When nvidia_drm loads, it reads from this to know whether to enable DRM mode

### Wayland Compositor (Hyprland)
Requires a working DRM interface and GPU backend

Talks directly to /dev/dri/card0 (provided by KMS)

Needs EGL/GBM (or EGLStreams, though GBM is preferred with recent NVIDIA)

### User Space Drivers
Installed via nvidia-utils-*, libnvidia-gl-*, etc.

Provide OpenGL/Vulkan/EGL support

Needed for any graphical application, Wayland or not

## 🔄 Lifecycle of a Boot With DRM + NVIDIA + Hyprland
1. Boot loader (GRUB) starts Linux kernel
2. initramfs loads → preloads nvidia modules (initramfs-tools)
3. Kernel loads nvidia, nvidia_modeset, nvidia_drm
4. nvidia_drm reads modprobe config → enables DRM mode (modeset=1)
5. /dev/dri/card0 becomes available early
6. Login manager or shell session launches Hyprland
7. Hyprland talks to GPU via DRM+GBM+EGL
8. You get a flicker-free, GPU-accelerated Wayland session
✅ Why You’re Doing This

## Problem Without KMS	What You Fix With This Setup
- Wayland won’t start	modeset=1 enables /dev/dri early
- Screen flickers or black screen	DRM initializes GPU and screen cleanly
- Early boot shows no framebuffer	fbdev=1 shows proper tty or boot splash
- Hyprland crashes or uses software rendering	DRM + GBM + NVIDIA userspace provide full acceleration

---

```mermaid
flowchart LR
  A[GRUB starts Linux kernel] --> B[initramfs loads NVIDIA modules]
  B --> C[nvidia_drm reads modeset option]
  C --> D[DRM KMS initializes display]
  D --> E[/dev/dri/card0 appears]
  E --> F[LightDM or session launches Hyprland]
  F --> G[Hyprland uses DRM and GBM]
  G --> H[EGL renders application surfaces]
  H --> I[Display output]
```

## References


- [Hyprland NVIDIA documentation](https://wiki.hyprland.org/Nvidia/)

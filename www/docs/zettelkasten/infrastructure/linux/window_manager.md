🗓️ 01062026 1727

# window_manager

A **window manager** (WM) controls how application windows are placed, sized, focused, and decorated on screen. It sits between the display server (X11/Wayland) and your applications.

Window managers are intentionally minimal — they do one thing. Contrast with a **desktop environment** (GNOME, KDE) which bundles a WM together with a panel, file manager, settings daemon, and notification system.

## Types

| Type | Behaviour | Examples |
|------|-----------|---------|
| **Stacking** | Windows overlap, drag freely | Openbox, Fluxbox |
| **Tiling** | Windows auto-tile, no overlap | i3, bspwm, dwm |
| **Dynamic** | Switch between tiling and floating | i3 (supports both), XMonad |
| **Compositor** | WM + GPU compositing (blur, transparency) | Hyprland, Picom + i3 |

## Tiling vs Floating

Tiling WMs keep every pixel used — no wasted space, keyboard-driven. Floating is more familiar (like Windows/macOS) but mouse-heavy.

Most tiling WMs support floating windows per-app — [[i3]] lets you toggle per-window or force-float by app class.

## References

- [Arch Wiki: Window manager](https://wiki.archlinux.org/title/Window_manager)

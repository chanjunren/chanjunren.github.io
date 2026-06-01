🗓️ 01062026 1727

# display_manager

A **display manager** (DM) is the login screen that runs after boot. It authenticates the user and launches the chosen desktop session (window manager or desktop environment).

Without a DM, you'd boot to a TTY and start your session manually with `startx`.

## How It Works

1. Boot → systemd starts the DM as a service
2. DM presents a greeter (login UI)
3. User authenticates via PAM
4. DM reads available sessions from `/usr/share/xsessions/` (X11) or `/usr/share/wayland-sessions/` (Wayland)
5. DM launches the selected session and hands off

## Common Display Managers

| DM | Typical use case |
|----|-----------------|
| [[lightdm]] | Lightweight, works with any DE/WM |
| GDM | GNOME's default |
| SDDM | KDE's default |
| ly | Minimal TUI login screen |

## Enable / Disable

```bash
sudo systemctl enable lightdm      # start on boot
sudo systemctl disable lightdm     # revert to TTY login
sudo systemctl start lightdm       # start now
```

## References

- [Arch Wiki: Display manager](https://wiki.archlinux.org/title/Display_manager)

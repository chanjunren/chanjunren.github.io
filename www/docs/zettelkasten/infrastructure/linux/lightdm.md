🗓️ 01062026 1727

# lightdm

**LightDM** is a lightweight [[display_manager]] that works with any desktop environment or window manager. The login UI is provided by a separate **greeter** — LightDM handles auth, the greeter handles appearance.

**slick-greeter** is the most common greeter for minimal setups (used by EndeavourOS i3 edition by default).

## Config Files

| File | Purpose |
|------|---------|
| `/etc/lightdm/lightdm.conf` | Core LightDM config (which greeter to use, autologin, etc.) |
| `/etc/lightdm/slick-greeter.conf` | Greeter appearance |

## lightdm.conf

```ini
[Seat:*]
greeter-session=slick-greeter
# autologin (optional):
autologin-user=yourusername
autologin-session=i3
```

## slick-greeter.conf

```ini
[Greeter]
background=/usr/share/backgrounds/login.jpg
theme-name=Adwaita-dark
icon-theme-name=Papirus-Dark
font-name=Inter 11
draw-user-backgrounds=false
```

## Troubleshooting

```bash
# Check LightDM logs if login fails
journalctl -u lightdm -b
```

## References

- [Arch Wiki: LightDM](https://wiki.archlinux.org/title/LightDM)
- [slick-greeter GitHub](https://github.com/linuxmint/slick-greeter)

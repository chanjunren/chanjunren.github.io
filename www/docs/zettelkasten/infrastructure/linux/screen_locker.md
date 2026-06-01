🗓️ 01062026 1727

# screen_locker

A **screen locker** locks an active session — it's distinct from the [[display_manager]] (which handles login before a session starts). The locker runs while you're already logged in.

**i3lock-color** is a popular choice for i3 setups — a fork of i3lock with full color and ring customisation.

## Install

```bash
yay -S i3lock-color
```

## Key Flags

| Flag | What it controls |
|------|-----------------|
| `--color` | Background color (hex, no `#`) |
| `--ring-color` | Idle ring |
| `--keyhl-color` | Ring highlight when typing |
| `--bshl-color` | Ring highlight on backspace |
| `--inside-color` | Inside of ring fill |
| `--line-color` | Line between ring and inside |
| `--verif-color` | Ring color during verification |
| `--wrong-color` | Ring color on wrong password |
| `--ringver-color` | Ring during verify |
| `--ringwrong-color` | Ring on wrong password |
| `--noinput-text ""` | Hide "no input" text |
| `--verif-text ""` | Hide verify text |
| `--wrong-text ""` | Hide wrong password text |
| `--clock` | Show clock |
| `--indicator` | Always show ring (not only on keypress) |
| `--blur 5` | Blur screenshot as background |
| `--radius` | Ring radius in px |
| `--ring-width` | Ring thickness in px |

## Example Command

```bash
i3lock-color \
  --color=1e1e2e \
  --ring-color=89b4faff \
  --keyhl-color=a6e3a1ff \
  --bshl-color=f38ba8ff \
  --inside-color=1e1e2e00 \
  --line-color=1e1e2e00 \
  --verif-color=89b4faff \
  --wrong-color=f38ba8ff \
  --indicator \
  --clock \
  --radius 120 \
  --ring-width 8
```

## Hook Into i3

```
# in ~/.config/i3/config
bindsym $mod+l exec --no-startup-id ~/.config/i3/lock.sh

# auto-lock on lid close via systemd
# /etc/systemd/system/lock-on-suspend.service
```

## References

- [i3lock-color GitHub](https://github.com/Raymo111/i3lock-color)

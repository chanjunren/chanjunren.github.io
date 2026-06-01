🗓️ 01062026 1727

# picom

**picom** is a compositor for X11. It sits between Xorg and the [[window_manager]], handling GPU-accelerated rendering via the GLX backend. Without it you get screen tearing on most hardware; with it you can also add shadows, transparency, and blur.

## Why It's Needed

X11 has no built-in compositing. Without a compositor:
- Screen tearing on scrolling and video
- No per-window transparency or blur
- No window fade animations

## Config

Default location: `~/.config/picom/picom.conf`

### Backend

```
backend = "glx";   # GPU-accelerated — preferred on most machines
# backend = "xrender";  # CPU fallback if GLX causes issues
```

### Opacity

```
inactive-opacity = 0.9;    # unfocused windows
active-opacity = 1.0;      # focused window
frame-opacity = 1.0;       # window decorations
```

### Shadows

```
shadow = true;
shadow-radius = 12;
shadow-offset-x = -12;
shadow-offset-y = -12;
shadow-opacity = 0.5;
shadow-exclude = ["class_g = 'i3-frame'"];
```

### Blur (frosted glass)

```
blur-method = "dual_kawase";
blur-strength = 5;
blur-background = true;
blur-background-exclude = ["window_type = 'dock'"];
```

### Fading

```
fading = true;
fade-in-step = 0.03;
fade-out-step = 0.03;
fade-delta = 5;
```

## Current Setup (this machine)

GLX backend only — all visual effects disabled. Picom is running purely to prevent screen tearing. Blur is commented out but ready to enable.

```
backend = "glx";
inactive-opacity = 1.0;
active-opacity = 1.0;
fading = false;
shadow = false;
```

## i3 Integration

In `~/.config/i3/config`:

```
exec_always --no-startup-id pkill picom; picom --config ~/.config/picom/picom.conf
```

`exec_always` restarts picom on every i3 reload. `pkill picom` first ensures no duplicate instance runs.

## References

- [picom GitHub](https://github.com/yshui/picom)
- [Arch Wiki: picom](https://wiki.archlinux.org/title/Picom)

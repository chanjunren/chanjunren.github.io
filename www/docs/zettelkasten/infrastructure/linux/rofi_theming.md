🗓️ 01062026 1727

# rofi_theming

**rofi** is an application launcher, window switcher, and dmenu replacement. Themes use `.rasi` files — a CSS-like format with a fixed widget tree.

## Widget Tree

```
window
└── mainbox
    ├── inputbar
    │   ├── prompt
    │   ├── entry
    │   └── case-indicator
    ├── listview
    │   └── element
    │       ├── element-icon
    │       └── element-text
    └── message
```

Target any widget by name in your `.rasi` file.

## Theme File Structure

```css
* {
    bg:      #1e1e2e;
    fg:      #cdd6f4;
    accent:  #89b4fa;
    font:    "Inter 11";
}

window {
    background-color: @bg;
    border:           2px;
    border-color:     @accent;
    border-radius:    8px;
    padding:          20px;
    width:            40%;
}

inputbar {
    background-color: @bg;
    text-color:       @fg;
    padding:          8px 12px;
    border-radius:    6px;
}

element selected {
    background-color: @accent;
    text-color:       @bg;
    border-radius:    4px;
}

element-text {
    background-color: transparent;
    text-color:       inherit;
}
```

## Applying a Theme

```bash
# One-off
rofi -show drun -theme ~/.config/rofi/theme.rasi

# Set as default in ~/.config/rofi/config.rasi
configuration {
    theme: "~/.config/rofi/theme.rasi";
}
```

## Useful Flags for Tweaking

```bash
rofi -show drun -theme-str 'window { width: 50%; }'   # override one property inline
rofi -dump-theme                                        # print active theme to stdout
```

## References

- [rofi theming guide](https://github.com/davatorium/rofi/blob/next/doc/rofi-theme.5.markdown)
- [Arch Wiki: rofi](https://wiki.archlinux.org/title/Rofi)

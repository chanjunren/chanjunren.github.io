🗓️ 09082025 1715

# svg_line_command_basics

## `L` — Line To (Absolute)
- Syntax: `L x y`
- Draws a straight line **from the current cursor position** to the given `(x, y)` coordinates.
```
M 10 10 L 50 40
```
## `H` / `h` — Horizontal Line
- **Absolute (`H x`)**: Draws to an absolute `x` coordinate (y stays the same).
- **Relative (`h dx`)**: Draws a horizontal line of length `dx`.
- Relative form is often more intuitive because it’s based on **length**, not absolute position.
## `V` / `v` — Vertical Line
- **Absolute (`V y`)**: Draws to an absolute `y` coordinate (x stays the same).
- **Relative (`v dy`)**: Draws a vertical line of length `dy`.
## `Z` or `z` — Close Path
- Closes the current path by drawing a line from the current point to the **starting point**
- Benefits:
    - Ensures the shape is “closed”.
    - Makes joins smoother compared to manually repeating the starting coordinates.
## Best Practices
- Use **relative commands** (`l`, `h`, `v`) when possible for easier adjustments.
- Always **end closed shapes** with `Z` for smoother joins and cleaner SVG paths.
- Mix commands (`L`, `H`, `V`) to simplify shapes like rectangles, bookmarks, and icons.

---
## References
- ChatGPT
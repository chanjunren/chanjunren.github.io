🗓️ 09082025 1751

# basic_curve_commands

### Why Curves Matter
- Curves make SVG paths powerful—allowing shapes beyond straight lines, like smooth hills, waves, or organic shapes.
- SVG paths use **Bézier curves**, just like in CSS animations.
## Quadratic Bézier Curve — `Q` / `q`
- **Syntax**:
```
Q x1 y1 x y
```
- `(x1, y1)` = single control point
- `(x, y)` = end point
- Smooth curve with **one** control point.
- Use **relative form** `q dx1 dy1 dx dy` for coordinates relative to current position.
- Best for gentle, simple curves.

## Cubic Bézier Curve — `C` / `c`
- **Syntax**:
```
C x1 y1 x2 y2 x y
```
- `(x1, y1)` = first control point
- `(x2, y2)` = second control point
- `(x, y)` = end point
- More flexible and “curvy” than quadratic curves because of **two** control points.
- Can create complex shapes like pill shapes, loops, or flowing designs.
## Quadratic vs. Cubic — When to Use
- **Rule of thumb**:
    - Start with **quadratic (`Q`)** for simpler curves.
    - If it’s not curvy enough or needs more control → **switch to cubic (`C`)**.
- Anything possible with `Q` can be done with `C`, but not vice versa.
## Arcs — `A` / `a`** 
- Draw curves as part of a circle or ellipse.
- Useful for shapes and morphing animations.
- Will be discussed in detail later.

---

✅ **Key Takeaway**:

- **`Q`** = one control point → simpler, gentler curves.
    
- **`C`** = two control points → more flexibility, more “flow”.
    
- Relative forms (`q`, `c`) are often easier for adjusting shapes.
    
- Think of cubic as an **extended version** of quadratic.

---
## References

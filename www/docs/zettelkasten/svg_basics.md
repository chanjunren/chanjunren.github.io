🗓️ 21062025 1644
📎

# svg_basics

## What is SVG?
- SVG (Scalable Vector Graphics) is a markup language for describing 2D vector images.
- Syntax is similar to HTML.
- All SVGs start with a root `<svg>` element.

## SVG Shapes

| element     | description   |
| ----------- | ------------- |
| `<rect>`    | rectangles    |
| `<circle>`  | circles       |
| `<polygon>` | custom shapes |
| `<line>`    | lines         |
| `<text>`    | text          |
- Controlled via attributes like:
    - `x`, `y`, `width`, `height`, `r`, `cx`, `cy`, `points`
    - `fill` and `stroke` for color and borders

## Styling SVGs
- SVG elements can be styled with CSS.
- CSS properties like `fill`, `stroke`, and `stroke-width` are supported.
- Enables animations and transitions.
- Some CSS features don’t work with SVG and vice versa.

## Layout Differences
- SVGs do not have an automatic layout engine like HTML.
- Elements stack on top of each other unless explicitly positioned.
- Use attributes like `x`, `y`, or `transform` to control placement.

## Embedding SVGs
### Inline
- SVG code is written directly into HTML.
- Allows full styling and JavaScript interaction.
- Increases DOM size.
### External
- SVG is referenced as an image using `<img>` or `background-image`.
- Reduces DOM size and allows caching.
- Limited in styling and animation control.
- External SVGs must include `xmlns`

---
# References

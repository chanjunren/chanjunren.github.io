🗓️ 21062025 1651
📎

# svg_viewbox

## What is `viewBox`?
- Defines the **visible region** of the SVG’s internal coordinate system.
- Syntax: `viewBox="<min-x> <min-y> <width> <height>"`
- Think of it like a **camera**: it determines **what part** of the canvas is visible, not the actual size of the SVG.
## How Responsiveness Works
- `viewBox` enables the SVG to **scale independently of pixel size**.
- Changing the SVG's `width` or `height` scales the contents defined within the `viewBox`.
- Internal elements remain consistent relative to the `viewBox` dimensions.
### Example Concept:
- SVG with `viewBox="0 0 100 100"` and `width="300"`:
    - A shape with width `100` will render as `300px` wide.
- Changing width to `500` scales the entire content proportionally.

## Key Concept: `viewBox` ≠ Size
- `viewBox` affects **coordinate system**, not rendered size.
- **Size is controlled** by the `width` and `height` attributes.

## Aspect Ratio Behavior
- The **default aspect ratio** is inferred from the `viewBox`.
- If only `width` or `height` is provided:
    - Browser **preserves the viewBox aspect ratio** to calculate the missing dimension.
### To override:
- Set both `width` and `height` explicitly.

## `preserveAspectRatio` Attribute

|Purpose|Example Value|Behavior|
|---|---|---|
|Anchor viewBox|`xMidYMid`|Centers content in the available space|
|Scale mode: preserve or crop|`meet` / `slice`|`meet`: fit all content; `slice`: fill & crop|

- `preserveAspectRatio` affects **how the viewBox is fitted** into the space defined by `width` and `height`.

## Summary
- `viewBox` sets up a scalable coordinate space.
- `width`/`height` control rendered size.
- SVGs scale their content based on the ratio between `viewBox` and output size.
- `preserveAspectRatio` fine-tunes how content is aligned and scaled.

---
# References

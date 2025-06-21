🗓️ 21062025 1658
📎

# svg_animation

## Separation of Concerns: Structure First, Animation Later
- The hardest part of SVG animation is **structuring your SVG** in a way that makes it easy to animate.
- Actual animation is often just a **single line of CSS** (`transition` + `transform`).

## Use `<g>` Elements for Reusability and Grouping
- Group related elements (e.g. lid or body) using `<g>`.
- Apply shared attributes and transformations at the group level.
- Improves maintainability and reduces duplication.

## Not All SVG Attributes Are CSS-Compatible
- Only **presentation attributes** (e.g. `fill`, `stroke`) and some **geometry properties** (e.g. `x`, `y`) can be used in CSS.
- Attributes like `x1`, `y1`, `y2` **cannot** be animated directly via CSS.

## Use `transform` for Position Changes
- `transform: translateY(...)` is a reliable way to move SVG elements in CSS.
- It works consistently across browsers, unlike geometry properties.
- Transformations apply to entire groups as well.

## CSS Transitions Make Animation Smooth
- Use `transition: transform 0.2s` to animate changes.
- Works when toggling states (e.g., via `:hover`).
- Transitions animate between any two `transform` states automatically.

## ViewBox Units Map to CSS Pixels in Transforms
- `transform: translateY(-2px)` moves an element **2 SVG units**, not device pixels.
- Be aware of the **viewBox scale** when using `px` in CSS transforms.
## Class-Based Styling Enables Interaction
- Add class names (e.g. `.lid`, `.body`) to SVG elements to target them with CSS.
- Use pseudo-classes like `button:hover .lid` to trigger animations on interaction.

---
# References

🗓️ 21062025 1702

# svg_chaining_animations
## Use `aria-pressed` for Toggle State Styling
- Use the `aria-pressed` attribute (set to `"true"` on click) as a **CSS hook** to style the open state.
- Enables **accessible, semantic toggling** with clean CSS targeting.

## Each Bar Should Be Animated Separately
- Treat top, middle, and bottom bars as **independent elements**.
- Each bar has its own transform behavior:
	- Top: rotates and moves
	- Middle: fades out or scales
	- Bottom: rotates and moves (mirrored to top)

## Chaining Transforms: Order Matters
- When combining transforms (e.g., `translate` + `rotate`), **transform order affects the final result**.
- Transforms are applied **relative to the current coordinate system**, so a rotation after translation yields a different effect than vice versa.

## Use Individual Transform Properties When Needed
- Use `transform: rotate(...) translate(...)` carefully when animations need precise movement.
- To avoid issues:
    - Use separate transform properties (e.g., `transform: rotate(...)`, `transform: scale(...)`) if supported by your tooling or framework.
    - Alternatively, nest elements to isolate transforms.

## CSS Handles the Entire Animation
- The interaction is managed in **JavaScript/React**, but the animation itself is **pure CSS**.
- No need for JS-based animation libraries for basic morphing effects.

---
## References

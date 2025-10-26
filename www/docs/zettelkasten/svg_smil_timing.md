🗓️ 22062025 1113

# svg_smil

- By default, all [[svg_smil]] animations interpolate **linearly**, which can feel **unnatural** or robotic.
- This becomes noticeable when animations are slowed down.

### Customize Timing with Bézier Curves

- SMIL allows you to define **custom easing functions** using **Bézier curves**, similar to CSS's `cubic-bezier(...)`.
- Unlike CSS, there are **no preset keywords** like `ease-in-out`—you must explicitly define the curve.

### Attributes Required for Custom Timing

| Attribute           | Purpose                                                    |
| ------------------- | ---------------------------------------------------------- |
| `calcMode="spline"` | Enables spline-based interpolation (non-linear timing)     |
| `keyTimes="0; 1"`   | Defines animation progress points (0 = start, 1 = end)     |
| `keySplines="..."`  | Defines the Bézier curve for each segment of the animation |

**All three** must be present for custom timing to take effect.

### Spline

- In this context, a spline is simply a **Bézier curve** used to shape the speed of the animation.
- Common easing curves (like `ease-in-out`) are represented using control points like `0.42 0 0.58 1`.

### Advanced: Multi-Keyframe Control

- You can animate **multiple keyframes** using `values` and define a **different easing curve for each segment**.

`<animate   attributeName="cy"   values="0; 100; 0"   calcMode="spline"   keyTimes="0; 0.5; 1"   keySplines="0.5 1 0.89 1; 0.11 0 0.5 0" />`

---

## References

- https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/fill

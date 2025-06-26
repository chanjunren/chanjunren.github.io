🗓️ 22062025 1113
📎

# svg_smil

```ad-abstract
- SMIL (Synchronized Multimedia Integration Language) is part of the **SVG specification**, designed for animating SVG elements.
- Still **supported in all major browsers**, despite a now-reversed deprecation attempt by Chrome in 2015.
- Works even when SVGs are **used outside browsers** (e.g., PDFs, native apps).

```

## How SMIL Works
- Add `<animate>` as a **child element** of the shape you want to animate.
- Animate **any SVG attribute**, not just those allowed in CSS (e.g. `points`, `width`, `rx`, etc.).
### Core `<animate>` Attributes

|Attribute|Description|
|---|---|
|`attributeName`|The SVG attribute you want to animate|
|`to`|Final value of the attribute|
|`dur`|Duration of the animation (e.g. `1s`)|
|`fill="freeze"`|Freezes animation at final state (prevents reset)|
### Triggering Animation with `begin`
- The `begin` attribute lets you control **when** the animation starts.
- Syntax: `begin="elementId.eventName"`  
    Example: `begin="charts.mouseenter"` starts animation on hover.
- Makes it easy to **respond to interactions** without needing CSS or JS.

### Freeze Final State with `fill="freeze"`
- Prevents animations from snapping back to their initial state.
- Especially useful for **morphing shapes** or adjusting dimensions.

### Multiple Animations per Element
- You can add multiple `<animate>` elements to a single shape to **layer or chain animations**.
- Enables more complex effects without increasing DOM size or requiring JS orchestration.

##  timing
- By default, all SMIL animations interpolate **linearly**, which can feel **unnatural** or robotic.
- This becomes noticeable when animations are slowed down.
### Customize Timing with Bézier Curves
- SMIL allows you to define **custom easing functions** using **Bézier curves**, similar to CSS's `cubic-bezier(...)`.
- Unlike CSS, there are **no preset keywords** like `ease-in-out`—you must explicitly define the curve.
### Attributes Required for Custom Timing

|Attribute|Purpose|
|---|---|
|`calcMode="spline"`|Enables spline-based interpolation (non-linear timing)|
|`keyTimes="0; 1"`|Defines animation progress points (0 = start, 1 = end)|
|`keySplines="..."`|Defines the Bézier curve for each segment of the animation|

**All three** must be present for custom timing to take effect.

### Spline
- In this context, a spline is simply a **Bézier curve** used to shape the speed of the animation.
- Common easing curves (like `ease-in-out`) are represented using control points like `0.42 0 0.58 1`.
### Advanced: Multi-Keyframe Control
- You can animate **multiple keyframes** using `values` and define a **different easing curve for each segment**.

`<animate   attributeName="cy"   values="0; 100; 0"   calcMode="spline"   keyTimes="0; 0.5; 1"   keySplines="0.5 1 0.89 1; 0.11 0 0.5 0" />`


---
# References
- https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/fill
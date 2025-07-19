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

| Attribute       | Description                                       |
| --------------- | ------------------------------------------------- |
| `attributeName` | The SVG attribute you want to animate             |
| `to`            | Final value of the attribute                      |
| `dur`           | Duration of the animation (e.g. `1s`)             |
| `fill="freeze"` | Freezes animation at final state (prevents reset) |

```svg
<animate
  attributeName="the attribute you want to animate"
  to="the final value of the attribute"
  dur="the duration of the animation"
/>
```

### Triggering Animation with `begin`

- The `begin` attribute lets you control **when** the animation starts.
- Syntax: `begin="elementId.eventName"`  
   Example: `begin="charts.mouseenter"` starts animation on hover.
- Makes it easy to **respond to interactions** without needing CSS or JS.

| **Event Name** | **Trigger Description**                                  | **Use Case**                                 |
| -------------- | -------------------------------------------------------- | -------------------------------------------- |
| `click`        | Fires when the element is clicked                        | Start animation on button or shape click     |
| `mousedown`    | Fires when mouse button is pressed down                  | Highlight or animate on press                |
| `mouseup`      | Fires when mouse button is released                      | Bounce back effect after click               |
| `mouseover`    | Fires when pointer enters element (includes children)    | Hover effects                                |
| `mouseenter`   | Fires when pointer enters element (excludes children)    | Precise hover triggers                       |
| `mouseout`     | Fires when pointer leaves element (includes children)    | Fade out or reset on exit                    |
| `mouseleave`   | Fires when pointer leaves element (excludes children)    | Prevent unintended exits from child elements |
| `focusin`      | Fires when an element receives focus                     | Animate input field or form label            |
| `focusout`     | Fires when an element loses focus                        | Reverse or validate animation                |
| `keydown`      | Fires when a key is pressed while the element is focused | Trigger based on keyboard interaction        |
| `keyup`        | Fires when a key is released                             | Follow-up animations after key press         |
| `load`         | Fires when the element is loaded                         | Autoplay intro animations                    |

### Freeze Final State with `fill="freeze"`

- Prevents animations from snapping back to their initial state.
- Especially useful for **morphing shapes** or adjusting dimensions.

### Multiple Animations per Element

- You can add multiple `<animate>` elements to a single shape to **layer or chain animations**.
- Enables more complex effects without increasing DOM size or requiring JS orchestration.


### Triggering animations manually
1. Setting the `begin` attribute to `indefinite`;
2. Using the `beginElement` method to start the animation.

```ad-note
In React, we can grab the `animate` element using the `useRef` hook and trigger the animation in response to something using the `useEffect` hook
```

---

# References

- https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/fill
- https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/begin#event-value
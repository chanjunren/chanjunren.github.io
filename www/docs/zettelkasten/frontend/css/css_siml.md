🗓️ 23022025 2313

# css_siml

## Basic `<animate>` Structure

The `<animate>` element allows you to animate properties of an SVG element.


```xml
<svg width="200" height="100">
  <circle cx="20" cy="50" r="10" fill="blue">
    <animate attributeName="cx" to="180" dur="1s" fill="freeze" />
  </circle>
</svg>

```


## `<animate>` Attributes

| **Attribute**   | **Description**                                                     |
| --------------- | ------------------------------------------------------------------- |
| `attributeName` | The property being animated (e.g., `cx`, `fill`, `opacity`).        |
| `to`            | The final value of the animation.                                   |
| `from`          | The starting value (optional).                                      |
| `dur`           | Duration of the animation (e.g., `1s`, `500ms`).                    |
| `begin`         | When the animation starts (`click`, `mouseover`, etc.).             |
| `repeatCount`   | How many times the animation repeats (`indefinite` for infinite).   |
| `fill`          | What happens after the animation (`freeze` to hold the last frame). |
| `values`        | Defines multiple steps instead of just `from` → `to`.               |
| `keyTimes`      | Specifies when each step in `values` should occur (0 → 1).          |
| `calcMode`      | Controls interpolation (`linear`, `discrete`, `spline`, `paced`).   |

## Event-Based Animation with `begin`

```xml
<rect x="10" y="10" width="30" height="30" fill="red">
  <animate attributeName="x" to="150" dur="1s" begin="click" />
</rect>

```


## Possible `begin` Mouse Events

| **Mouse Event** | **Description**                                         |
| --------------- | ------------------------------------------------------- |
| `click`         | element is clicked                                      |
| `mousedown`     | when the mouse button is pressed                        |
| `mouseup`       | when the mouse button is released                       |
| `mouseover`     | when mouse enters - bubbles                             |
| `mouseout`      | when mouse leaves - bubbles                             |
| `mouseenter`    | when mouse enters - no bubbles                          |
| `mouseleave`    | when mouse leaves - no bubbles                          |
| `mousemove`     | Starts animation when the mouse moves over the element. |
> bubbles - triggered for the element and all its nested elements
## Chaining animations

```xml
<circle cx="50" cy="50" r="10" fill="blue">
  <animate attributeName="cx" to="150" dur="1s" />
  <animate attributeName="r" to="20" dur="0.5s" begin="mouseover" />
</circle>

```

---

## Advanced: Keyframe Animations

> Use **`values`** for multi-step animations.


```xml
<rect x="10" y="50" width="30" height="30" fill="green">
  <animate
    attributeName="x"
    values="10; 50; 90; 130"
    dur="2s"
    repeatCount="indefinite"
  />
</rect>

```

## Pause & Resume Animation


```xml
<circle cx="50" cy="50" r="10" fill="blue">
  <animate
    id="myAnim"
    attributeName="cx"
    to="150"
    dur="1s"
    begin="start.click"
  />
</circle>
<text x="10" y="90" fill="black" font-size="16" id="start">▶ Start</text>
<text x="60" y="90" fill="black" font-size="16" id="stop">⏸ Stop</text>
<set attributeName="begin" to="indefinite" id="pauseAnim" />
<set attributeName="begin" to="indefinite" id="resumeAnim" />

```


---
## References
- ChatGPT
- [MDN: SVG `<animate>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animate)  
- [W3C SMIL Animation Events](https://www.w3.org/TR/SVG11/animate.html#BeginAttribute)
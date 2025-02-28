🗓️ 12052024 1457
📎 #css

# css_animation

## How Computers Animate

- Computers animate by rapidly displaying **frames** in sequence, just like traditional animation
- However, instead of drawing every frame manually, we provide a few **keyframes**, and the computer fills in the gaps.

### Keyframes & Interpolation

- **Keyframes** are reference points that define the start and end of an animation.
- The computer **interpolates** (generates the in-between frames) based on rules we provide.
- Different **spacing of frames** creates different motion effects:
    - Even spacing → **Constant speed**
    - Frames bunched at the start → **Ease-in (slow start, fast end)**
    - Frames bunched at the end → **Ease-out (fast start, slow end)**

## Timing Functions
> A **timing function** determines **how fast or slow** an animation progresses at each moment in time.

- It takes a **time input** and returns **how complete** the animation should be at that point.
- In real-world applications, timing functions are **written as percentages** instead of absolute values.
- This makes them **flexible** for different animation durations.

### Reading Timing Function Graphs
- The **steeper** the curve at a point, the **faster** the animation is moving.
- A **flat curve** means the animation is moving slowly.
- A **curve that dips downward** can indicate a slight bounce-back effect.


## Bézier Curves

- Instead of using preset timing functions (like `ease-in`, `ease-out`), we can **create our own** using **cubic Bézier curves**.
- The `cubic-bezier(x1, y1, x2, y2)` function defines a curve using two control points.
- By adjusting the **control points**, we can create unique easing effects like bounces or elasticity.

## Animation

```css
.objectToAnimate {
  animation: name duration timing-function delay iteration-count direction
    fill-mode play-state;
}
```

```css
.defaultAnimationProperties {
  animation: none 0s ease 0s 1 normal none running;
}
```

> Default values

### Timing Functions

| Function                  | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `linear`                  | Same speed from start to end                     |
| `ease`                    | Start slow, then fast, then end slow             |
| `ease-in`                 | Start slow, then fast                            |
| `ease-out`                | Start fast, end slow                             |
| `ease-in-out`             | Start slow, fast in the middle, end slow         |
| `cube-bezier(n, n, n, n)` | Define your own values in a cube-bezier function |

### Fill Modes

| Mode        | Description                                            |
| ----------- | ------------------------------------------------------ |
| `none`      | Does not apply style before / after animation          |
| `forwards`  | Retain styles from last keyframe                       |
| `backwards` | Applies styles from first keyframe during delay period |
| `both`      | Follow both forwards and backwards                     |

### Play State

- **running**: Default state; animation runs as normal.
- **paused**: Pauses the animation.

## Keyframes

```css
@keyframes animationName {
  from {
    /* Start state */
  }
  to {
    /* End state */
  }
  /* OR using percentages */
  0% {
    /* Start state */
  }
  50% {
    /* Intermediate state */
  }
  100% {
    /* End state */
  }
}
```

---

# References

- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations

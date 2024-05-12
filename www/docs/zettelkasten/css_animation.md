🗓️ 20240512 1457
📎 #css

# css_animation

## Animation
```css
.objectToAnimate {
	animation: name duration timing-function delay iteration-count direction fill-mode play-state;
}
```

```css
.defaultAnimationProperties {
	animation: none 0s ease 0s 1 normal none running
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
  from { /* Start state */ }
  to { /* End state */ }
  /* OR using percentages */
  0% { /* Start state */ }
  50% { /* Intermediate state */ }
  100% { /* End state */ }
}

```

---

# References
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations

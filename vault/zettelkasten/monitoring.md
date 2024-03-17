20240317 1253

Status: #idea
Tags: #threejs

| FPS meter reading | Implication                                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| High              | Application running smoothly / rendering frames efficiently<br><br>👍 Smooth and responsive experience for users |
| Variable          | FPS fluctuating significantly<br><br>⚠️ Indicating that there are performance issues                             |
| Low               | Application struggling to render frames efficiently                                                              |

## usage
```javascript
import Stats from 'stats.js'

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

const tick = () =>
{
    stats.begin()

    // ...

    stats.end()
}
```

```ad-summary
Better for FPS reading to be consistently high 😃
```

--- 
# {{References}}
- https://github.com/mrdoob/stats.js/
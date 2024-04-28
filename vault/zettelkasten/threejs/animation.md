## Introduction
- animations work like stop motion
- render > move objects > render again
- `frame_rate` - rate at which screen refreshes 
- the native JavaScript way of doing so is by using the `window.requestAnimationFrame(...)` method
- `requestAnimationFrame` will execute the function you provide **on the next frame**
- Recursive function = animation 🤓
- Different screens might have different frame rates

```javascript
/**
 * Animate
 */
const tick = () =>
{
    // Update objects
    mesh.rotation.y += 0.01

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
```



## Adaptation to the framerate

- Need to consider amount of time passed 

```javascript
/**
 * Animate
 */
let time = Date.now()

const tick = () =>
{
		// Time
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime

    // Update objects
    mesh.rotation.y += 0.01 * deltaTime

    // ...
}

tick()
```

## Using Clock 

- There is a built-in solution in Three.js named [Clock](https://threejs.org/docs/#api/en/core/Clock) that handle timing calculations 

```javascript
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    mesh.rotation.y = elapsedTime

    // ...
}

tick()
```

```javascript
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    mesh.position.x = Math.cos(elapsedTime)
    mesh.position.y = Math.sin(elapsedTime)

    // ...
}

tick()
```

```javascript
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    camera.position.x = Math.cos(elapsedTime)
    camera.position.y = Math.sin(elapsedTime)
    camera.lookAt(mesh.position)

    // ...
}

tick()
```

## Using a library

- Sometimes you'll want to animate your scene in a very specific way that will require using another library
- [GSAP](https://greensock.com/gsap/).

```javascript
/**
 * Animate
 */
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })

const tick = () =>
{
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
```

- GSAP has a built-in `requestAnimationFrame`, so you don't need to update the animation by yourself
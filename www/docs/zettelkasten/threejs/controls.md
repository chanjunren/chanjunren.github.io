## Introduction
# Camera
> abstract class that all other cameras inherit from 

## ArrayCamera

- used to render your scene multiple times by using multiple cameras
- Each camera will render a specific area of the canvas

## StereoCamera

- for parallex shit / depth perception
- Only need to consider VR

## CubeCamera

- used to get a render facing each direction (forward, backward, leftward, rightward, upward, and downward) to create a render of the surrounding
- can use it to create an environment map for reflection or a shadow map

## OrthographicCamera

- Used to create orthographic renders of your scene without perspective
- Useful if you make an RTS game like Age of Empire
- Elements will have the same size on the screen regardless of their distance from the camera
- TODO: find picture for this

## PerspectiveCamera

```javascript
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100)
```

![](https://threejs-journey.com/assets/lessons/7/000.png)

You should get the same result but let's talk about those parameters in detail.

## Field of view

- Camera view's vertical amplitude angle in degrees
- Small angle >  long scope effect
- wide-angle > fish eye effect because, in the end, what the camera sees will be stretched or squeezed to fit the canvas.

As for choosing the right field of view, you'll have to try things out. I usually use a field of view between `45` and `75`

## Aspect ratio
- width divided by the height

I recommend saving those values in an object because we are going to need them multiple times:

```javascript
const sizes = {
    width: 800,
    height: 600
}
```

#### Near and far  [](https://threejs-journey.com/lessons/transform-objects#near-and-far)

- **near**: how _close_ the camera can see
- **far**:  how _far_ the camera can see
```
Any object or part of the object closer to the camera than the `near` value or further away from the camera than the `far`value will not show up on the render.

```

Try to use reasonable values and increase those only if you need it. In our case, we can use `0.1` and `100`

## OrthographicCamera
- differs from the [PerspectiveCamera](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera)by its lack of perspective
- objects will have the same size regardless of their distance from the camera.
- must provide how far the camera can see 

![lol](https://threejs-journey.com/assets/lessons/7/002.png)
> cube doesn’t look very correct because of misconfigured values (ratio not really correct, sides not very parallel etc.)

```javascript
const aspectRatio = sizes.width / sizes.height
const camera = new THREE.OrthographicCamera(- 1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100)
```

![](https://threejs-journey.com/assets/lessons/7/003.png)

## Custom controls

```
Goal: Control the camera with our mouse
```

```javascript
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000)

// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(- 1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100)

// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)
```
> Setup

```javascript
// Cursor
window.addEventListener('mousemove', (event) =>
{
    console.log(event.clientX, event.clientY)
})
```
> mouse coordinates 

```javascript
// Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5

    console.log(cursor.x, cursor.y)
})
```
> bruno simon likes normalising these values

```javascript
const tick = () =>
{
    // ...

    // Update camera
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
    camera.position.y = cursor.y * 3
    camera.lookAt(mesh.position)

    // ...
}

tick()
```
> for full rotation of camera (other minor enhancements )
# Built in controls
## OrbitControls
- Not available by default in the THREE variable

```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
```

```javascript
// Controls
const controls = new OrbitControls(camera, canvas)
```
> instantiation

- `target` is a *Vector3* property.

```javascript
controls.target.y = 2
controls.update()
```
> need to call _update()_ after updating
This is not very useful in our case so let's comment this part.

### Damping

```
smooth the animation by adding some kind of acceleration and friction formulas.
```

```javascript
// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// ...

const tick = () =>
{
    // ...

    // Necessary to work properly
    controls.update()

    // ...
}
```
> Usage

```
You can use many other methods and properties to customize your controls such as the rotation speed, zoom speed, zoom limit, angle limit, damping strength, and key bindings (because yes, you can also use your keyboard).
```


## When to use built-in controls
```
Provided controls might not always be suitable for your use case

Check full list of features
```
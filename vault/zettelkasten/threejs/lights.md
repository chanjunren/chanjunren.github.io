
20240428 1004

Tags: 

# lights
## AmbientLight
- applies omnidirectional lighting on all geometries of the scene
### Parameters
- color
- intensity
```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

// Equals
const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0xffffff)
ambientLight.intensity = 1
scene.add(ambientLight)
```

![](https://threejs-journey.com/assets/lessons/14/001.png)


```ad-abstract
Don't really understand yet but jsut pasting this here for future JR

If all you have is an [AmbientLight](https://threejs.org/docs/index.html#api/en/lights/AmbientLight) you'll have the same effect as for a [MeshBasicMaterial](https://threejs.org/docs/index.html#api/en/materials/MeshBasicMaterial) because all faces of the geometries will be lit equally.

In real life, when you light up an object, the sides of the objects at the opposite of the light won't be totally black because light bounces on the walls and other objects. Light bouncing is not supported in Three.js for performance reasons, but you can use a dim [AmbientLight](https://threejs.org/docs/index.html#api/en/lights/AmbientLight) to fake this light bounce.

```

## DirectionalLight

-  will have a sun-like effect as if the sun rays were traveling in parallel
- Parameters:
- color
- intensity
- Light comes from above by default
- Can set `position` to adjust source accordingly 

```javascript
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9)
scene.add(directionalLight)
```

![](https://threejs-journey.com/assets/lessons/14/002.png)

```javascript
directionalLight.position.set(1, 0.25, 0)
```

![](https://threejs-journey.com/assets/lessons/14/003.png)

## HemisphereLight

Faces facing the sky will be lit by one color while another color will lit faces facing the ground
- parameter 
- `color` (sky color)
- `groundColor` 
- `intensity`
- fade (to control how the light fade )

```javascript
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9)
scene.add(hemisphereLight)
```

![](https://threejs-journey.com/assets/lessons/14/004.png)

## PointLight

- almost like a lighter
- light source is infinitely small
- light spreads uniformly in every direction
- Parameters
- `color`
- intensity
- Can be moved like an object 
- fade effects
- Decay
- distance 

```javascript
const pointLight = new THREE.PointLight(0xff9000, 1.5)
scene.add(pointLight)

pointLight.position.set(1, - 0.5, 1)
```

![](https://threejs-journey.com/assets/lessons/14/006.png)

## RectAreaLight 

- works like the big rectangle lights you can see on the photoshoot set
- Mix between a directional light and a diffuse light.
- Parameters
- `Color`
- `intensity`
- `width` 
- `height`
- Only works with [MeshStandardMaterial](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial) and [MeshPhysicalMaterial](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial)
- Can use `lookAt`

```javascript
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1)
scene.add(rectAreaLight)
```

![](https://threejs-journey.com/assets/lessons/14/008.png)


```javascript
rectAreaLight.position.set(- 1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
```

![](https://threejs-journey.com/assets/lessons/14/009.png)

## SpotLight
- works like a flashlight
- It's a cone of light starting at a point and oriented in a direction
- parameters
- `color`
- `intensity`
- `distance`: the distance at which the intensity drops to `0`
- `angle`: how large is the beam
- `penumbra`: how diffused is the contour of the beam
- `decay`: how fast the light dims

```javascript
const spotLight = new THREE.SpotLight(0x78ff00, 4.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)
```

![](https://threejs-journey.com/assets/lessons/14/010.png)

Rotating our [SpotLight](https://threejs.org/docs/index.html#api/en/lights/SpotLight) is a little harder. The instance has a property named `target`, which is an [Object3D](https://threejs.org/docs/index.html#api/en/core/Object3D). The [SpotLight](https://threejs.org/docs/index.html#api/en/lights/SpotLight) is always looking at that `target` object. But if you try to change its position, the [SpotLight](https://threejs.org/docs/index.html#api/en/lights/SpotLight) won't budge:

```javascript
spotLight.target.position.x = - 0.75
```

![](https://threejs-journey.com/assets/lessons/14/011.png)

That is due to our `target` not being in the scene. Simply add the `target` to the scene, and it should work:

```javascript
scene.add(spotLight.target)
```

![](https://threejs-journey.com/assets/lessons/14/012.png)

## Performance

- can cost a lot when it comes to performance
- The GPU will have to do many calculations
- like the distance from the face to the light, how much that face is facing the light, if the face is in the spot light cone, etc
Best practise
- Use less costly / less lights 

Minimal cost:

- AmbientLight
- HemisphereLight

Moderate cost:

- DirectionalLight
- PointLight

High cost:

- SpotLight
- RectAreaLight

## Baking
- The idea is that you bake the light into the texture (using 3D software) 
- :(
- Lights cannot move (because there are none)
- Need more textures

![](https://threejs-journey.com/assets/lessons/14/013.jpg)

## Helpers
```ad-tldr
Used for helping to **position** lights 
```
- [HemisphereLightHelper](https://threejs.org/docs/index.html#api/en/helpers/HemisphereLightHelper)
- [DirectionalLightHelper](https://threejs.org/docs/index.html#api/en/helpers/DirectionalLightHelper)
- [PointLightHelper](https://threejs.org/docs/index.html#api/en/helpers/PointLightHelper)
- [RectAreaLightHelper](https://threejs.org/docs/index.html#examples/en/helpers/RectAreaLightHelper)
- [SpotLightHelper](https://threejs.org/docs/index.html#api/en/helpers/SpotLightHelper)



--- 
# References

20240428 1009

Tags: 

# transformations
## Move objects 

`position` 
- possesses 3 essential properties, which are `x`, `y`, and `z`
- instance of the Vector3 class
### Useful vector methods
> vector length
```javascript
console.log(mesh.position.length())
```

>distance from another [Vector3](https://threejs.org/docs/#api/en/math/Vector3) 

```javascript
console.log(mesh.position.distanceTo(camera.position))
```
> normalise vector
```javascript
console.log(mesh.position.normalize())
```

> set x, y, z

```javascript
mesh.position.set(0.7, - 0.6, 1)
```

## Axes helper

- Display 3 lines corresponding to the `x`, `y` and `z` axes
- each starts at the center of the scene and going in the corresponding direction
- 🟢 `y` axis
- 🔴 `x` axis 
- 🔵`z` axis 

```javascript
/**
 * Axes Helper
 */
const axesHelper = new THREE.AxesHelper(2) // length of line
scene.add(axesHelper)
```

![](https://threejs-journey.com/assets/lessons/5/002.png)

## Scale objects

- `scale` is also a Vector3
- By default, `x`, `y` and `z` are equal to `1`, meaning that the object has no scaling applied. 
```javascript
mesh.scale.x = 2
mesh.scale.y = 0.25
mesh.scale.z = 0.5
```

![](https://threejs-journey.com/assets/lessons/5/003.png)

## Rotate objects

```ad-tldr
- Handle by updating rotation or quaternion 

- Updating one will update another 
```
### Euler
- also contains `x`, `y`, `z`
- When you change the `x`, `y`, and `z` properties of a [Euler](https://threejs.org/docs/index.html#api/en/math/Euler), you can imagine putting a stick through your object's center in the axis's direction and then rotating that object on that stick.

- Expressed in radians


```javascript
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.y = Math.PI * 0.25
```

![](https://threejs-journey.com/assets/lessons/5/004.png)


- changing one axis will affect another 
- rotation applies in the following order: `x`, `y`, and then `z`
- Can result in `gimbal lock` when one axis has no more effect, all because of the previous ones
- changing order of rotation 

```javascript
object.rotation.reorder('YXZ')
```

```ad-important
`quaternion` usually used because of ordering issues
```

### Quaternion 
- Expresss rotation in a mathematical way
- `lookAt(...)` 
	- lets you ask an object to look at something
	- object will automatically rotate its `-z` axis toward the target you provided
	- Can use to rotate camera
	- Parameter is the target and must be a Vector3

```javascript
camera.lookAt(new THREE.Vector3(0, - 1, 0))
```

![](https://threejs-journey.com/assets/lessons/5/005.png)


## Combining transformations
- `position`, `rotation`, `quaternion`, `scale` can be combined in any order to give the same end result
```javascript
mesh.position.x = 0.7
mesh.position.y = - 0.6
mesh.position.z = 1
mesh.scale.x = 2
mesh.scale.y = 0.25
mesh.scale.z = 0.5
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.y = Math.PI * 0.25
```

![](https://threejs-journey.com/assets/lessons/5/006.png)

## Scene graph
- for objects that will be subject to similar actions 
- Inherits from the **Object3D** class, it has access to the previously-mentioned properties and methods 

--- 
# References
- https://threejs.org/docs/#api/en/math/Vector3
- https://threejs.org/docs/index.html#api/en/math/Euler

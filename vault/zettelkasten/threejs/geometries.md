## What is a geometry?

| Term     | Definition                            |
| -------- | ------------------------------------- |
| geometry | composition of vertices               |
| face     | surface formed by joining of vertices |
| mesh     | geometry plus material idk            |
-  All built-in geometries inherit from the [BufferGeometry](https://threejs.org/docs/#api/en/core/BufferGeometry) class

## Box example

### Parameters

- `width`: The size on the `x` axis
- `height`: The size on the `y` axis
- `depth`: The size on the `z` axis
- `widthSegments`: How many subdivisions in the `x` axis
- `heightSegments`: How many subdivisions in the `y` axis
- `depthSegments`: How many subdivisions in the `z` axis

Subdivisions correspond to how much triangles should compose the face
```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
```

```javascript
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
```
> set wireframe to see the subdivisions and vertices

![](https://threejs-journey.com/assets/lessons/9/000.png)

```
Higher subdivisions might lead to performance issues
```

## Creating your own buffer geometry

- Use [BufferGeometry](https://threejs.org/docs/#api/en/core/BufferGeometry) (might need 3D software)

```javascript
// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry()

const positionsArray = new Float32Array(9)

// First vertice
positionsArray[0] = 0
positionsArray[1] = 0
positionsArray[2] = 0

// Second vertice
positionsArray[3] = 0
positionsArray[4] = 1
positionsArray[5] = 0

// Third vertice
positionsArray[6] = 1
positionsArray[7] = 0
positionsArray[8] = 0

// Or pass an array
const positionsArray = new Float32Array([
    0, 0, 0, // First vertex
    0, 1, 0, // Second vertex
    1, 0, 0  // Third vertex
])

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)

geometry.setAttribute('position', positionsAttribute)
```
> Triangle 

```ad-note
3JS's internal shaders look for `position` to position the vertices
```
![](https://threejs-journey.com/assets/lessons/9/003.png)
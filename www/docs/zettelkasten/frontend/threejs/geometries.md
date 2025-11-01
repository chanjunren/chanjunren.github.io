## What is a geometry?

| Term     | Definition                            |
| -------- | ------------------------------------- |
| geometry | composition of vertices               |
| face     | surface formed by joining of vertices |
| mesh     | geometry plus material idk            |

- All built-in geometries inherit from the [BufferGeometry](https://threejs.org/docs/#api/en/core/BufferGeometry) class

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
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
```

```javascript
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
```

> set wireframe to see the subdivisions and vertices

![](https://threejs-journey.com/assets/lessons/9/000.png)

```
Higher subdivisions might lead to performance issues
```

## Creating your own buffer geometry

- Use [BufferGeometry](https://threejs.org/docs/#api/en/core/BufferGeometry) (might need 3D software)

```jsx
export default function CustomObject() {
  const verticesCount = 10 * 3;
  const geometryRef = useRef();

  const positions = useMemo(() => {
    const result = new Float32Array(verticesCount * 3);

    for (let i = 0; i < verticesCount * 3; i++) {
      result[i] = (Math.random() - 0.5) * 3;
    }
    return result;
  }, []);

  useEffect(() => {
    geometryRef.current.computeVertexNormals();
  }, [positions]);

  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          side={THREE.DoubleSide}
          attach={"attributes-position"}
          count={verticesCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <meshStandardMaterial color="red" />
    </mesh>
  );
}
```

> Random triangles

```ad-note
3JS's internal shaders look for `position` to position the vertices
```

![](https://threejs-journey.com/assets/lessons/9/003.png)

17032024 1450

Tags: #threejs #performance

## Lights

- Avoid all together
- Avoid adding / removing
- Use _cheaper_ lights
  - `AmbientLight`
  - `DirectionalLight`

## Shadows

- Avoid all together
- Use alternatives like baked shadows
- Optimize `shadow maps` if still need
  1.  Use `cameraHelper`
  2.  See area used
  3.  Use it to set the smallest resolution possible
- Use `castShadow` / `receiveShadow` on as few objects as possible
- Deactivate shadow auto update

```js
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true;
```

## Textures

- Try to reduce resolution to minimum
- Keep size to power of _2_
- Use right format
  - Can look into [`.basis`](https://github.com/BinomialLLC/basis_universal)

## Geometries

- Use `BufferGeometries`
  - Don't really need to care if using newer versions of ThreeJS
- Don't update vertices > Use shaders
- Don't create unnecessary Geometries (the article uses the term `mutualize`)

## Meshes

- Don't create unnecessary Meshes (the article uses the term `mutualize`)
- Use `cheaper` materials
  - Expensive
    - `MeshStandardMaterial`
    - `MeshPhysicalMaterial`
  - Cheaper
    - `MeshBasicMaterial`
    - `MeshLambertMaterial`
    - `MeshPhongMaterial`

## Models

- Use `low poly` models
  - use normal maps (_cheaper_) if need details
- Draco compression
  - For high poly models
  - Reduces weight
  - Drawback: Partial freeze when unzipping
- `Gzip`
  - Server side compression? not very sure

## Cameras

- _Frustum Culling_: Don't render objects not in view
- Adjust `camera` values
  - `near`
  - `far`

## Renderer

- Limit pixel ratio (2)
- Set powerPreference to `high`
- Disable `antiAlias` unless necessary

## Post Processing

- Limit number of passes

## Shaders

- Don't use `control flow`
- `#define` over variables
- Use `textures` rather than perlin noise functions
- Do calculation in vertex shader and pass the result to fragment shader

---

## References

- https://threejs-journey.com/lessons/performance-tips
- https://github.com/BinomialLLC/basis_universal

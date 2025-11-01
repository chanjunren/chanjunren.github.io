🗓️ 06052024 1654

# r3f_mouse_events

## Basic handler

- `drei` has a `Raycaster` that can be used for muse events

```tsx
export default function Experience() {
  // ...

  const eventHandler = (event) => {
    console.log("---");
    console.log("distance", event.distance); // Distance between camera and hit point
    console.log("point", event.point); // Hit point coordinates (in 3D)
    console.log("uv", event.uv); // UV coordinates on the geometry (in 2D)
    console.log("object", event.object); // The object that triggered the event
    console.log("eventObject", event.eventObject); // The object that was listening to the event (useful where there is objects in objects)

    console.log("---");
    console.log("x", event.x); // 2D screen coordinates of the pointer
    console.log("y", event.y); // 2D screen coordinates of the pointer

    console.log("---");
    console.log("shiftKey", event.shiftKey); // If the SHIFT key was pressed
    console.log("ctrlKey", event.ctrlKey); // If the CTRL key was pressed
    console.log("metaKey", event.metaKey); // If the COMMAND key was pressed
  };

  return (
    <>
      // ...
      <mesh ref={cube} position-x={2} scale={1.5} onClick={eventHandler}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
    </>
  );
}
```

> A mix of native JavaScript event information and R3F-related event information

## Other events

### onContextMenu

Triggered when the context menu should appear - Desktop > right click - Mobile > Pressing down for some time

### onDoubleClick

Triggered when we double click/tap on the same object

```ad-note
The delay between the first and second click/tap is defined by the OS.
```

### onPointerUp

Triggered when a click (left or right) or touch is released

### onPointerDown

Triggered when we’ve just clicked or put our finger down

### onPointerOver and onPointerEnter

Triggered when the cursor or finger just went above the object.

- `onPointerOver` and `onPointerEnter` work exactly the same way.

### onPointerOut and onPointerLeave

Triggered when the cursor or finger just went out from the object
`onPointerOut` and `onPointerLeave` work exactly the same way.

### onPointerMove

Triggered with each frame if the cursor has moved since the last frame, while above the object

### onPointerMissed

will let you know if the user clicks outside of the object

```ad-note
But `onPointerMissed` is a bit special since we can add it on the `<Canvas>` and it will be triggered if we click (when the click is released) but none of the listen objects have registered a hit:
```

```javascript
<Canvas
  camera={{
    fov: 45,
    near: 0.1,
    far: 50,
    position: [-4, 3, 6],
  }}
  onPointerMissed={() => {
    console.log("You missed!");
  }}
>
  <Experience />
</Canvas>
```

## Occluding

```ad-warning
By default, the [Raycaster](https://threejs.org/docs/?q=raycas#api/en/core/Raycaster) doesn’t care about what’s in front of the object being tested

i.e. clicking on the sphere that covers the cube will still trigger the cube's `click` event listener
```

```javascript
<mesh position-x={-2} onClick={(event) => event.stopPropagation()}>
  {/* ... */}
</mesh>
```

> Update the `sphere`'s `onClick` listener to disable the 'click through' effect

## Cursor

Utilise `onPointerEnter` and `onPointerLeave` to handle interactions if a mesh is meant to be clicked on etc.

```tsx
<mesh
  ref={cube}
  position-x={2}
  scale={1.5}
  onClick={eventHandler}
  onPointerEnter={() => {
    document.body.style.cursor = "pointer";
  }}
  onPointerLeave={() => {
    document.body.style.cursor = "default";
  }}
>
  <boxGeometry />
  <meshStandardMaterial color="mediumpurple" />
</mesh>
```

```javascript
<mesh
  position-x={-2}
  onClick={(event) => event.stopPropagation()}
  onPointerEnter={(event) => event.stopPropagation()}
>
  <sphereGeometry />
  <meshStandardMaterial color="orange" />
</mesh>
```

> So that the sphere is occluding the cube even for the cursor change effect

```ad-note
There is also a [drei](https://github.com/pmndrs/drei#usecursor) helper called `useCursor` (not covered because of similar functionality covered so far)
```

## Events on complex objects

```javascript
import { useGLTF, OrbitControls } from "@react-three/drei";
export default function Experience() {
  // ...

  const hamburger = useGLTF("./hamburger.glb");

  // ...
  return (
    <>
      {/* ... */}
      <primitive
        object={hamburger.scene}
        scale={0.25}
        position-y={0.5}
        onClick={(event) => {
          console.log("click");
        }}
      />
    </>
  );
}
```

> 🙃 Will result in multiple `console.log` for each click s because the ray triggers the children of the hamburger as well

```javascript
onClick={(event) => {
    console.log(event.object);
    event.stopPropagation();
  }}
```

> To stop the `propagation`

## Performances

### General optimisation

- Avoid events that need to be tested on each frame if possible:

  - `onPointerOver`
  - `onPointerEnter`
  - `onPointerOut`
  - `onPointerLeave`
  - `onPointerMove`

- Minimise the number of objects that listen to events

- Avoid testing complex geometries

```ad-note
If you notice a freeze, even a short one when interacting, you’ll have some more optimisation to do.
```

### meshBounds

- apply is the [`meshBounds`](https://github.com/pmndrs/drei#meshbounds) helper from `drei`

- Creates a theoretical sphere around the mesh (called bounding sphere)
- Pointer events will be tested on that sphere instead of testing the geometry of the mesh geometry
- Only works on single meshes (won't work on `hamburger`)

```javascript
import { meshBounds, useGLTF, OrbitControls } from "@react-three/drei";

<mesh
  ref={cube}
  raycast={meshBounds}
  position-x={2}
  scale={1.5}
  onClick={eventHandler}
  onPointerEnter={() => {
    document.body.style.cursor = "pointer";
  }}
  onPointerLeave={() => {
    document.body.style.cursor = "default";
  }}
>
  {/* ... */}
</mesh>;
```

> The clickable area seems to be a disc matching the cube roughly

### BVH (Bounding Volume Hierarchy)

For very complex geometries that require pointer events to be accurate and performant

- use `Bvh` helper from [`drei`](https://github.com/pmndrs/drei#usebvh)
- needs to wrap the whole experience

```javascript
import { Bvh } from "@react-three/drei";

root.render(
  <Canvas
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [-4, 3, 6],
    }}
    onPointerMissed={() => {
      console.log("You missed!");
    }}
  >
    <Bvh>
      <Experience />
    </Bvh>
  </Canvas>
);
```

- 🤩 Gives an immediate performance boost when raycasting
- 🤩 Generates a `boundsTree` for use internally, only done one for each mesh but can result in a short freeze

---

## References

- https://threejs-journey.com/lessons/mouse-events-with-r3f

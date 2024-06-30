🗓️ 06012024 1500
📎 #threejs

# environment_and_staging_features

## Changing background color

### CSS

```css
html,
body,
#root {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: red;
}
```

### With setClearColor on the renderer

> It’s a way of filling the with `<canvas>` a color before rendering the various objects in the scene

```jsx
const created = ({ gl }) => {
  gl.setClearColor("#ff0000", 1);
};
<Canvas
  camera={{
    fov: 45,
    near: 0.1,
    far: 200,
    position: [-4, 3, 6],
  }}
  onCreated={created}
>
  <Experience />
</Canvas>;
```

### With the scene background

```js
import * as THREE from "three";

const created = ({ scene }) => {
  scene.background = new THREE.Color("#ff0000");
};
```

### With R3F color

```jsx
import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <Canvas
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [-4, 3, 6],
    }}
  >
    <color args={["ivory"]} />
    <Experience />
  </Canvas>
);
```

> Here, the scene is implied because it’s the only parent.

## Light Helpers

> For helping to position lights

```jsx
import { useHelper, OrbitControls } from "@react-three/drei";

export default function Experience() {
  const directionalLight = useRef();
  useHelper(directionalLight, THREE.DirectionalLightHelper, 1);
}
```

## Shadows

````ad-note
Add the `shadow` attribute to `canvas` to activate shadow rendering on the WebGLRenderer


```jsx
root.render(
  <Canvas
    shadows
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [-4, 3, 6],
    }}
  >
    <Experience />
  </Canvas>
)

````

### Default shadows

```tsx
<>
	<directionalLight ref={ directionalLight } castShadow position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
	<mesh castShadow position-x={ - 2 }>
	{/_ ... _/}
	</mesh>
	<mesh castShadow position-x={ 2 } scale={ 1.5 }>
	{/_ ... _/}
	</mesh>

	<mesh receiveShadow position-y={ - 1 } rotation-x={ - Math.PI _ 0.5 } scale={ 10 }>
	{/_ ... \*/}
	</mesh>
</>

```

### Baking

> This will render the shadows only once and not on each frame

```tsx
import { BakeShadows, useHelper, OrbitControls } from "@react-three/drei";

export default function Experience() {
  return (
    <>
      <directionalLight
        ref={directionalLight}
        position={[1, 2, 3]}
        intensity={4.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={2}
        shadow-camera-right={2}
        shadow-camera-bottom={-2}
        shadow-camera-left={-2}
      />

      <BakeShadows />
      {/* ... */}
    </>
  );
}
```

### Soft shadows

> Percent Closer Soft Shadows (PCSS)

```tsx
export default function Experience() {
  return (
    <>
      <BakeShadows />
      <SoftShadows size={25} samples={10} focus={0} />
    </>
  );
}
```

Now check the shadows and see how gorgeous and soft they look.

```ad-note
Note that this helper will modify Three.js shaders directly and each change applied on its attributes will re-compile all the shaders supporting shadows. This will result in performance issues and a drastic frame rate drop.

Still, you can tweak those attributes and even add them to leva, but only to find the tweaks that suits you best. After that, do not change them.

```

### Accumulative Shadows

- accumulate multiple shadow renders

```ad-warning
remove `receiveShadow` on the mesh to prevent multiple shadows
```

- the idea is to draw the shadow over multiple renders so that the shadow looks nice and soft
- use with `RandomizedLight` helper

```tsx
<AccumulativeShadows
  position={[0, -0.99, 0]}
  scale={10}
  color="#316d39"
  opacity={0.8}
  frames={100}
  //   frames={ Infinity }
  temporal
>
  <RandomizedLight
    amount={8}
    radius={1}
    ambient={0.5}
    intensity={3}
    position={[1, 2, 3]}
    bias={0.001}
  />
</AccumulativeShadows>
```

### Contact Shadows

- does not rely on default shadow system of 3js => can remove `shadow` attribute on `<canvas/>`
- works without light
- it works on a plane
  - limits its usage
  - but looks very good on a floor

```ad-info
ContactShadows will render the whole scene a bit like how the directional light does, but with the camera taking place of the floor instead of the light

It’ll then blur the shadow map to make it look better
```

```ad-warning
LIMITATIONS D:<
- shadows always comes from the front of the plane (positive y in our case)
- not physically accurate
- blurs the shadow regardless of the distance from the objects
- not very performant
- For simple object display, it’s great, but for more complex or realistic rendering, you might better use other shadow solutions.

```

```tsx
import {
  ContactShadows,
  RandomizedLight,
  AccumulativeShadows,
  SoftShadows,
  BakeShadows,
  useHelper,
  OrbitControls,
} from "@react-three/drei";
import { useControls } from "leva";

const { color, opacity, blur } = useControls("contact shadows", {
  color: "#000000",
  opacity: { value: 0.5, min: 0, max: 1 },
  blur: { value: 1, min: 0, max: 10 },
});

export default function Experience() {
  return (
    <>
      {/* ... */}
      <ContactShadows
        position={[0, -0.99, 0]}
        scale={10}
        resolution={512}
        far={5}
        color={color}
        opacity={opacity}
        blur={blur}
      />;{/* ... */}
    </>
  );
}
```

## Sky

- physics-based
- tries to reproduce a realistic sky according to various parameters

```tsx
import {
  Sky,
  ContactShadows,
  RandomizedLight,
  AccumulativeShadows,
  SoftShadows,
  BakeShadows,
  useHelper,
  OrbitControls,
} from "@react-three/drei";

// To make the scene more realistic and logical, we can use the sunPosition for the <directionalLight>
const { sunPosition } = useControls("sky", {
  sunPosition: { value: [1, 2, 3] },
});

export default function Experience() {
  return (
    <>
      <directionalLight
        ref={directionalLight}
        position={sunPosition}
        intensity={4.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
      />
      <Sky sunPosition={sunPosition} />
    </>
  );
}
```

```ad-note
- It’s better to use spherical coordinates and Three.js provides such a thing with the Spherical class
- You can then create a Vector3 and use its setFromSpherical method to convert from the spherical coordinate to a vector 3 (x, y, z) coordinates
- Using spherical coordinates would make tweaking easier since you are playing with two angles (phi and theta)
```

## Environment Map

```ad-note
As a side note, if you are looking for HDRI content, on of the best place is Poly Haven (previously named HDRI Haven).
```

```ad-note
Another note:
Also try to keep the resolution as small as possible since the environment map uses a lot of resources
```

### Presets

- drei created presets that will take the files directly from Poly Haven
- Reference: https://github.com/pmndrs/drei/blob/master/src/helpers/environment-assets.ts

### Tweaking environment

> Let’s say that we would like to have some kind of big red rectangle on one side to ensure there’s red light illuminating our objects from this side.

- Basically, you can add threejs objects inside the `<Environment>`
- **good practice**: create the `<mesh>` outside the `<Environment>` first to make sure it’s well positioned:
- The red rectangle will be added on top of the initial environment map and we can see the impact on the objects.
- Note that, by default, the background of the environment map is black which is why only the red side is being illuminated.
- Can use meshes to light up your scene
- Can use `drei`'s `<LightFormer />` too!

```tsx
<mesh position-z={-5} scale={10}>
  <planeGeometry />
  <meshBasicMaterial color={[2, 0, 0]} />
</mesh>
```

-

```tsx
import {
  Lightformer,
  Environment,
  Sky,
  ContactShadows,
  RandomizedLight,
  AccumulativeShadows,
  SoftShadows,
  BakeShadows,
  useHelper,
  OrbitControls,
} from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";

export default function Experience() {
  const { envMapIntensity } = useControls("environment map", {
    envMapIntensity: { value: 3.5, min: 0, max: 12 },
  });

  const scene = useThree((state) => state.scene);
  useEffect(() => {
    scene.environmentIntensity = envMapIntensity;
  }, [envMapIntensity]);

  return (
    <>
      <Environment
        background // If you want to see the environment map in the background
        // files={[
        //   "./environmentMaps/2/px.jpg",
        //   "./environmentMaps/2/nx.jpg",
        //   "./environmentMaps/2/py.jpg",
        //   "./environmentMaps/2/ny.jpg",
        //   "./environmentMaps/2/pz.jpg",
        //   "./environmentMaps/2/nz.jpg",
        // ]}
        // instead of using 6 images, we can use one image covering the surrounding
        // files="./environmentMaps/the_sky_is_on_fire_2k.hdr"
        preset="sunset"
        resolution={32} // The smaller the resolution, the better for frame rate
      >
        <color args={["blue"]} attach="background" />
        <mesh position-z={-5} scale={10}>
          <planeGeometry />
          <meshBasicMaterial color="red" />
        </mesh>
        <Lightformer
          position-z={-5}
          scale={5}
          color="red"
          intensity={10}
          form="ring"
        />
      </Environment>

      {/* ... */}
    </>
  );
}
```

## Ground

- When using an environment map as a background, we have the feeling that objects are floating because the image is infinitely far.
- By adding a ground attribute, the projection of the environment map will make it look as if the floor underneath the objects is near.
- Add the ground attribute to `<Environment>` with the following parameters instead of the background attribute:
- The settings of the ground are a bit confusing and the best solution is to add some controls in order to find the perfect values.

```tsx
const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } =
  useControls("environment map", {
    envMapIntensity: { value: 7, min: 0, max: 12 },
    envMapHeight: { value: 7, min: 0, max: 100 },
    envMapRadius: { value: 28, min: 10, max: 1000 },
    envMapScale: { value: 100, min: 10, max: 1000 },
  });

return (
  <>
    <Environment
      preset="sunset"
      ground={{
        height: envMapHeight,
        radius: envMapRadius,
        scale: envMapScale,
      }}
    ></Environment>
  </>
);
```

## Stage

- For when a we just want a default good looking setting with minimal configuration.
- A Stage will set:
  - environment map
  - shadows
  - two directional lights
  - also center the scene
- For inspiration, check https://github.com/pmndrs/drei#staging

### Stage Shadows

> the contact shadow is the default one. But now we can pass more properties to the object in order to tweak the shadow:

### Stage Env

```tsx
import {
  Stage,
  Lightformer,
  Environment,
  Sky,
  ContactShadows,
  RandomizedLight,
  AccumulativeShadows,
  SoftShadows,
  BakeShadows,
  useHelper,
  OrbitControls,
} from "@react-three/drei";
export default function Experience() {
  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <Stage
        shadows={{ type: "contact", opacity: 0.2, blur: 3 }}
        environment="sunset"
        preset="portrait" // directional light presets ('rembrandt', 'portrait', 'upfront', 'soft')
        intensity={envMapIntensity} // internally, Stage updates the scene.envMapIntensity like we did earlier (will also update the directional lights in Stage)
      >
        <mesh position-y={1} position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>

        <mesh ref={cube} position-y={1} position-x={2} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </Stage>
    </>
  );
}
```

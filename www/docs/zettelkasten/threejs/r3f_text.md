🗓️ 20240602 1353
📎 #threejs #wip

# r3f_text

## Text3D helper

- Can create typeface fonts with http://gero3.github.io/facetype.js/
- Can use `drei`'s `<Center>` to help with centering

```tsx
import { Center, Text3D, OrbitControls } from "@react-three/drei";

export default function Experience() {
  return (
    <>
      <Perf position="top-left" />
      <OrbitControls makeDefault />
      <Center>
        <Text3D
          font="./fonts/helvetiker_regular.typeface.json"
          size={0.75}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          HELLO R3F
          <meshNormalMaterial />
        </Text3D>
      </Center>
    </>
  );
}
```

## Matcap Material / `useMatcapTexture`

- Automatically load matcaps from https://github.com/emmelleppi/matcaps
- Not recommended for production (since there is a dependency on this repository)
- Reference: https://github.com/nidorx/matcaps/blob/master/PAGE-17.md#7b5254_e9dcc7_b19986_c8ac91
- Try to use the **smallest possible size**
  - possible values: 64, 128, 256, 512, 1024

```tsx
import {
  useMatcapTexture,
  Center,
  Text3D,
  OrbitControls,
} from "@react-three/drei";
export default function Experience() {
  // (matcap material, width)
  const matcapTexture = useMatcapTexture("7B5254_E9DCC7_B19986_C8AC91", 256);

  console.log(matcapTexture);

  // ...
  return (
    <>
      // ...
      <meshMatcapMaterial matcap={matcapTexture} />
    </>
  );
}
```

## Donuts

> As Homer Simpsons said, “Donuts. Is there anything they can't do?”

```tsx
export default function Experience() {
  const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32);
  const material = new THREE.MeshMatcapMaterial();
  return (
    <>
      <Perf position="top-left" />
      <OrbitControls makeDefault />
      <Center>
        <Text3D
          material={material}
          font="./fonts/helvetiker_regular.typeface.json"
          size={0.75}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          HELLO R3F
        </Text3D>
      </Center>

      {[...Array(100)].map((value, index) => (
        <mesh
          ref={(element) => (donuts.current[index] = element)}
          key={index}
          geometry={torusGeometry}
          material={material}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
          scale={0.2 + Math.random() * 0.2}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        />
      ))}
    </>
  );
}
```

### Donut Material

```ad-warning
R3F will change the `colorSpace` of the `matcapTexture` texture used it in the `<meshMatcapMaterial>`
```

```tsx
useEffect(() => {
  matcapTexture.colorSpace = THREE.SRGBColorSpace;
  matcapTexture.needsUpdate = true;

  material.matcap = matcapTexture;
  material.needsUpdate = true;
}, []);
```

### Animating the Donuts

#### Targeting donuts using a `<group>`

```tsx
const donutsGroup = useRef()

<group ref={donutsGroup}>
  {[...Array(100)].map((value, index) => {
    /* ... */
  })}
</group>
```

```tsx
useFrame((state, delta) => {
  for (const donut of donutsGroup.current.children) {
    donut.rotation.y += delta \* 0.2;
  }
});
```

> Bam rotating donuts

#### Targeting donuts using an array of refs

```tsx
const donuts = useRef([]);
// ...
{
  [...Array(100)].map((value, index) => (
    <mesh
      ref={(element) => donuts.current.push(element)}

      // ...
    />
  ));
}
```

```tsx
useFrame((state, delta) => {
  for (const donut of donuts.current) {
    donut.rotation.y += delta * 0.2;
  }
});
```

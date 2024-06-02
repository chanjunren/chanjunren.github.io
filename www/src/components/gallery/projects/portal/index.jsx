import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { WORKSPACE_ASSETS } from "@site/src/utils/constants";

export default function Portal() {
  const model = useGLTF(`${WORKSPACE_ASSETS}/portal/portal.glb`);
  console.log("MODEL", model);
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [1, 2, 6],
      }}
    >
      <>
        <OrbitControls makeDefault />

        <mesh scale={1.5}>
          <boxGeometry />
          <meshNormalMaterial />
        </mesh>
      </>
    </Canvas>
  );
}

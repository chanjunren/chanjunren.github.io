import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { WORKSPACE_ASSETS } from "@site/src/utils/constants";

export default function Portal() {
  const model = useGLTF(`${WORKSPACE_ASSETS}/portal/portal.glb`);
  const { nodes } = model;
  const bakedTexture = useTexture(`${WORKSPACE_ASSETS}/portal/texture.jpg`);
  bakedTexture.flipY = false;
  console.log("MODEL", model);
  // console.log("TEXTURE", bakedTexture);
  return (
    <>
      <OrbitControls makeDefault />
      <color args={["#030202"]} attach="background" />
      <mesh geometry={model.nodes.portal.geometry}>
        <meshBasicMaterial map={bakedTexture} />
      </mesh>

      <mesh
        geometry={nodes.left_light.geometry}
        position={nodes.left_light.position}
      >
        <meshBasicMaterial color="#ffffe5" />
      </mesh>

      <mesh
        geometry={nodes.right_light.geometry}
        position={nodes.right_light.position}
      >
        <meshBasicMaterial color="#ffffe5" />
      </mesh>
    </>
  );
}

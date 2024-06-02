import {
  Center,
  OrbitControls,
  Sparkles,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { WORKSPACE_ASSETS } from "@site/src/utils/constants";
import portalVertexShader from "../../../../glsl/portal/fragment.glsl";

export default function Portal() {
  const model = useGLTF(`${WORKSPACE_ASSETS}/portal/portal.glb`);
  const bakedTexture = useTexture(`${WORKSPACE_ASSETS}/portal/texture.jpg`);
  console.log(portalVertexShader);
  const { portal, left_light, right_light, portal_light } = model.nodes;
  console.log(model.nodes);
  bakedTexture.flipY = false;
  return (
    <>
      <OrbitControls makeDefault />
      <color args={["#030202"]} attach="background" />
      <Center>
        <mesh
          rotation={portal.rotation}
          position={portal.position}
          geometry={portal.geometry}
        >
          <meshBasicMaterial map={bakedTexture} />
        </mesh>
        <mesh geometry={left_light.geometry} position={left_light.position}>
          <meshBasicMaterial color="#ffffe5" />
        </mesh>

        <mesh geometry={right_light.geometry} position={right_light.position}>
          <meshBasicMaterial color="#ffffe5" />
        </mesh>
        <mesh geometry={portal_light.geometry} position={portal_light.position}>
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <Sparkles
          size={6}
          scale={[4, 2, 4]}
          position-y={1}
          speed={0.2}
          count={40}
        />
      </Center>
    </>
  );
}

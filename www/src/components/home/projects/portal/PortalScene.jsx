import {
  Center,
  OrbitControls,
  Sparkles,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { WORKSPACE_ASSETS } from "@site/src/utils/constants";
import PortalLight from "./PortalLight";

const PortalMesh = ({ portal, texture }) => {
  return (
    <mesh
      rotation={portal.rotation}
      position={portal.position}
      geometry={portal.geometry}
    >
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const LightMesh = ({ light }) => {
  return (
    <mesh geometry={light.geometry} position={light.position}>
      <meshBasicMaterial color="#ffffe5" />
    </mesh>
  );
};

export default function PortalScene() {
  const model = useGLTF(`${WORKSPACE_ASSETS}/portal/portal.glb`);
  const bakedTexture = useTexture(`${WORKSPACE_ASSETS}/portal/texture.jpg`);
  const { portal, left_light, right_light, portal_light } = model.nodes;
  bakedTexture.flipY = false;

  return (
    <Canvas
      className="rounded-lg"
      flat
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [3, 1, 7],
      }}
    >
      <OrbitControls makeDefault />
      {/* <color args={["#1f1414"]} attach="background" /> */}
      <Center>
        <PortalMesh portal={portal} texture={bakedTexture} />
        <LightMesh light={left_light} />
        <LightMesh light={right_light} />
        <Sparkles
          size={6}
          scale={[4, 2, 4]}
          position-y={1}
          speed={0.2}
          count={40}
        />
        <PortalLight node={portal_light} />
      </Center>
    </Canvas>
  );
}

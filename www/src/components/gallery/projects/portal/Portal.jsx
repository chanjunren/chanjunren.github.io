import {
  Center,
  OrbitControls,
  Sparkles,
  shaderMaterial,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { WORKSPACE_ASSETS } from "@site/src/utils/constants";
import { useRef } from "react";
import { Color } from "three";
import portalFragmentShader from "../../../../glsl/portal/fragment.glsl";
import portalVertexShader from "../../../../glsl/portal/vertex.glsl";

export default function Portal() {
  const model = useGLTF(`${WORKSPACE_ASSETS}/portal/portal.glb`);
  const bakedTexture = useTexture(`${WORKSPACE_ASSETS}/portal/texture.jpg`);
  console.log(portalVertexShader);
  console.log(portalFragmentShader);
  const { portal, left_light, right_light, portal_light } = model.nodes;
  console.log(model.nodes);
  bakedTexture.flipY = false;

  const PortalMaterial = shaderMaterial(
    {
      uTime: 0,
      uColorStart: new Color(0xffffff),
      uColorEnd: new Color(0xece4e4),
    },
    portalVertexShader,
    portalFragmentShader
  );
  const portalMaterial = useRef();
  useFrame((state, delta) => {
    portalMaterial.current.uTime += delta;
  });

  extend({ PortalMaterial });
  return (
    <>
      <OrbitControls makeDefault />
      <color args={["#1f1414"]} attach="background" />
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
        <mesh
          geometry={portal_light.geometry}
          position={portal_light.position}
          rotation={portal_light.rotation}
        >
          <portalMaterial ref={portalMaterial} />
        </mesh>
      </Center>
    </>
  );
}

import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import portalFragmentShader from "@site/src/glsl/portal/fragment.glsl";
import portalVertexShader from "@site/src/glsl/portal/vertex.glsl";
import { useRef } from "react";
import { Color } from "three";

export default function PortalLight({ node }) {
  const portalMaterial = useRef();
  useFrame((state, delta) => {
    portalMaterial.current.uTime += delta;
  });
  const PortalMaterial = shaderMaterial(
    {
      uTime: 0,
      uColorStart: new Color(0xffffff),
      uColorEnd: new Color(0xece4e4),
    },
    portalVertexShader,
    portalFragmentShader
  );

  extend({ PortalMaterial });

  return (
    <mesh
      geometry={node.geometry}
      position={node.position}
      rotation={node.rotation}
    >
      <portalMaterial ref={portalMaterial} />
    </mesh>
  );
}

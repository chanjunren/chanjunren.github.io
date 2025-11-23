import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

export default function useRotatingGeometry() {
  const geometryRef = useRef<Mesh>(null!);
  useFrame(() => {
    // Rotate the box on every frame
    geometryRef.current.rotation.y -= 0.002;
    // geometryRef.current.rotation.z += 0.002;
  });

  return {
    geometryRef,
  };
}

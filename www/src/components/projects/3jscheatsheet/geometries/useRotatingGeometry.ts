import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

export default function useRotatingGeometry() {
  const geometryRef = useRef<Mesh>(null!);
  useFrame(() => {
    // Rotate the box on every frame
    geometryRef.current.rotation.x += 0.01;
    geometryRef.current.rotation.y += 0.01;
  });

  return {
    geometryRef,
  };
}

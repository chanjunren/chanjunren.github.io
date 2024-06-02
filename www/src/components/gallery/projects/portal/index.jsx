import { Canvas } from "@react-three/fiber";
import Portal from "./Portal";

export default function PortalWrapper() {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [1, 2, 6],
      }}
    >
      <Portal />
    </Canvas>
  );
}

import { Canvas } from "@react-three/fiber";
import PortalScene from "./PortalScene";

export default function Portal() {
  return (
    <div className="h-[32rem]">
      <Canvas
        flat
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [3, 1, 7],
        }}
      >
        <PortalScene />
      </Canvas>
    </div>
  );
}

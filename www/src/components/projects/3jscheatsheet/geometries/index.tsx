import { Canvas } from "@react-three/fiber";
import RotatingGeometry from "./RotatingGeometry";

const Geometries = () => {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 2], fov: 100, near: 1, far: 5 }}
    >
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <RotatingGeometry position={[0, 0, 0]} type={"box"} />
    </Canvas>
  );
};

export default Geometries;

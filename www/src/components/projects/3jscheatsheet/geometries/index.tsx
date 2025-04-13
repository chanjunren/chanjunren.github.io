import { Canvas } from "@react-three/fiber";
import RotatingGeometry from "./RotatingGeometry";

const Geometries = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 2000 }}>
      {/* <GridHelper args={[10, 10]} />
      <AxesHelper args={[5]} /> */}
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={10} />
      <RotatingGeometry position={[-1.1, 1, 0]} type={"box"} />
      <RotatingGeometry position={[0, 1, 0]} type={"sphere"} />
      <RotatingGeometry position={[1.1, 1, 0]} type={"cone"} />
      <RotatingGeometry position={[-1.1, -0.2, 0]} type={"plane"} />
      <RotatingGeometry position={[0, -0.2, 0]} type={"cylinder"} />
      <RotatingGeometry position={[1.1, -0.2, 0]} type={"torus"} />
      <RotatingGeometry position={[0, -1.4, 0]} type={"torusKnot"} />
    </Canvas>
  );
};

export default Geometries;

import { Box, Cone, Sphere } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Vector3 } from "three";

const Geometries = () => {
  const material = <meshStandardMaterial wireframe color="#575279" />;

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 80, near: 0.1, far: 1000 }}>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Box args={[2, 2, 2]} position={new Vector3(-10, 0, 0)}>
        {material}
      </Box>
      <Cone args={[2, 3, 8]} position={new Vector3(0, 0, 0)}>
        {material}
      </Cone>
      <Sphere args={[1]} position={new Vector3(10, 0, 0)}>
        {material}
      </Sphere>
    </Canvas>
  );
};

export default Geometries;

import { MeshProps } from "@react-three/fiber";
import useRotatingGeometry from "./useRotatingGeometry";

// ForwardRefComponent<ShapeProps<typeof THREE.BoxGeometry>, THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>;

const geometryMap = {
  box: <boxGeometry />,
  sphere: <sphereGeometry />,
  cone: <coneGeometry />,
  cylinder: <cylinderGeometry />,
  torus: <torusGeometry />,
  plane: <planeGeometry />,
};
type GeometryType = keyof typeof geometryMap;
interface IRotatingGeometry extends MeshProps {
  type: GeometryType;
}

export default function RotatingGeometry(props) {
  const { type, position } = props;
  const { geometryRef } = useRotatingGeometry();
  const material = <meshStandardMaterial wireframe color="#575279" />;
  return (
    <mesh {...props} ref={geometryRef}>
      {geometryMap[type]}
      {material}
    </mesh>
  );
}

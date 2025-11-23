import { Text } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import useRotatingGeometry from "../hooks/useRotatingGeometry";

const BOX_SIDE = 0.4;
const geometryMap = {
  box: <boxGeometry args={[BOX_SIDE, BOX_SIDE, BOX_SIDE]} />,
  sphere: <sphereGeometry args={[0.3, 16, 8]} />,
  cone: <coneGeometry args={[0.3, 0.5, 10]} />,
  cylinder: <cylinderGeometry args={[0.3, 0.3, 0.5, 10]} />,
  plane: <planeGeometry args={[0.6, 0.6]} />,
  torus: <torusGeometry args={[0.18, 0.18, 10, 10]} />,
  torusKnot: <torusKnotGeometry args={[0.15, 0.15]} />,
};
type GeometryType = keyof typeof geometryMap;

interface IRotatingGeometry extends MeshProps {
  type: GeometryType;
}

export default function RotatingGeometry({
  type,
  position,
  ...props
}: IRotatingGeometry) {
  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--ifm-font-color-base")
    .trim();

  const { geometryRef } = useRotatingGeometry();
  const material = <meshStandardMaterial wireframe color={textColor} />;

  return (
    <>
      <mesh {...props} position={position} ref={geometryRef}>
        {geometryMap[type]}
        {material}
      </mesh>
      <Text
        font="/fonts/jetbrainsmono.woff"
        color={textColor}
        fontSize={0.08}
        position={[position[0], position[1] - 0.5, position[2]]}
      >
        {type}
      </Text>
    </>
  );
}

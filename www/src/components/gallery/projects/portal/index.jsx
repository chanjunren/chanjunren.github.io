import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import Portal from "./Portal";

export default function PortalWrapper() {
  const { position } = useControls("camera", {
    position: {
      value: [3, 1, 7],
      step: 0.01,
    },
    // color: "#ff0000",
    // visible: true,
    // myInterval: {
    //   min: 0,
    //   max: 10,
    //   value: [4, 5],
    // },
    // clickMe: button(() => {
    //   console.log("ok");
    // }),
    // choice: { options: ["a", "b", "c"] },
  });

  return (
    <Canvas
      flat
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: position,
      }}
    >
      <Portal />
    </Canvas>
  );
}

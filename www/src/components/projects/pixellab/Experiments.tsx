import { FC } from "react";
import Align from "./experiments/align";
import Chart from "./experiments/chart";
import Checkbox from "./experiments/checkbox";
import BouncingDownload from "./experiments/download";
import Dustbin from "./experiments/dustbin";
import Graph from "./experiments/graph";
import HandWave from "./experiments/handwave";
import NanCircle1 from "./experiments/nancircle1";
import PaperPlane from "./experiments/paperplane";

const Experiments: FC = () => {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-7 rounded-lg p-8 justify-items-center self-center mb-10 w-screen"
      style={
        {
          "--grid-line": "var(--gray-transparent-bg)",
          "--grid-size": "16px",
          backgroundImage: `
      repeating-linear-gradient(
        0deg,
        var(--grid-line) 0 1px,
        transparent 1px var(--grid-size)
      ),
      repeating-linear-gradient(
        90deg,
        var(--grid-line) 0 1px,
        transparent 1px var(--grid-size)

      )
    `,
        } as React.CSSProperties
      }
    >
      <HandWave />
      <PaperPlane />
      <Align />
      <Dustbin />
      <Graph />
      <BouncingDownload />
      <Chart />
      <NanCircle1 />
      <Checkbox />
    </div>
  );
};

export default Experiments;

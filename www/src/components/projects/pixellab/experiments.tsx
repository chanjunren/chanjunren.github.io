import {FC} from "react";
import HandWave from "@site/src/components/projects/pixelLab/experiments/handwave";
import PaperPlane from "@site/src/components/projects/pixelLab/experiments/paperplane";
import Align from "@site/src/components/projects/pixelLab/experiments/align";
import Dustbin from "@site/src/components/projects/pixelLab/experiments/dustbin";
import Graph from "@site/src/components/projects/pixelLab/experiments/graph";
import BouncingDownload from "@site/src/components/projects/pixelLab/experiments/download";
import Chart from "@site/src/components/projects/pixelLab/experiments/chart";
import NanCircle1 from "@site/src/components/projects/pixelLab/experiments/nancircle1";
import Checkbox from "@site/src/components/projects/pixelLab/experiments/checkbox";

const Experiments: FC = () => {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-7 rounded-lg p-8 justify-items-center self-center mb-10 w-screen"
      style={
        {
          "--grid-line": "rgba(152, 147, 165, 0.2)",
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
      <HandWave/>
      <PaperPlane/>
      <Align/>
      <Dustbin/>
      <Graph/>
      <BouncingDownload/>
      <Chart/>
      <NanCircle1/>
      <Checkbox/>
    </div>
  );
};

export default Experiments;

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
      className="grid grid-cols-2 md:grid-cols-5 rounded-lg border-gray-200 border-solid p-8 justify-items-center gap-8 w-fit self-center mb-10"
      style={{
        backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(209, 213, 219, 0.25) 10px,
            rgba(209, 213, 219, 0.25) 11px
          )`,
      }}
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

import { FC } from "react";
import PrimaryHeader from "../../common/PrimaryHeader";
import Align from "./experiments/align";
import BouncingDownload from "./experiments/download";
import Dustbin from "./experiments/dustbin";
import Graph from "./experiments/graph";
import HandWave from "./experiments/handwave";
import PaperPlane from "./experiments/paperplane";

const Experiments: FC = () => {
  return (
    <>
      <PrimaryHeader className="!justify-self-center">🚧 WIP</PrimaryHeader>
      <div className="grid grid-cols-5">
        <HandWave />
        <PaperPlane />
        <Align />
        <Dustbin />
        <Graph />
        <BouncingDownload />
      </div>
    </>
  );
};

export default Experiments;

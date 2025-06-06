import { FC } from "react";
import PrimaryHeader from "../../common/PrimaryHeader";
import Align from "./experiments/align";
import Dustbin from "./experiments/dustbin";
import Handwave from "./experiments/handwave";
import PaperPlane from "./experiments/paperplane";

const Experiments: FC = () => {
  return (
    <>
      <PrimaryHeader className="!justify-self-center">🚧 WIP</PrimaryHeader>
      <div className="grid grid-cols-5">
        <Handwave />
        <PaperPlane />
        <Align />
        <Dustbin />
      </div>
    </>
  );
};

export default Experiments;

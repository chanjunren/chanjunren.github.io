import { FC } from "react";
import Align from "./experiments/align";
import Handwave from "./experiments/handwave";
import PaperPlane from "./experiments/paperplane";

const Experiments: FC = () => {
  return (
    <div className="grid grid-cols-5">
      <Handwave />
      <Align />
      <PaperPlane />
    </div>
  );
};

export default Experiments;

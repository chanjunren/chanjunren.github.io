import { FC } from "react";
import Align from "./experiments/align";
import Handwave from "./experiments/handwave";

const Experiments: FC = () => {
  return (
    <div className="grid grid-cols-5">
      <Handwave />
      <Align />
    </div>
  );
};

export default Experiments;

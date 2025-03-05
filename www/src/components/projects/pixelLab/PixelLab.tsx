import { FC } from "react";
import Handwave from "./experiments/HandWave";

const PixelLab: FC = () => {
  return (
    <div className="grid grid-cols-5">
      <Handwave />
    </div>
  );
};

export default PixelLab;

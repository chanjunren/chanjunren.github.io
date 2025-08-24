import { FC, SVGProps } from "react";
import PixelLabContainer from "../../helpers/PixelLabContainer";

const CircleIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg width="50" viewBox="0 0 24 24">
      <circle
        strokeDasharray={38}
        strokeDashoffset={0}
        cx="12"
        cy="12"
        r="6"
        stroke="currentColor"
        fill="none"
      >
        <animate
          attributeName="stroke-dashoffset"
          to="38"
          dur="1s"
          fill="freeze"
          begin={"mouseenter"}
        />
        <animate
          attributeName="stroke-dashoffset"
          to="0"
          dur="1s"
          fill="freeze"
          begin={"mouseleave"}
        />
      </circle>
    </svg>
  );
};

const NanCircle1: FC = () => {
  return (
    <PixelLabContainer label="008" className="group cursor-cell">
      <CircleIcon className="p-6" />
    </PixelLabContainer>
  );
};

export default NanCircle1;

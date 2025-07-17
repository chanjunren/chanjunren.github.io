import { FC, SVGProps } from "react";
import ExperimentBackground from "../../helpers/ExperimentBackground";

const AlignIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg {...props} viewBox="0 0 24 24">
      <g
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke="currentColor"
        stroke-width="1.4"
        fill="none"
      >
        <line x1="4" y1="4" x2="4" y2="20" />
        <g className="group-hover:translate-x-1 transition-transform">
          <line x1="8" y1="12" x2="20" y2="12" />
          <polyline points="16,8 20,12 16,16" />
        </g>
      </g>
    </svg>
  );
};

const Align: FC = () => {
  return (
    <ExperimentBackground className="group cursor-cell">
      <AlignIcon className="p-6" />
    </ExperimentBackground>
  );
};

export default Align;

import { FC, SVGProps } from "react";
import PixelLabContainer from "../../helpers/container";

const GraphIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg id="charts" width="32" viewBox="0 0 100 100">
      <polyline
        points="20,50 40,75 60,25 80,50"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-linejoin="round"
        stroke-linecap="round"
      >
        <animate
          attributeName="points"
          to="20,50 40,25 60,75 80,50"
          dur="0.2s"
          fill="freeze"
          begin="charts.mouseenter"
        />
        <animate
          attributeName="points"
          to="20,50 40,75 60,25 80,50"
          dur="0.2s"
          fill="freeze"
          begin="charts.mouseleave"
        />
      </polyline>
    </svg>
  );
};

export default function Graph() {
  return (
    <PixelLabContainer label="005">
      <GraphIcon width={40} />
    </PixelLabContainer>
  );
}

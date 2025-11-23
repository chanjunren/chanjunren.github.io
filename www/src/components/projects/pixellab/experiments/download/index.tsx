import { FC, SVGProps } from "react";
import PixelLabContainer from "../../helpers/container";

const DownloadIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg id="bouncing_download" viewBox="0 0 24 24" width={30}>
      <g
        fill="none"
        stroke="currentColor"
        stroke-width="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g id="arrow">
          <line x1="12" y1="14" x2="12" y2="4" />
          <polyline points="9,11 12,14 15,11" />
          <animateTransform
            attributeName="transform"
            id="down"
            begin={"bouncing_download.click"}
            type="translate"
            to="0,5"
            dur="0.1s"
            fill="freeze"
          />
          <animateTransform
            attributeName="transform"
            begin={"down.endEvent"}
            type="translate"
            to="0,0"
            dur="0.1s"
            fill="freeze"
          />
        </g>
        <polyline id="tray" points="5,15 5,19 19,19 19,15">
          <animateTransform
            attributeName="transform"
            begin={"down.endEvent"}
            type="translate"
            to="0,4"
            id="tray_down"
            dur="0.1s"
            fill="freeze"
          />
          <animateTransform
            attributeName="transform"
            begin={"tray_down.endEvent"}
            type="translate"
            to="0,0"
            dur="0.1s"
            fill="freeze"
          />
        </polyline>
      </g>
    </svg>
  );
};

const BouncingDownload: FC = () => {
  return (
    <PixelLabContainer label="006" className="group cursor-cell">
      <DownloadIcon />
    </PixelLabContainer>
  );
};

export default BouncingDownload;
